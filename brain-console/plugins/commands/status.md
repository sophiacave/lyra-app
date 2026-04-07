---
name: status
description: Show full system status — brain, fleet, AI providers, divine cycle
trigger: /status
icon: ⚡
---

Report the current system status:

1. Brain connection (connected/disconnected, key count)
2. Fleet status (M3, M4, GCP — online/offline with last heartbeat)
3. AI provider (which is active, MLX/Ollama/Cloud)
4. Divine cycle (active/idle, current phase, cycle count)
5. Task queue (pending/in-progress count)
6. Memory usage (RAM free, Ollama models loaded)

Format as a compact status block with emoji indicators.
