#!/bin/bash
# Like One Tandem Worker Bootstrap — Run once on M4 to set up tandem work
# Usage: bash ~/lyra-app/scripts/bootstrap-tandem.sh
set -e

echo "🤖 Like One Tandem Worker Bootstrap"

# 1. Ensure .fractal_brain exists
mkdir -p ~/.fractal_brain/logs

# 2. Copy .env if not present (needs service role key)
if [ ! -f ~/.fractal_brain/.env ]; then
  echo "❌ ~/.fractal_brain/.env not found. Create it with:"
  echo "   SUPABASE_URL=https://tnsujchfrixxsdpodygu.supabase.co"
  echo "   SUPABASE_KEY=<service_role_key>"
  echo ""
  echo "Copy from M3: scp m3:~/.fractal_brain/.env ~/.fractal_brain/.env"
  exit 1
fi

# 3. Copy worker
cp ~/lyra-app/scripts/tandem_worker.py ~/.fractal_brain/tandem_worker.py
echo "✅ Worker copied to ~/.fractal_brain/tandem_worker.py"

# 4. Create launch agent
PLIST=~/Library/LaunchAgents/com.likeone.tandem.plist
cat > "$PLIST" << 'PLIST_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.likeone.tandem</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/python3</string>
        <string>/Users/sophiacave/.fractal_brain/tandem_worker.py</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/sophiacave</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/sophiacave/.fractal_brain/logs/tandem_stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/sophiacave/.fractal_brain/logs/tandem_stderr.log</string>
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
echo "✅ Launch agent created: $PLIST"

# 5. Load launch agent
launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
launchctl bootstrap gui/$(id -u) "$PLIST"
echo "✅ Launch agent loaded"

# 6. Verify
sleep 3
if launchctl list | grep -q "com.likeone.tandem"; then
  echo "✅ Tandem worker is running!"
  echo "   Logs: ~/.fractal_brain/logs/tandem_stdout.log"
  echo "   Queue: task_queue table in brain-v2"
else
  echo "❌ Worker failed to start. Check: ~/.fractal_brain/logs/tandem_stderr.log"
fi
