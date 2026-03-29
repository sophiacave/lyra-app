#!/bin/zsh
# Fractal Mac Link — one-time install
set -e
echo "⚡ Installing fractal_mac_mcp..."
pip3 install -r "$(dirname "$0")/requirements.txt" --quiet
echo "✅ Dependencies installed"
echo ""
echo "📋 Add this to ~/.claude.json mcpServers section:"
echo '{
  "fractal-mac-link": {
    "command": "python3",
    "args": ["/Users/sophiacave/.fractal_brain/fractal-mac-link/server.py"],
    "env": {}
  }
}'
