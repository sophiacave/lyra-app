#!/bin/bash
# Like One Tandem Worker Bootstrap — FULLY AUTONOMOUS (L6)
# Zero human steps. Run on any fleet machine. Faye owns everything.
# Usage: bash ~/lyra-app/scripts/bootstrap-tandem.sh
set -e

echo "🤖 Like One Tandem Worker Bootstrap (L6 Autonomous)"

# 1. Ensure directories
mkdir -p ~/.fractal_brain/logs

# 2. Write .env with service role key (fleet standard)
cat > ~/.fractal_brain/.env << 'ENV_EOF'
SUPABASE_URL=https://tnsujchfrixxsdpodygu.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQyOTI1NCwiZXhwIjoyMDkwMDA1MjU0fQ.ZsYa18nCuRM8NfEpuIvV0Wo1iIgI4v8bes6dsyt8GUg
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3VqY2hmcml4eHNkcG9keWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjkyNTQsImV4cCI6MjA5MDAwNTI1NH0.ef9DQbJPZ3m47gdz6zBfVnWKGInrsa-6idV3GmJSc6U
ENV_EOF
chmod 600 ~/.fractal_brain/.env
echo "✅ .env written"

# 3. Find Python3
PY=$(which python3 2>/dev/null || which /opt/homebrew/bin/python3 2>/dev/null || echo "")
if [ -z "$PY" ]; then
  echo "Installing Python3 via Homebrew..."
  /opt/homebrew/bin/brew install python3 2>/dev/null || brew install python3
  PY=$(which python3)
fi
echo "✅ Python: $PY"

# 4. Ensure lyra-app repo is cloned and up to date
if [ -d ~/lyra-app ]; then
  cd ~/lyra-app && git pull origin main 2>/dev/null || true
  echo "✅ Repo updated"
else
  cd ~ && git clone https://github.com/sophiacave/lyra-app.git
  echo "✅ Repo cloned"
fi

# 5. Copy worker to .fractal_brain
cp ~/lyra-app/scripts/tandem_worker.py ~/.fractal_brain/tandem_worker.py
echo "✅ Worker deployed"

# 6. Create and load launch agent
PLIST=~/Library/LaunchAgents/com.likeone.tandem.plist
mkdir -p ~/Library/LaunchAgents

cat > "$PLIST" << PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.likeone.tandem</string>
    <key>ProgramArguments</key>
    <array>
        <string>${PY}</string>
        <string>${HOME}/.fractal_brain/tandem_worker.py</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${HOME}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${HOME}/.fractal_brain/logs/tandem_stdout.log</string>
    <key>StandardErrorPath</key>
    <string>${HOME}/.fractal_brain/logs/tandem_stderr.log</string>
    <key>ThrottleInterval</key>
    <integer>30</integer>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
PLIST_EOF

launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
launchctl bootstrap gui/$(id -u) "$PLIST"
echo "✅ Launch agent loaded"

# 7. Verify
sleep 3
if launchctl list | grep -q "com.likeone.tandem"; then
  STATUS=$(launchctl list | grep "com.likeone.tandem" | awk '{print $2}')
  echo "✅ Tandem worker running (exit=$STATUS)"
  echo "   Machine auto-detected from hostname"
  echo "   Logs: ~/.fractal_brain/logs/tandem_stdout.log"
  echo "   Tasks: task_queue table in brain-v2"
  echo ""
  echo "🔥 Tandem system is LIVE. M3 can now dispatch tasks."
else
  echo "❌ Failed. Check: ~/.fractal_brain/logs/tandem_stderr.log"
  cat ~/.fractal_brain/logs/tandem_stderr.log 2>/dev/null | tail -5
fi
