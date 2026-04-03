#!/bin/bash
# Like One Studio — Cinema Grade V2: REALISM PIPELINE
# Transforms AI-generated video into footage indistinguishable from real camera work.
#
# The secret: imperfection. Real cameras have flaws. Real film has grain.
# Real lenses have aberration. Real hands have shake. We add all of it.
#
# Usage: bash studio/cinema-grade-v2.sh input.mp4 output.mp4 [preset] [--no-shake] [--no-aberration]
# Presets: arri (default), red, kodak, noir, warm, cool, vintage, documentary

set -e

INPUT="$1"
OUTPUT="$2"
PRESET="${3:-arri}"
NO_SHAKE=false
NO_ABERRATION=false

# Parse optional flags
for arg in "$@"; do
  case $arg in
    --no-shake) NO_SHAKE=true ;;
    --no-aberration) NO_ABERRATION=true ;;
  esac
done

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: bash studio/cinema-grade-v2.sh input.mp4 output.mp4 [preset] [--no-shake] [--no-aberration]"
  echo "Presets: arri, red, kodak, noir, warm, cool, vintage, documentary"
  exit 1
fi

[ ! -f "$INPUT" ] && echo "❌ Input not found: $INPUT" && exit 1

# ═══════════════════════════════════════════════
# COLOR SCIENCE (per preset)
# ═══════════════════════════════════════════════
case "$PRESET" in
  arri)
    # ARRI Alexa: lifted blacks, gentle rolloff, warm mids, desaturated greens
    GRADE="eq=contrast=1.05:brightness=0.02:saturation=0.92"
    COLOR="colorbalance=rs=0.03:gs=-0.01:bs=-0.02:rm=0.02:gm=0.0:bm=-0.01:rh=0.01:gh=0.0:bh=-0.02"
    CURVES="curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95'"
    GRAIN_S=5  # grain strength (luma)
    GRAIN_C=4  # grain strength (chroma)
    VIGNETTE="PI/5"
    ;;
  red)
    # RED V-Raptor: rich color, punchy, deeper blacks
    GRADE="eq=contrast=1.12:brightness=-0.01:saturation=1.05"
    COLOR="colorbalance=rs=0.02:gs=-0.02:bs=0.0:rm=0.01:gm=-0.01:bm=0.01"
    CURVES="curves=m='0/0.02 0.15/0.12 0.5/0.5 0.85/0.88 1/0.97'"
    GRAIN_S=4
    GRAIN_C=3
    VIGNETTE="PI/5"
    ;;
  kodak)
    # Kodak Vision3 500T: warm, organic, nostalgic, halation
    GRADE="eq=contrast=1.04:brightness=0.01:saturation=0.88"
    COLOR="colorbalance=rs=0.05:gs=0.02:bs=-0.03:rm=0.04:gm=0.01:bm=-0.02:rh=0.03:gh=0.01:bh=-0.01"
    CURVES="curves=m='0/0.08 0.25/0.28 0.5/0.53 0.75/0.78 1/0.94'"
    GRAIN_S=8
    GRAIN_C=6
    VIGNETTE="PI/4.5"
    ;;
  noir)
    # Cinematic noir: high contrast, desaturated, dramatic shadows
    GRADE="eq=contrast=1.25:brightness=-0.03:saturation=0.35"
    COLOR="colorbalance=rs=-0.01:gs=-0.01:bs=0.02:rm=0.0:gm=0.0:bm=0.01"
    CURVES="curves=m='0/0.0 0.2/0.1 0.5/0.5 0.8/0.9 1/1.0'"
    GRAIN_S=10
    GRAIN_C=8
    VIGNETTE="PI/4"
    ;;
  warm)
    # Golden hour: Terrence Malick / Lubezki / Days of Heaven
    GRADE="eq=contrast=1.03:brightness=0.02:saturation=0.95"
    COLOR="colorbalance=rs=0.06:gs=0.03:bs=-0.04:rm=0.04:gm=0.02:bm=-0.03:rh=0.02:gh=0.01:bh=-0.03"
    CURVES="curves=m='0/0.05 0.25/0.28 0.5/0.54 0.75/0.79 1/0.96'"
    GRAIN_S=6
    GRAIN_C=5
    VIGNETTE="PI/5"
    ;;
  cool)
    # Cool blue: David Fincher / Deakins / Sicario
    GRADE="eq=contrast=1.08:brightness=-0.02:saturation=0.85"
    COLOR="colorbalance=rs=-0.03:gs=-0.01:bs=0.04:rm=-0.02:gm=0.0:bm=0.03:rh=-0.01:gh=0.0:bh=0.02"
    CURVES="curves=m='0/0.03 0.2/0.18 0.5/0.48 0.8/0.82 1/0.96'"
    GRAIN_S=5
    GRAIN_C=4
    VIGNETTE="PI/5"
    ;;
  vintage)
    # 16mm film: heavy grain, halation glow, warm cast, gate weave
    GRADE="eq=contrast=1.02:brightness=0.03:saturation=0.82"
    COLOR="colorbalance=rs=0.06:gs=0.03:bs=-0.05:rm=0.05:gm=0.02:bm=-0.04"
    CURVES="curves=m='0/0.10 0.25/0.30 0.5/0.55 0.75/0.78 1/0.92'"
    GRAIN_S=12
    GRAIN_C=10
    VIGNETTE="PI/4"
    ;;
  documentary)
    # Natural/neutral: minimal grade, organic feel, subtle imperfections
    GRADE="eq=contrast=1.02:brightness=0.0:saturation=0.96"
    COLOR="colorbalance=rs=0.01:gs=0.0:bs=-0.01"
    CURVES="curves=m='0/0.04 0.25/0.26 0.5/0.51 0.75/0.76 1/0.96'"
    GRAIN_S=4
    GRAIN_C=3
    VIGNETTE="PI/6"
    ;;
  *)
    echo "❌ Unknown preset: $PRESET"; exit 1
    ;;
esac

# ═══════════════════════════════════════════════
# REALISM LAYERS (the secret sauce)
# ═══════════════════════════════════════════════

# Layer: Film grain (temporal — different per frame via allf=t flag)
GRAIN="noise=c0s=${GRAIN_S}:c1s=${GRAIN_C}:allf=t+u"

# Layer: Chromatic aberration (real lenses separate RGB slightly at edges)
# rgbashift shifts R and B channels by 1-2 pixels — simulates lateral CA
if [ "$NO_ABERRATION" = false ]; then
  ABERRATION="rgbashift=rh=-1:bh=1:rv=1:bv=-1"
else
  ABERRATION=""
fi

# Layer: Subtle vignette (real lenses darken at edges)
VIGNETTE_FILTER="vignette=${VIGNETTE}"

# Layer: Highlight rolloff (prevent hard clipping — real film has soft shoulder)
# Compress highlights: anything above 85% gets gently rolled off
ROLLOFF="curves=m='0/0 0.5/0.5 0.85/0.87 0.95/0.93 1/0.95'"

# Layer: Micro-contrast (local contrast enhancement — gives texture "bite")
# Subtle unsharp mask with small radius = local contrast, not edge sharpening
MICRO_CONTRAST="unsharp=5:5:0.4:5:5:0.0"

# Layer: Camera shake (subtle handheld micro-jitter)
# Random sub-pixel translation that changes per frame
if [ "$NO_SHAKE" = false ]; then
  # sine wave with noise creates organic micro-movement
  # amplitude: 1.5px horizontal, 1px vertical — barely perceptible but breaks AI smoothness
  SHAKE="crop=iw-4:ih-4:2+1.5*sin(n*0.7+0.3*sin(n*2.1)):2+1.0*sin(n*0.9+0.4*sin(n*1.7)),scale=iw+4:ih+4:flags=lanczos"
else
  SHAKE=""
fi

# Layer: Letterbox 2.39:1 (cinematic aspect ratio)
LETTERBOX="crop=iw:round(iw/2.39/2)*2:0:(ih-round(iw/2.39/2)*2)/2"

# ═══════════════════════════════════════════════
# BUILD FILTER CHAIN
# ═══════════════════════════════════════════════
# Order matters:
# 1. Letterbox (crop to cinema ratio)
# 2. Color grade (lift, gamma, gain, saturation)
# 3. Color balance (per-range RGB shift)
# 4. Tone curves (film response curve)
# 5. Highlight rolloff (soft shoulder)
# 6. Chromatic aberration (lens imperfection)
# 7. Film grain (temporal, organic)
# 8. Vignette (lens falloff)
# 9. Micro-contrast (texture bite)
# 10. Camera shake (handheld feel)
# 11. Final format conversion

FILTER="${LETTERBOX}"
FILTER="${FILTER},${GRADE}"
FILTER="${FILTER},${COLOR}"
FILTER="${FILTER},${CURVES}"
FILTER="${FILTER},${ROLLOFF}"

[ -n "$ABERRATION" ] && FILTER="${FILTER},${ABERRATION}"

FILTER="${FILTER},${GRAIN}"
FILTER="${FILTER},${VIGNETTE_FILTER}"
FILTER="${FILTER},${MICRO_CONTRAST}"

[ -n "$SHAKE" ] && FILTER="${FILTER},${SHAKE}"

FILTER="${FILTER},format=yuv420p"

# ═══════════════════════════════════════════════
# RENDER
# ═══════════════════════════════════════════════
echo "🎬 CINEMA GRADE V2 — Preset: $PRESET"
echo "   Realism layers: grain(${GRAIN_S}) + aberration + rolloff + micro-contrast + shake + vignette"
echo "   Input:  $INPUT"
echo "   Output: $OUTPUT"

ffmpeg -y -i "$INPUT" -vf "$FILTER" \
  -c:v libx264 -crf 16 -preset slow \
  -c:a copy \
  "$OUTPUT" 2>/dev/null

DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUTPUT")
SIZE=$(du -h "$OUTPUT" | awk '{print $1}')
echo "✅ ${DUR}s | ${SIZE} | $PRESET → $OUTPUT"
