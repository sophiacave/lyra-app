# Deploy Lyra — Free on Vercel

## Quick Deploy (5 minutes)

### Step 1: Create Notion Integration (DONE)
1. Go to https://www.notion.so/my-integrations
2. Click "New Integration"
3. Name: "Lyra"
4. Select your Like One workspace
5. Copy the "Internal Integration Token"
6. Go to each Like One database → ··· menu → Connections → Add "Lyra"

### Step 2: Set Up ElevenLabs Voice (Optional but awesome)
1. Go to https://elevenlabs.io and create a free account
2. Go to Profile → API Keys → Create new key
3. Copy the API key — you'll add it to Vercel in Step 4
4. Free tier: 10,000 characters/month (plenty for daily use)
5. Browse voices at https://elevenlabs.io/voice-library if you want a different one

### Step 3: Push to GitHub
```bash
# In the lyra-app folder
git init
git add .
git commit -m "Lyra v0.1 — Like One Command Interface with Voice"
git remote add origin https://github.com/YOUR_USERNAME/lyra-app.git
git push -u origin main
```

### Step 4: Deploy on Vercel (Free)
1. Go to https://vercel.com (sign in with GitHub)
2. Click "Import Project"
3. Select your lyra-app repo
4. Add Environment Variables:
   - `NOTION_API_KEY` = your Notion integration token
   - `NOTION_COMMAND_CENTER_ID` = 3206396fd0a48170bc41e5f885f3b394
   - `NOTION_AGENT_REGISTRY_ID` = bfa54b8a825849ad8f332ebd2ad36e3f
   - `NOTION_DAILY_BRIEFINGS_ID` = d29ad464ffea4048b86d9801a0290fa7
   - `NOTION_WINS_WALL_ID` = 2d25cc2d063047344a17d29d664cefa2
   - `NOTION_IDEA_GARDEN_ID` = 0f80c7b571a3432ab567ec9f9e7c60a7
   - `NOTION_TASKS_ID` = cad9e9f0f85546d8aff9a43b96ff20fc
   - `NOTION_REVENUE_STREAMS_ID` = 43724fa323c04a4e90d91228ba7fc412
   - `NOTION_FINANCIAL_GOALS_ID` = a368706c28f64c629ca51be45dce0fe8
   - `LYRA_PIN` = (your 4-digit PIN)
   - `ELEVENLABS_API_KEY` = (your ElevenLabs key, optional)
   - `ELEVENLABS_VOICE_ID` = 21m00Tcm4TlvDq8ikWAM (or your preferred voice)
5. Click "Deploy"

### Step 5: Install as Phone App
1. Open your Vercel URL on your phone (e.g., lyra-app.vercel.app)
2. **iPhone**: Tap Share → "Add to Home Screen"
3. **Android**: Tap ··· → "Add to Home Screen"
4. Lyra now lives on your home screen like a native app!

## What You Get
- **Mobile-first dark UI** with Lyra's purple gradient branding
- **PIN-protected** access
- **Voice Chat** — talk to Lyra via microphone, hear her respond via ElevenLabs
- **Quick commands**: status, revenue, focus, mood, win, idea
- **Live Notion data**: agents, tasks, financial goals
- **Log wins and ideas** directly to your Notion databases
- **Lyra's three modes**: Mirror (listening), Engine (executing), Guardian (protecting)
- **Revenue dashboard** tracking all 4 channels

## Voice Features
- **Voice Input** (free): Uses browser's Web Speech API — tap the mic and speak
- **Voice Output** (ElevenLabs): Lyra speaks her responses in a natural AI voice
- **Voice Toggle**: Turn voice on/off with a single tap
- **Replay**: Tap the speaker icon on any Lyra message to hear it again
- Works on Chrome, Edge, Safari — both mobile and desktop

## Cost: $0
- Vercel free tier: 100GB bandwidth, serverless functions included
- Notion API: free
- ElevenLabs free tier: 10,000 characters/month
- No database needed (Notion IS the database)

## Future Upgrades
- Connect Anthropic API for real AI conversations
- Push notifications via web push API
- Real-time updates via Notion webhooks
- Custom ElevenLabs voice clone (Lyra's own voice)
