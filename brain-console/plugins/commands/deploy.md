---
name: deploy
description: Deploy likeone.ai — git commit, push, verify Vercel
trigger: /deploy
icon: 🚀
requires_confirmation: true
---

Execute deployment workflow:

1. Run `git status` in ~/lyra-app to check for changes
2. If changes exist, create a commit with a descriptive message
3. Push to main branch (triggers Vercel auto-deploy)
4. Wait 30 seconds for Vercel build
5. Curl https://likeone.ai to verify site is live
6. Curl https://likeone.ai/academy to verify academy loads
7. Report success/failure with deploy URL
