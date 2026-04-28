---
title: "How We Built an AI Record Label in a Weekend"
slug: how-we-built-ai-record-label-weekend
date: 2026-04-21
author: Sophia Cave
description: "We took one independent artist, three original tracks, and an AI production pipeline — and shipped 22 professional remixes across 8 genres in a single weekend. Here's the full build log."
excerpt: "We took one independent artist, three original tracks, and an AI production pipeline — and shipped 22 professional remixes across 8 genres in a single weekend. Here's the full build log."
tags: [ai-music, case-study, timbre, artist-management, creative-ai, 2026]
categories: [Case Studies, AI Tools]
image: /blog/images/ai-record-label.jpg
cta: Start Learning Free
faq:
  - q: "What does an AI record label actually do?"
    a: "Everything a traditional label does — production, remixing, mastering, distribution, and artist page hosting — but automated through AI pipelines. The creative direction still comes from humans. The production bottleneck disappears."
  - q: "How much did this cost to build?"
    a: "Under $50 total. Suno Premier ($24/mo) for generation, Bunny CDN ($1/mo) for audio delivery, and free open-source tools for mastering and stem separation. No studio time. No session musicians. No mixing engineers."
  - q: "Can any artist use this pipeline?"
    a: "Yes. The pipeline works with any audio input — original tracks, vocal recordings, even rough demos. If you have music, we can remix it across genres, master it, and ship it to a hosted artist page with streaming playback."
  - q: "Is this replacing real record labels?"
    a: "Not replacing — competing on access. Traditional labels offer capital, distribution networks, and industry relationships. An AI label offers speed, zero cost, and creative range. For independent artists who've been locked out of the system, that tradeoff is obvious."
---

# How We Built an AI Record Label in a Weekend

*Published April 21, 2026*

This isn't a thought experiment. We actually did this.

One independent artist. Three original tracks. An AI production pipeline. A weekend.

The result: 22 professional remixes across 8 genres, a custom artist page with in-browser audio streaming, and a proof of concept that changes what "record label" means.

Here's the full build log.

## The Artist: Thùy Vân

Thùy Vân is a Vietnamese artist based in the United States. She writes and performs original music — pop ballads with Vietnamese lyrics, emotional range, and a voice that crosses genres naturally.

She had three tracks: *Pray*, *Lai Gan Ben Em*, and *My Vietnam*. YouTube uploads. No label. No distribution beyond what she could do herself.

That's exactly who this pipeline is for.

## The Challenge

Take three tracks and expand them into a full catalog — not by recording new material, but by reimagining existing music across genres using AI.

The constraints:
- **Zero studio time.** Everything runs on a laptop.
- **Pro bono.** This is a proof of concept, not a client engagement.
- **Production quality.** Every remix needs to sound professional — not "AI-generated," but genuinely good.
- **Streamable.** Fans should be able to listen immediately, not download files.

## The Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Generation | Suno Premier | Text-to-music with genre-specific prompts |
| Stem separation | Timbre AI | Isolate vocals from originals for remix layering |
| Mastering | AI mastering pipeline | Loudness, EQ, compression, stereo imaging |
| Audio delivery | Bunny CDN | Global edge-cached MP3 streaming |
| Artist page | Next.js + custom AudioPlayer | In-browser playback with seek, progress, metadata |
| Hosting | Vercel | Auto-deploy from Git |

Total infrastructure cost: **under $50/month.**

## Day 1: Generation

We started with *Pray* — Thùy Vân's strongest track. The original is a Vietnamese pop ballad with piano accompaniment and a vocal performance that carries real emotional weight.

The process:

1. **Stem separation**: Isolated Thùy Vân's vocals from the original mix
2. **Genre prompting**: Wrote production briefs for 7 genres — classical, EDM, K-pop, J-pop, hip-hop, traditional Vietnamese, lo-fi
3. **Generation**: Fed each brief into Suno with the isolated vocals as a style reference
4. **Selection**: Generated 3-5 variations per genre, picked the strongest

By the end of Day 1, we had 7 remixes of *Pray* — each genuinely distinct. The classical version features full orchestral arrangement. The EDM remix hits with a four-on-the-floor drop. The K-pop version has the tight percussion and layered harmonies you'd expect from a Seoul production house.

Same voice. Same lyrics. Completely different worlds.

We repeated this for *Lai Gan Ben Em* (7 remixes) and *My Vietnam* (7 remixes), plus a standalone pop version of *Pray* generated from scratch with Suno.

**22 tracks total.** Some didn't make the cut — 5 clips came in under 15 seconds (a generation limitation we'll fix in the next pass). But the 22 that survived are genuinely good.

## Day 2: Post-Production and Delivery

Raw AI output needs mastering. Every track went through:

- **Loudness normalization** to -14 LUFS (streaming standard)
- **EQ balancing** to clean up frequency collisions
- **Stereo imaging** for headphone clarity
- **Dynamic compression** to control peaks without killing dynamics

Then we built the delivery infrastructure:

### CDN Setup
Created a dedicated audio storage zone on Bunny CDN — `likeone-audio.b-cdn.net`. Converted all 22 WAV masters to 192kbps MP3 (good quality, reasonable file size). Uploaded everything. All 22 files returned 201 OK.

### Audio Player
Built a custom React component — `AudioPlayer.jsx`. Play/pause, seek bar, progress tracking, track metadata display. Nothing fancy, but it works smoothly and looks clean.

### Artist Page
Updated Thùy Vân's artist page to display all 22 remixes grouped by original track. Each remix shows genre, duration, and producer credit. Click play, it streams from the CDN.

Push to main. Vercel auto-deploys. Live at [likeone.ai/artists/thuy-van](/artists/thuy-van).

## The Math

Traditional label approach to producing 22 remixes:

| Item | Cost |
|------|------|
| Studio time (22 sessions × 4 hours × $100/hr) | $8,800 |
| Session musicians (3 per remix average) | $6,600 |
| Mixing engineer | $4,400 |
| Mastering | $2,200 |
| **Total** | **$22,000** |

Our approach:

| Item | Cost |
|------|------|
| Suno Premier (monthly) | $24 |
| Bunny CDN (monthly) | ~$1 |
| Vercel hosting | Free tier |
| Human time (creative direction + QA) | 2 days |
| **Total** | **~$25** |

That's not a typo. The cost difference is nearly **1,000x.**

And the output quality? Listen for yourself. These aren't demos. They're release-ready tracks.

## What This Means

This isn't about replacing musicians or devaluing music. It's about access.

Thùy Vân has a beautiful voice and meaningful songs. Before this pipeline, those songs existed in one form — the arrangement she could afford to produce. Now they exist in eight genres. Her Vietnamese ballad becomes a K-pop track becomes an orchestral piece becomes an EDM banger.

That's not diminishing the original. It's amplifying it.

For independent artists — especially those outside the English-speaking music industry mainstream — this is a door that was previously locked behind five-figure production budgets and industry connections.

We just kicked it open.

## What's Next

This was the proof of concept. Here's what's coming:

- **More artists.** The pipeline is genre-agnostic. Any artist with original tracks can go through this process.
- **Distribution.** Getting these remixes onto Spotify, Apple Music, and streaming platforms through DistroKid.
- **Revenue sharing.** Building transparent, artist-first economics — no 360 deals, no ownership grabs.
- **Scale.** The pipeline is automated enough to handle multiple artists simultaneously. One person can run a label that serves dozens of artists.

The old model: get signed, get an advance, give up your masters, hope the label promotes you.

The new model: bring your music, get a full catalog in a weekend, keep everything, stream everywhere.

We're building the second one.

---

*Want to see it in action? Listen to Thùy Vân's full remix catalog at [likeone.ai/artists/thuy-van](/artists/thuy-van). Building with AI? [Like One Academy](/academy) has free courses on AI tools and creative workflows.*
