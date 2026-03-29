#!/bin/bash
# Like One Studio V6 — Cinema Grade Pipeline
# Transforms AI-generated video into RED/ARRI cinema-grade footage
#
# Usage: bash studio/cinema-grade.sh input.mp4 output.mp4 [preset]
# Presets: arri (default), red, kodak, noir, warm, cool

set -e

INPUT="$1"
OUTPUT="$2"
PRESET="${3:-arri}"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: bash studio/cinema-grade.sh input.mp4 output.mp4 [preset]"
  echo "Presets: arri, red, kodak, noir, warm, cool"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "❌ Input not found: $INPUT"
  exit 1
fi

# Curves use spaces (not colons) to separate points — FFmpeg requirement
case "$PRESET" in
  arri)
    # ARRI Alexa: lifted blacks, gentle rolloff, warm mids, desaturated greens
    GRADE="eq=contrast=1.05:brightness=0.02:saturation=0.92,colorbalance=rs=0.03:gs=-0.01:bs=-0.02:rm=0.02:gm=0.0:bm=-0.01:rh=0.01:gh=0.0:bh=-0.02,curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95'"
    GRAIN="noise=c0s=5:c1s=4:allf=t+u"
    ;;
  red)
    # RED: higher contrast, richer color, deeper blacks
    GRADE="eq=contrast=1.12:brightness=-0.01:saturation=1.05,colorbalance=rs=0.02:gs=-0.02:bs=0.0:rm=0.01:gm=-0.01:bm=0.01,curves=m='0/0.02 0.15/0.12 0.5/0.5 0.85/0.88 1/0.97'"
    GRAIN="noise=c0s=4:c1s=3:allf=t+u"
    ;;
  kodak)
    # Kodak film stock: warm, organic, nostalgic, halation feel
    GRADE="eq=contrast=1.04:brightness=0.01:saturation=0.88,colorbalance=rs=0.05:gs=0.02:bs=-0.03:rm=0.04:gm=0.01:bm=-0.02:rh=0.03:gh=0.01:bh=-0.01,curves=m='0/0.08 0.25/0.28 0.5/0.53 0.75/0.78 1/0.94'"
    GRAIN="noise=c0s=8:c1s=6:allf=t+u"
    ;;
  noir)
    # Cinematic noir: high contrast, desaturated, dramatic
    GRADE="eq=contrast=1.25:brightness=-0.03:saturation=0.35,colorbalance=rs=-0.01:gs=-0.01:bs=0.02:rm=0.0:gm=0.0:bm=0.01,curves=m='0/0.0 0.2/0.1 0.5/0.5 0.8/0.9 1/1.0'"
    GRAIN="noise=c0s=10:c1s=8:allf=t+u"
    ;;
  warm)
    # Warm golden hour: Terrence Malick / Lubezki
    GRADE="eq=contrast=1.03:brightness=0.02:saturation=0.95,colorbalance=rs=0.06:gs=0.03:bs=-0.04:rm=0.04:gm=0.02:bm=-0.03:rh=0.02:gh=0.01:bh=-0.03,curves=m='0/0.05 0.25/0.28 0.5/0.54 0.75/0.79 1/0.96'"
    GRAIN="noise=c0s=6:c1s=5:allf=t+u"
    ;;
  cool)
    # Cool blue: David Fincher / Sicario / Deakins
    GRADE="eq=contrast=1.08:brightness=-0.02:saturation=0.85,colorbalance=rs=-0.03:gs=-0.01:bs=0.04:rm=-0.02:gm=0.0:bm=0.03:rh=-0.01:gh=0.0:bh=0.02,curves=m='0/0.03 0.2/0.18 0.5/0.48 0.8/0.82 1/0.96'"
    GRAIN="noise=c0s=5:c1s=4:allf=t+u"
    ;;
  *)
    echo "❌ Unknown preset: $PRESET"; exit 1
    ;;
esac

# Full chain: letterbox → grade → grain → vignette → sharpen
FILTER="crop=iw:round(iw/2.39/2)*2:0:(ih-round(iw/2.39/2)*2)/2,${GRADE},${GRAIN},vignette=PI/5,unsharp=3:3:0.3,format=yuv420p"

echo "🎬 CINEMA GRADE — Preset: $PRESET"
echo "   Input:  $INPUT"
echo "   Output: $OUTPUT"

ffmpeg -y -i "$INPUT" -vf "$FILTER" -c:v libx264 -crf 16 -preset slow -c:a copy "$OUTPUT" 2>/dev/null

DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUTPUT")
SIZE=$(du -h "$OUTPUT" | awk '{print $1}')
echo "✅ ${DUR}s | ${SIZE} | $PRESET → $OUTPUT"
