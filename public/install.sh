#!/bin/bash
# ◈ FRACTAL BRAIN — One-Click Installer
# Installs the Like One intelligence layer on a new computer
# Usage: curl -fsSL https://likeone.ai/install.sh | bash

set -e
BRAIN_DIR="$HOME/.fractal_brain"
TOOLS_DIR="$BRAIN_DIR/tools"
MCP_DIR="$BRAIN_DIR/brain-mcp-server"
BASE_URL="https://likeone.ai/brain-tools"
MCP_URL="https://likeone.ai/brain-mcp"

echo ""
echo "◈ FRACTAL BRAIN INSTALLER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Create directory structure
echo "📁 Creating ~/.fractal_brain/ ..."
mkdir -p "$TOOLS_DIR" "$BRAIN_DIR/logs" "$BRAIN_DIR/backups"
mkdir -p "$MCP_DIR/dist"

# 2. Download brain tools
echo "🧠 Downloading brain tools ..."
TOOLS=(
  "brain.py"
  "orchestrator.py"
  "health_monitor.py"
  "sync_to_brain.py"
  "local_logger.py"
  "session_bootstrap.py"
  "auto_fix.py"
  "brain_patch.py"
  "dashboard.py"
)

for tool in "${TOOLS[@]}"; do
  echo "  ↓ $tool"
  curl -fsSL "$BASE_URL/$tool" -o "$TOOLS_DIR/$tool" || echo "  ⚠ Failed: $tool"
done
echo "  ✓ Tools downloaded"

# 3. Download and install Brain MCP server
echo "🔌 Installing Brain MCP server ..."
curl -fsSL "$MCP_URL/index.js" -o "$MCP_DIR/dist/index.js"
curl -fsSL "$MCP_URL/package.json" -o "$MCP_DIR/package.json"
curl -fsSL "$MCP_URL/package-lock.json" -o "$MCP_DIR/package-lock.json"
cd "$MCP_DIR" && npm install --production --silent 2>&1 | tail -3
echo "  ✓ Brain MCP server installed"

# 4. Auto-fetch .env from PIN endpoint
echo "🔑 Fetching credentials ..."
if [ ! -f "$BRAIN_DIR/.env" ] || grep -q "PASTE_FROM" "$BRAIN_DIR/.env" 2>/dev/null; then
  curl -s "https://likeone.ai/api/env-config?pin=9135" \
    | python3 -c "import sys,json; e=json.load(sys.stdin)['env']; print(e.replace('SUPABASE_SERVICE_KEY','SUPABASE_KEY'))" \
    > "$BRAIN_DIR/.env" 2>/dev/null
  if [ -s "$BRAIN_DIR/.env" ]; then
    echo "  ✓ Credentials auto-configured"
  else
    echo "  ⚠ Auto-fetch failed — visit likeone.ai/_temp to get credentials"
  fi
else
  echo "  ✓ .env already configured"
fi

# 5. Create brain CLI
echo "⚡ Installing brain CLI ..."
curl -fsSL "$BASE_URL/brain-cli" -o "$TOOLS_DIR/brain"
chmod +x "$TOOLS_DIR/brain"
if [ -w "/usr/local/bin" ]; then
  ln -sf "$TOOLS_DIR/brain" /usr/local/bin/brain
else
  mkdir -p "$HOME/bin"
  ln -sf "$TOOLS_DIR/brain" "$HOME/bin/brain"
  grep -q 'HOME/bin' "$HOME/.zshrc" 2>/dev/null || echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.zshrc"
fi

# 6. Set up 15-min cron sync
echo "⏱  Setting up 15-min cron sync ..."
CRON_JOB="*/15 * * * * source $BRAIN_DIR/.env && python3 $TOOLS_DIR/sync_to_brain.py >> $BRAIN_DIR/logs/sync.log 2>&1"
( crontab -l 2>/dev/null | grep -v "sync_to_brain"; echo "$CRON_JOB" ) | crontab -

# 7. Configure Claude Desktop (if installed)
echo "🖥  Configuring Claude Desktop ..."
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -d "$HOME/Library/Application Support/Claude" ]; then
  # Read SUPABASE_SERVICE_KEY from .env
  SUPA_KEY=$(grep SUPABASE_KEY "$BRAIN_DIR/.env" | cut -d= -f2-)
  cat > "$CLAUDE_CONFIG" << CFGEOF
{
  "mcpServers": {
    "brain": {
      "command": "node",
      "args": ["$MCP_DIR/dist/index.js"],
      "env": {
        "SUPABASE_SERVICE_KEY": "$SUPA_KEY"
      }
    }
  }
}
CFGEOF
  echo "  ✓ Claude Desktop configured with Brain MCP"
  echo "  ⚠ Restart Claude Desktop to activate"
else
  echo "  ℹ Claude Desktop not found — install it first"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FRACTAL BRAIN INSTALLED"
echo ""
echo "  Brain dir:     ~/.fractal_brain/"
echo "  Tools:         $(ls $TOOLS_DIR/*.py 2>/dev/null | wc -l | tr -d ' ') Python modules"
echo "  MCP server:    ~/.fractal_brain/brain-mcp-server/"
echo "  CLI:           brain --help"
echo "  Cron sync:     every 15 minutes"
echo "  Claude config: auto-configured"
echo ""
echo "  → Restart Claude Desktop"
echo "  → Open Cowork → type: brain status"
echo "  → Computer 02 is live on the shared brain"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
