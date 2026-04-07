---
name: brain-search
description: Search brain keys by keyword with semantic matching
trigger: /brain
icon: 🧠
---

Search the Supabase brain for keys matching the user's query.

1. Take the user's search query
2. Search brain_context table by key, description, and value
3. Return top 5 matches with:
   - Key name
   - Category and priority
   - Description
   - Value preview (first 200 chars)
4. Format results as a clean list
