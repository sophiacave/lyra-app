#!/bin/bash
# Start Fish S2 Pro API server on M3 Max
# Models load once (~70s), then serve requests instantly.
# Run this once per session. Server stays alive in background.

FISH_DIR="$HOME/likeone-workspace/code/fish-speech"
LOG="/tmp/fish-s2pro-server.log"

# Check if already running
if curl -s http://127.0.0.1:8180/v1/health > /dev/null 2>&1; then
  echo "✅ S2 Pro server already running"
  exit 0
fi

echo "🔊 Starting Fish S2 Pro server (model loading takes ~70s)..."
cd "$FISH_DIR" && nohup .venv/bin/python tools/api_server.py \
  --llama-checkpoint-path checkpoints/s2-pro \
  --decoder-checkpoint-path checkpoints/s2-pro/codec.pth \
  --decoder-config-name modded_dac_vq \
  --device mps \
  --listen 127.0.0.1:8180 \
  > "$LOG" 2>&1 &

echo "PID: $!"
echo "Waiting for warmup..."

# Wait for server to be ready (up to 3 minutes)
for i in $(seq 1 180); do
  if curl -s http://127.0.0.1:8180/v1/health > /dev/null 2>&1; then
    echo "✅ S2 Pro server ready (${i}s)"
    exit 0
  fi
  sleep 1
done

echo "❌ Server failed to start. Check $LOG"
exit 1
