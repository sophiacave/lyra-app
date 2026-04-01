#!/bin/bash
# ═══════════════════════════════════════════════════════════
# LIKE ONE STUDIO — V9 Production Pipeline
# One command → cinema-grade video from screenplay JSON
#
# Usage: bash studio/produce-v9.sh screenplays/your-first-conversation-v9.json
#
# Dependencies: jq, ffmpeg, mflux (in venvs/imagegen), curl, openssl
# Services: Fish S2-Pro on localhost:8180, Kling API keys in .env
# ═══════════════════════════════════════════════════════════
set -uo pipefail  # no -e: individual failures don't kill the pipeline

STUDIO_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$STUDIO_DIR")"
SCREENPLAY="$1"
MFLUX="$STUDIO_DIR/venvs/imagegen/bin/mflux-generate"

# Load env
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
fi
if [ -f "$ROOT_DIR/.env.local" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env.local" | xargs)
fi

# Parse screenplay
TITLE=$(jq -r '.title' "$STUDIO_DIR/$SCREENPLAY")
TITLE_SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
SCENE_COUNT=$(jq '.scenes | length' "$STUDIO_DIR/$SCREENPLAY")
OUT_DIR="$ROOT_DIR/output/v9/$TITLE_SLUG"

echo "═══════════════════════════════════════════════════════════"
echo "  🎬 LIKE ONE STUDIO V9 — $TITLE"
echo "  📝 $SCENE_COUNT scenes → $OUT_DIR"
echo "═══════════════════════════════════════════════════════════"

mkdir -p "$OUT_DIR"

# ── CINEMA GRADE PRESETS (ffmpeg filters) ──
ARRI_GRADE="eq=contrast=1.05:brightness=0.02:saturation=0.92,colorbalance=rs=0.03:gs=-0.01:bs=-0.02:rm=0.02:gm=0.0:bm=-0.01:rh=0.01:gh=0.0:bh=-0.02,curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95'"
ARRI_GRAIN="noise=c0s=5:c1s=4:allf=t+u"

# ── KLING JWT (HS256 via openssl) ──
kling_jwt() {
  local NOW=$(date +%s)
  local EXP=$((NOW + 1800))
  local HEADER=$(echo -n '{"typ":"JWT","alg":"HS256"}' | openssl base64 -e | tr -d '\n=' | tr '+/' '-_')
  local PAYLOAD=$(echo -n "{\"iss\":\"$KLING_ACCESS_KEY\",\"exp\":$EXP,\"nbf\":$((NOW-5)),\"iat\":$NOW}" | openssl base64 -e | tr -d '\n=' | tr '+/' '-_')
  local SIG=$(echo -n "$HEADER.$PAYLOAD" | openssl dgst -sha256 -hmac "$KLING_SECRET_KEY" -binary | openssl base64 -e | tr -d '\n=' | tr '+/' '-_')
  echo "$HEADER.$PAYLOAD.$SIG"
}

# ═══════════════════════════════════════
# PHASE 1: KEYFRAMES (mflux)
# ═══════════════════════════════════════
echo ""
echo "── PHASE 1: KEYFRAMES ──────────────────────────────────"

for i in $(seq 0 $((SCENE_COUNT - 1))); do
  SCENE_ID=$(jq -r ".scenes[$i].id" "$STUDIO_DIR/$SCREENPLAY")
  VISUAL=$(jq -r ".scenes[$i].visual" "$STUDIO_DIR/$SCREENPLAY")
  SEED=$(jq -r ".scenes[$i].seed // 42" "$STUDIO_DIR/$SCREENPLAY")
  SCENE_DIR="$OUT_DIR/scene-$SCENE_ID"
  mkdir -p "$SCENE_DIR"

  KF="$SCENE_DIR/keyframe.png"
  if [ -f "$KF" ]; then
    echo "  ✅ [$SCENE_ID] keyframe exists, skipping"
    continue
  fi

  echo "  🎨 [$SCENE_ID] Generating keyframe (seed $SEED)..."
  "$MFLUX" --model schnell \
    --prompt "$VISUAL" \
    --width 1920 --height 1080 --steps 4 --seed "$SEED" \
    --output "$KF" 2>&1 | tail -1
  echo "  ✅ [$SCENE_ID] keyframe: $(du -h "$KF" | cut -f1)"
done

# ═══════════════════════════════════════
# PHASE 2: NARRATION (Fish S2-Pro)
# ═══════════════════════════════════════
echo ""
echo "── PHASE 2: NARRATION ──────────────────────────────────"

# Check S2-Pro health
if ! curl -s --max-time 3 http://127.0.0.1:8180/v1/health > /dev/null 2>&1; then
  echo "  ⚠️  Fish S2-Pro not running. Starting..."
  bash "$STUDIO_DIR/tts/start-s2pro.sh"
fi

# Load voice reference
VOICE_REF="$STUDIO_DIR/voices/faye-reference.wav"
VOICE_REF_B64=$(base64 -i "$VOICE_REF")
VOICE_REF_TEXT="Some call me nature, others call me mother nature."

for i in $(seq 0 $((SCENE_COUNT - 1))); do
  SCENE_ID=$(jq -r ".scenes[$i].id" "$STUDIO_DIR/$SCREENPLAY")
  DIALOGUE=$(jq -r ".scenes[$i].dialogue" "$STUDIO_DIR/$SCREENPLAY")
  SCENE_DIR="$OUT_DIR/scene-$SCENE_ID"

  NAR="$SCENE_DIR/narration.wav"
  if [ -f "$NAR" ]; then
    echo "  ✅ [$SCENE_ID] narration exists, skipping"
    continue
  fi

  echo "  🗣️  [$SCENE_ID] Generating narration..."

  # Build JSON payload with voice reference — write to temp file to avoid shell escaping issues
  TMP_PAYLOAD="$SCENE_DIR/tts-payload.json"
  jq -n \
    --arg text "$DIALOGUE" \
    --arg audio "$VOICE_REF_B64" \
    --arg reftext "$VOICE_REF_TEXT" \
    '{
      text: $text,
      references: [{audio: $audio, text: $reftext}],
      format: "wav",
      temperature: 0.7,
      top_p: 0.7,
      repetition_penalty: 1.5
    }' > "$TMP_PAYLOAD"

  curl -s --max-time 600 \
    -X POST http://127.0.0.1:8180/v1/tts \
    -H "Content-Type: application/json" \
    -d @"$TMP_PAYLOAD" \
    -o "$NAR"

  rm -f "$TMP_PAYLOAD"

  if [ -f "$NAR" ] && [ $(stat -f%z "$NAR") -gt 1000 ]; then
    DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$NAR" 2>/dev/null || echo "?")
    echo "  ✅ [$SCENE_ID] narration: $(du -h "$NAR" | cut -f1), ${DUR}s"
  else
    echo "  ❌ [$SCENE_ID] narration FAILED — file too small or empty"
    rm -f "$NAR"
  fi
done

# ═══════════════════════════════════════
# PHASE 3: MOTION (Kling T2V or I2V)
# ═══════════════════════════════════════
echo ""
echo "── PHASE 3: MOTION (Kling T2V / I2V) ─────────────────"

KLING_BASE="https://api-singapore.klingai.com"
KLING_NEG="cgi, 3d render, digital art, illustration, anime, cartoon, plastic, airbrushed, smooth skin, oversaturated, hdr, watermark, artificial lighting, perfect symmetry, uncanny valley, blur, distortion, morphing, extra limbs, flickering, compression artifacts"

# Helper: poll Kling task to completion
kling_poll() {
  local TASK_ID="$1"
  local ENDPOINT="$2"
  local OUT_FILE="$3"
  local LABEL="$4"

  for POLL in $(seq 1 60); do
    sleep 10
    local JWT_POLL=$(kling_jwt)
    local STATUS_RESP=$(curl -s --max-time 15 \
      -H "Authorization: Bearer $JWT_POLL" \
      "$KLING_BASE/v1/videos/${ENDPOINT}/$TASK_ID")

    local STATUS=$(echo "$STATUS_RESP" | jq -r '.data.task_status // "unknown"')

    if [ "$STATUS" = "succeed" ]; then
      local VIDEO_URL=$(echo "$STATUS_RESP" | jq -r '.data.task_result.videos[0].url // empty')
      if [ -n "$VIDEO_URL" ]; then
        curl -sL --max-time 60 "$VIDEO_URL" -o "$OUT_FILE"
        echo "  ✅ [$LABEL] Kling complete: $(du -h "$OUT_FILE" | cut -f1)"
        return 0
      else
        echo "  ❌ [$LABEL] No video URL in response"
        return 1
      fi
    elif [ "$STATUS" = "failed" ]; then
      echo "  ❌ [$LABEL] Kling failed: $(echo "$STATUS_RESP" | jq -r '.data.task_status_msg // "unknown"')"
      return 1
    fi

    printf "  ⏳ [$LABEL] %ds... (%s)\r" $((POLL * 10)) "$STATUS"
  done
  return 1
}

for i in $(seq 0 $((SCENE_COUNT - 1))); do
  SCENE_ID=$(jq -r ".scenes[$i].id" "$STUDIO_DIR/$SCREENPLAY")
  VISUAL=$(jq -r ".scenes[$i].visual" "$STUDIO_DIR/$SCREENPLAY")
  MOTION=$(jq -r ".scenes[$i].motion // empty" "$STUDIO_DIR/$SCREENPLAY")
  ANIMATE=$(jq -r ".scenes[$i].animate // false" "$STUDIO_DIR/$SCREENPLAY")
  MOTION_MODE=$(jq -r ".scenes[$i].motion_mode // \"t2v\"" "$STUDIO_DIR/$SCREENPLAY")
  DURATION=$(jq -r ".scenes[$i].duration_s // 5" "$STUDIO_DIR/$SCREENPLAY")
  SCENE_DIR="$OUT_DIR/scene-$SCENE_ID"

  MOT="$SCENE_DIR/motion.mp4"
  if [ -f "$MOT" ]; then
    echo "  ✅ [$SCENE_ID] motion exists, skipping"
    continue
  fi

  if [ "$ANIMATE" != "true" ]; then
    echo "  ⏭️  [$SCENE_ID] no animation requested, using static frame"
    KF="$SCENE_DIR/keyframe.png"
    NDUR=$( [ "$DURATION" -gt 5 ] && echo "$DURATION" || echo "5" )
    ffmpeg -y -loop 1 -i "$KF" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -t "$NDUR" -c:v libx264 -crf 18 -preset slow "$MOT" 2>/dev/null
    echo "  ✅ [$SCENE_ID] static: ${NDUR}s"
    continue
  fi

  JWT=$(kling_jwt)
  KLING_DUR="5"
  [ "$DURATION" -gt 7 ] && KLING_DUR="10"
  PAYLOAD_FILE="$SCENE_DIR/kling-payload.json"

  if [ "$MOTION_MODE" = "i2v" ]; then
    # ── I2V: Animate keyframe with motion prompt ──
    echo "  🎥 [$SCENE_ID] Submitting to Kling I2V..."
    KF="$SCENE_DIR/keyframe.png"
    IMG_B64_FILE="$SCENE_DIR/keyframe.b64"
    base64 -i "$KF" | tr -d '\n' > "$IMG_B64_FILE"

    python3 -c "
import json, sys
with open('$IMG_B64_FILE', 'r') as f:
    img = f.read()
payload = {
    'model_name': 'kling-v2-master',
    'image': img,
    'prompt': sys.argv[1],
    'negative_prompt': sys.argv[2],
    'mode': 'pro',
    'duration': sys.argv[3]
}
with open('$PAYLOAD_FILE', 'w') as f:
    json.dump(payload, f)
" "$MOTION" "$KLING_NEG" "$KLING_DUR"

    RESP=$(curl -s --max-time 30 \
      -X POST "$KLING_BASE/v1/videos/image2video" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT" \
      -d @"$PAYLOAD_FILE")
    rm -f "$IMG_B64_FILE" "$PAYLOAD_FILE"
    KLING_ENDPOINT="image2video"

  else
    # ── T2V (default): Generate video directly from visual prompt ──
    echo "  🎥 [$SCENE_ID] Submitting to Kling T2V..."
    PROMPT_TEXT="$VISUAL"
    [ -n "$MOTION" ] && PROMPT_TEXT="$VISUAL. $MOTION"

    python3 -c "
import json, sys
payload = {
    'model_name': 'kling-v2-master',
    'prompt': sys.argv[1],
    'negative_prompt': sys.argv[2],
    'mode': 'pro',
    'duration': sys.argv[3],
    'aspect_ratio': '16:9'
}
with open(sys.argv[4], 'w') as f:
    json.dump(payload, f)
" "$PROMPT_TEXT" "$KLING_NEG" "$KLING_DUR" "$PAYLOAD_FILE"

    RESP=$(curl -s --max-time 30 \
      -X POST "$KLING_BASE/v1/videos/text2video" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT" \
      -d @"$PAYLOAD_FILE")
    rm -f "$PAYLOAD_FILE"
    KLING_ENDPOINT="text2video"
  fi

  TASK_ID=$(echo "$RESP" | jq -r '.data.task_id // empty')

  if [ -z "$TASK_ID" ]; then
    echo "  ❌ [$SCENE_ID] Kling submit failed: $RESP"
    echo "  ⏭️  Falling back to static frame..."
    KF="$SCENE_DIR/keyframe.png"
    NDUR=$( [ "$DURATION" -gt 5 ] && echo "$DURATION" || echo "5" )
    ffmpeg -y -loop 1 -i "$KF" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -t "$NDUR" -c:v libx264 -crf 18 -preset slow "$MOT" 2>/dev/null
    continue
  fi

  echo "  ⏳ [$SCENE_ID] Task: $TASK_ID — polling..."
  kling_poll "$TASK_ID" "$KLING_ENDPOINT" "$MOT" "$SCENE_ID"

  # Fallback if no motion file
  if [ ! -f "$MOT" ]; then
    echo "  ⏭️  [$SCENE_ID] Kling failed, using static frame..."
    KF="$SCENE_DIR/keyframe.png"
    NDUR=$( [ "$DURATION" -gt 5 ] && echo "$DURATION" || echo "5" )
    ffmpeg -y -loop 1 -i "$KF" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -t "$NDUR" -c:v libx264 -crf 18 -preset slow "$MOT" 2>/dev/null
  fi
done

# ═══════════════════════════════════════
# PHASE 4: CINEMA GRADE (ffmpeg)
# ═══════════════════════════════════════
echo ""
echo "── PHASE 4: CINEMA GRADE ───────────────────────────────"

for i in $(seq 0 $((SCENE_COUNT - 1))); do
  SCENE_ID=$(jq -r ".scenes[$i].id" "$STUDIO_DIR/$SCREENPLAY")
  SCENE_DIR="$OUT_DIR/scene-$SCENE_ID"
  MOT="$SCENE_DIR/motion.mp4"
  GRADED="$SCENE_DIR/graded.mp4"

  if [ -f "$GRADED" ]; then
    echo "  ✅ [$SCENE_ID] graded exists, skipping"
    continue
  fi

  if [ ! -f "$MOT" ]; then
    echo "  ⏭️  [$SCENE_ID] no motion file, skipping grade"
    continue
  fi

  echo "  🎬 [$SCENE_ID] Grading (ARRI)..."
  ffmpeg -y -i "$MOT" \
    -vf "$ARRI_GRADE,$ARRI_GRAIN,vignette=PI/5,unsharp=3:3:0.3,format=yuv420p" \
    -c:v libx264 -crf 16 -preset slow -c:a copy \
    "$GRADED" 2>/dev/null
  echo "  ✅ [$SCENE_ID] graded: $(du -h "$GRADED" | cut -f1)"
done

# ═══════════════════════════════════════
# PHASE 5: COMPOSE (ffmpeg concat + audio)
# ═══════════════════════════════════════
echo ""
echo "── PHASE 5: COMPOSE ────────────────────────────────────"

CONCAT_LIST="$OUT_DIR/concat.txt"
> "$CONCAT_LIST"

for i in $(seq 0 $((SCENE_COUNT - 1))); do
  SCENE_ID=$(jq -r ".scenes[$i].id" "$STUDIO_DIR/$SCREENPLAY")
  SCENE_DIR="$OUT_DIR/scene-$SCENE_ID"
  GRADED="$SCENE_DIR/graded.mp4"
  NAR="$SCENE_DIR/narration.wav"
  PAUSE=$(jq -r ".scenes[$i].pacing.pause_after_s // 1" "$STUDIO_DIR/$SCREENPLAY")

  if [ ! -f "$GRADED" ]; then
    echo "  ⏭️  [$SCENE_ID] no graded video, skipping"
    continue
  fi

  # Get narration duration
  NAR_DUR="0"
  if [ -f "$NAR" ]; then
    NAR_DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$NAR" 2>/dev/null || echo "0")
  fi

  # Get video duration
  VID_DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$GRADED" 2>/dev/null || echo "5")

  # Target scene duration = max(narration, video) + pause
  TARGET_DUR=$(python3 -c "print(max(float('$NAR_DUR'), float('$VID_DUR')) + float('$PAUSE'))")

  # Merge narration onto graded video, extend/trim to target duration
  SCENE_FINAL="$SCENE_DIR/final.mp4"
  if [ -f "$NAR" ]; then
    ffmpeg -y -i "$GRADED" -i "$NAR" \
      -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=10[v];[1:a]apad=pad_dur=10[a]" \
      -map "[v]" -map "[a]" \
      -t "$TARGET_DUR" \
      -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k \
      "$SCENE_FINAL" 2>/dev/null
  else
    ffmpeg -y -i "$GRADED" -t "$TARGET_DUR" \
      -c:v libx264 -crf 18 -preset slow -an \
      "$SCENE_FINAL" 2>/dev/null
  fi

  echo "file '$SCENE_FINAL'" >> "$CONCAT_LIST"
  echo "  ✅ [$SCENE_ID] scene final: ${TARGET_DUR}s"
done

# Concatenate all scenes
FINAL="$OUT_DIR/final.mp4"
echo ""
echo "  🎬 Concatenating $(wc -l < "$CONCAT_LIST" | tr -d ' ') scenes..."
ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" \
  -c:v libx264 -crf 16 -preset slow -c:a aac -b:a 192k \
  "$FINAL" 2>/dev/null

FINAL_DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$FINAL" 2>/dev/null || echo "?")
FINAL_SIZE=$(du -h "$FINAL" | cut -f1)

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ COMPLETE: $FINAL"
echo "  📊 Duration: ${FINAL_DUR}s | Size: $FINAL_SIZE"
echo "  🎬 $SCENE_COUNT scenes composed"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Review: open $FINAL"
