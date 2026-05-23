---
title: "AI + Drone LiDAR Is About to Revolutionize Archaeology (And Nobody's Talking About It)"
date: 2026-05-12
author: Sophie Cave
description: "The $1.72B cultural resource management industry runs on pedestrian surveys and Microsoft Access. AI-powered drone LiDAR changes everything — here's how the tech works and why the US market is wide open."
excerpt: "The $1.72B cultural resource management industry runs on pedestrian surveys and Microsoft Access. AI-powered drone LiDAR changes everything — here's how the tech works and why the US market is wide open."
tags: [ai, archaeology, lidar, drones, remote-sensing, machine-learning, computer-vision, startup, 2026]
---

# AI + Drone LiDAR Is About to Revolutionize Archaeology (And Nobody's Talking About It)

There's a $1.72 billion industry hiding in plain sight. It employs tens of thousands of people, touches every major infrastructure project in the country, and runs on technology from the early 2000s.

Cultural resource management (CRM) — the practice of surveying land for archaeological sites before construction — is one of the last industries untouched by AI. That's about to change.

## The Problem Nobody Wants to Admit

Every highway expansion, pipeline, solar farm, and housing development in the US requires an archaeological survey. Federal law (Section 106 of the NHPA) and state equivalents like California's CEQA mandate it.

Here's how most surveys still work in 2026:

1. Archaeologists walk transects 15 meters apart across the project area
2. They look at the ground
3. They write notes on paper or tablets
4. They file reports in systems built on Microsoft Access

This is called **pedestrian survey**. It takes weeks for what a drone covers in hours. It misses subsurface features entirely. And it's bottlenecked by a labor shortage — the industry needs 8,000+ archaeologists it doesn't have.

The infrastructure bill just added another $1 billion in CRM work for 2025-2027. More projects. Same number of humans. Something has to give.

## What LiDAR Sees That Humans Can't

LiDAR (Light Detection and Ranging) fires laser pulses from a drone or aircraft and measures the returns. The result: a 3D point cloud of the terrain surface with centimeter-level accuracy.

The breakthrough for archaeology: **LiDAR penetrates vegetation canopy.** Those laser pulses pass through leaves and branches to map the ground surface underneath. A forest that's impenetrable on foot becomes transparent from above.

This is how researchers discovered [thousands of previously unknown Maya structures](https://www.nature.com/articles/nature25778) under Guatemalan jungle in 2018. LiDAR revealed an entire civilization hidden under tree cover.

But LiDAR generates massive datasets — billions of points per survey. A human staring at point cloud visualizations will miss patterns. Enter AI.

## AI Feature Detection: The Missing Piece

The real unlock isn't the sensor. It's what you do with the data.

**Semantic segmentation** — the same computer vision technique that powers self-driving car perception — can be trained to identify archaeological features in LiDAR-derived terrain models.

Here's how the pipeline works:

### 1. Acquire Data (Free or Cheap)

Most people don't realize this: high-resolution LiDAR data covering the majority of the US is **free**.

- **USGS 3DEP** — nationwide LiDAR program, freely downloadable
- **OpenTopography** — portal for high-res topographic data
- **Sentinel-2** — ESA satellite imagery, updated every 5 days, free
- **Landsat** — USGS satellite archive going back to the 1970s, free
- **CORONA** — declassified Cold War spy satellite photos, free

You can start processing archaeological data today without spending a dollar on acquisition.

### 2. Generate Terrain Visualizations

Raw point clouds need processing before AI can interpret them. Relief Visualization Toolbox (RVT) generates multiple derived products:

- **Hillshade** — simulated lighting reveals surface relief
- **Slope maps** — highlight sharp terrain changes (walls, ditches, mounds)
- **Sky-view factor** — measures openness at each point, excellent for detecting depressions
- **Local relief model** — removes regional topography to emphasize small features

Each visualization technique highlights different archaeological signatures. The AI gets all of them as input channels.

### 3. Run AI Detection

The current state of the art: **HRNet (High-Resolution Network)** architectures trained on labeled archaeological data. The ADAF project (Automated Detection of Archaeological Features), released under Apache 2.0, achieved **84% recall** on Irish archaeological sites — meaning it found 84% of known sites in test areas.

More importantly: it found sites that trained archaeologists missed.

The model processes terrain data in 512×512 pixel patches, classifying each pixel as "archaeological feature" or "background." Output: probability maps showing where sites likely exist.

### 4. Validate and Report

AI output goes to a qualified archaeologist for interpretation. The model doesn't replace the expert — it tells them where to look. Instead of walking every meter of a 500-acre project, the archaeologist focuses field time on high-probability zones.

Survey time drops from weeks to days. Coverage goes from partial to complete. Cost drops by an order of magnitude.

## Why the US Market Is Wide Open

Here's the part that surprised us during research: **there is no commercial AI archaeology product in the United States.**

The landscape:

| Player | Status | Limitation |
|--------|--------|------------|
| ArchAI (UK) | Active, commercial | UK/Europe only |
| ADAF (Ireland) | Open source, academic | No commercial product |
| A3RD (UChicago) | Academic research | Not commercialized |
| GlobalXplorer (Parcak) | Inactive since 2023 | Dead product |
| CRM firms | Tech laggards | They'd be *customers*, not competitors |

The UK proved the model works commercially. ArchAI runs a successful business doing exactly this — AI-powered archaeological detection from remote sensing data. Nobody has brought it to the US market yet.

California alone represents the largest CRM market in the country. CEQA triggers archaeological review on virtually every development project. The state is actively modernizing its archaeological records system (CHRIS) from Access to the Arches platform. Integration opportunity is massive.

## The Hardware Is Finally Affordable

Five years ago, survey-grade airborne LiDAR cost $100,000+. Today:

- **DJI Matrice 350 RTK + Zenmuse L2**: $26,875 for a complete system
- 5-return LiDAR, 240,000 points/second
- 4cm vertical accuracy with RTK positioning
- 2.5 km² coverage per flight

That's professional survey-grade hardware for the price of a used car. Pair it with free satellite data for regional screening and you have a complete pipeline from continental scale down to individual features.

For proof of concept work, you don't even need a drone. Download free USGS LiDAR data, process it through open-source tools, run open-source AI models. Total cost: $0 and a computer with a decent GPU.

## What This Means for the Industry

The CRM industry is about to split into two tiers:

**Firms that adopt AI + drone tech** will survey faster, find more sites, win more contracts, and deliver better results. Their archaeologists spend time on interpretation instead of walking transects.

**Firms that don't** will compete on price for the work AI firms don't want. The gap will widen fast.

Government agencies — CalTrans, Army Corps of Engineers, Bureau of Land Management, state historic preservation offices — are actively seeking better survey technology. The infrastructure bill money demands faster project timelines. The labor shortage demands force multipliers.

## Why We're Building This

At Like One, we build AI tools that solve real problems. Our foundation is a 501(c)(3). Our LLC commercializes the technology.

We're partnering with a 10-year California state archaeologist who knows every CRM firm, state agency, and regulatory framework in the state. She brings the domain expertise. We bring the AI engineering.

The plan:
1. Process freely available LiDAR data through open-source AI models
2. Validate against known archaeological sites in California
3. Fine-tune models on California-specific training data
4. Build a SaaS platform for CRM firms and government agencies
5. Pursue NSF SBIR funding ($275K Phase I, $1M Phase II)

Everything needed to start exists for free: the data, the AI models, the processing tools. The missing piece is someone who can build the product and understands the market. That's the intersection we occupy.

## The Bigger Picture

AI archaeology isn't just about compliance and construction projects. Climate change is accelerating site destruction — coastal erosion, wildfires, flooding. The sites we don't find now may not exist in 10 years.

LiDAR surveys create permanent digital records of landscapes. Even if a site is later destroyed, the data preserves its geometry forever. This is cultural preservation at machine scale.

The technology also democratizes discovery. You don't need a major university expedition to find significant archaeological sites anymore. You need a laptop, free data, and an AI model trained to see what humans miss.

We're at the beginning of a fundamental shift in how humanity discovers its own past. The tools are here. The data is free. The market is waiting.

---

*Like One builds AI tools for people who build the future. Follow our work at [likeone.ai](https://likeone.ai).*

*Interested in AI-powered archaeological survey? We're looking for CRM firms and government agencies interested in pilot projects. Reach out at hello@likeone.ai.*
