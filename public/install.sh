#!/bin/bash
# ◈ FRACTAL BRAIN — One-Click Installer
# Installs the Like One intelligence layer on a new computer
# Usage: curl -fsSL https://likeone.ai/install.sh | bash

set -e
BRAIN_DIR="$HOME/.fractal_brain"
TOOLS_DIR="$BRAIN_DIR/tools"
C1_BRAIN_DIR="$HOME/like-one-server"

echo ""
echo "◈ FRACTAL BRAIN INSTALLER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Create directory structure
echo "📁 Creating ~/.fractal_brain/ ..."
mkdir -p "$TOOLS_DIR" "$BRAIN_DIR/logs" "$BRAIN_DIR/backups"

# 2. Copy tools from computer 01 if available, else use defaults
echo "🧠 Setting up brain tools ..."
if [ -d "$C1_BRAIN_DIR/agents" ]; then
  echo "  ✓ Found like-one-server — linking tools"
  cp "$C1_BRAIN_DIR"/*.py "$TOOLS_DIR/" 2>/dev/null || true
else
  echo "  ℹ Tools will need to be synced from Computer 01"
fi

# Copy local fractal brain tools if they exist
for tool in brain.py orchestrator.py session_bootstrap.py health_monitor.py sync_to_brain.py local_logger.py; do
  if [ -f "$BRAIN_DIR/../.fractal_brain_c1/tools/$tool" ]; then
    cp "$BRAIN_DIR/../.fractal_brain_c1/tools/$tool" "$TOOLS_DIR/$tool"
  fi
done

# 3. Write .env template — user fills in credentials from /_temp page
echo "🔑 Creating .env template ..."
if [ ! -f "$BRAIN_DIR/.env" ]; then
cat > "$BRAIN_DIR/.env" << 'ENVEOF'
# Fractal Brain — Paste your credentials from likeone.ai/_temp
SUPABASE_URL=https://vpaynwebgmmnwttqkwmh.supabase.co
SUPABASE_SERVICE_KEY=PASTE_FROM_TEMP_PAGE
NOTION_TOKEN=PASTE_FROM_TEMP_PAGE
COMPUTER_ID=computer-02
ENVEOF
  echo "  → Edit ~/.fractal_brain/.env with keys shown on likeone.ai/_temp"
else
  echo "  ✓ .env already exists — skipping"
fi

# 4. Create brain CLI command
echo "⚡ Installing brain CLI ..."
cat > "$TOOLS_DIR/brain" << 'BRAINEOF'
#!/bin/bash
source "$HOME/.fractal_brain/.env" 2>/dev/null
python3 "$HOME/.fractal_brain/tools/brain.py" "$@"
BRAINEOF
chmod +x "$TOOLS_DIR/brain"

# Symlink to accessible path
if [ -w "/usr/local/bin" ]; then
  ln -sf "$TOOLS_DIR/brain" /usr/local/bin/brain
else
  mkdir -p "$HOME/bin"
  ln -sf "$TOOLS_DIR/brain" "$HOME/bin/brain"
  echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.zshrc" 2>/dev/null || true
fi

# 5. Set up 15-min cron sync
echo "⏱  Setting up 15-min cron sync ..."
CRON_JOB="*/15 * * * * source $BRAIN_DIR/.env && python3 $TOOLS_DIR/sync_to_brain.py >> $BRAIN_DIR/logs/sync.log 2>&1"
( crontab -l 2>/dev/null | grep -v "sync_to_brain"; echo "$CRON_JOB" ) | crontab -

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FRACTAL BRAIN INSTALLED"
echo ""
echo "  Brain dir:  ~/.fractal_brain/"
echo "  CLI:        brain --help"
echo "  Cron sync:  every 15 minutes"
echo ""
echo "  NEXT STEP: Add credentials"
echo "  → Visit likeone.ai/_temp on this computer"
echo "  → Copy the .env block and paste into:"
echo "     ~/.fractal_brain/.env"
echo ""
echo "  Then run:  brain status"
echo "  Computer 02 will be live on the shared brain."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
