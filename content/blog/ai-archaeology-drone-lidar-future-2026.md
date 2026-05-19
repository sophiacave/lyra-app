---
title: "AI Is Finding Lost Cities — And the $1.7B Industry That Hasn't Noticed"
slug: "ai-archaeology-drone-lidar-future-2026"
date: "2026-05-12"
author: "Sophia Cave"
excerpt: "While tech Twitter argues about chatbots, AI is quietly revolutionizing archaeology. Drone LiDAR + neural networks are finding sites humans missed for decades — and a $1.72 billion industry is about to get disrupted."
tags: ["AI", "Drone Technology", "LiDAR", "Archaeology", "Deep Tech", "Remote Sensing"]
image: "/blog/ai-archaeology-lidar.webp"
published: true
---

# AI Is Finding Lost Cities — And the $1.7B Industry That Hasn't Noticed

Most AI discourse is stuck arguing about whether ChatGPT can write a decent email. Meanwhile, neural networks are peeling back forest canopies and finding archaeological sites that human eyes missed for a century.

This isn't speculative. It's happening now, with free data and open-source models. And the industry it's about to transform — cultural resource management — is worth $1.72 billion annually in the US alone.

Here's why this matters, how it works, and what it tells us about where AI actually creates value.

## The Industry Nobody Talks About

Every time a highway gets widened, a housing development breaks ground, or a pipeline gets laid, federal and state law requires an archaeological survey. In California, CEQA (the California Environmental Quality Act) triggers mandatory review for nearly every construction project.

This isn't optional. It's the law.

The cultural resource management (CRM) industry exists to fulfill these requirements. It's a $1.72 billion market in the US, projected to hit $1.85 billion by 2031. The Infrastructure Investment and Jobs Act is injecting over $1 billion in new archaeological work through 2027. The industry needs 8,000+ new positions filled.

And here's the problem: the core technology hasn't changed in 50 years.

## Walking in Straight Lines (Literally)

The standard CRM survey method is called a **pedestrian survey**. Archaeologists walk across a site in parallel transects, 15 meters apart, eyes on the ground, looking for artifacts and features.

It's exactly what it sounds like. People walking and looking.

For a 500-acre project, that's weeks of fieldwork, tens of thousands of dollars, and results that are fundamentally limited by what humans can see on the surface. Buried features? Missed. Sites under dense canopy? Invisible. Human bias toward recognizable feature types? Baked in.

The data management is worse. Many state archaeological databases still run on Microsoft Access. California's CHRIS (California Historical Resources Information System) is only now migrating to a modern platform.

This is a $1.72 billion industry running on walking and Access databases.

## What AI Actually Sees

LiDAR — Light Detection and Ranging — fires laser pulses from drones or aircraft and measures the returns. When you strip away vegetation, you get a bare-earth digital terrain model that reveals subtle surface features invisible to the naked eye.

A slight depression that was a storage pit 2,000 years ago. A barely raised platform that was a house foundation. Linear features that were ancient field boundaries. Mounds. Enclosures. Earthworks.

Humans can analyze these terrain models manually, but it's slow, subjective, and scales poorly. Here's where AI changes the math.

### How it works

1. **Data acquisition**: Download free LiDAR from USGS 3DEP (sub-meter resolution, covering most of the US) or fly a drone with a LiDAR payload
2. **Preprocessing**: Generate relief visualizations — hillshade, slope, sky-view factor, openness — using tools like RVT (Relief Visualization Toolbox)
3. **AI detection**: Feed the visualizations into a CNN (convolutional neural network) trained on known archaeological sites
4. **Output**: Probability heatmaps showing where archaeological features likely exist

The ADAF project (AI-driven Detection of Archaeological Features), built by researchers in Ireland, demonstrated this pipeline with 84% recall using an HRNet W48 architecture. That means it correctly identified 84% of known archaeological sites in its test area.

More importantly, it found sites that human surveyors had missed.

The entire stack — ADAF, PyTorch, PDAL, QGIS, WhiteboxTools — is open source. The training data from USGS is free. You can start building this today with zero hardware cost.

## Adding Satellites to the Mix

LiDAR is powerful but requires either existing aerial surveys or flying your own drone. Satellite imagery adds a second detection layer that covers the entire planet.

**Crop marks** — subtle differences in vegetation growth over buried features — are visible in multispectral satellite imagery but invisible to the human eye on the ground. A buried stone wall causes slightly different moisture retention, which causes slightly different plant growth, which shows up as a distinct spectral signature in Sentinel-2 data.

Sentinel-2 is free, updated every 5 days, at 10-meter resolution. Landsat is free. CORONA declassified spy satellite photos from the 1960s-1970s are free. Planet Labs offers free research access at 3-5 meter resolution with daily revisits.

Temporal analysis — watching how these patterns change across seasons — is something AI handles effortlessly and humans simply can't do at scale.

## Why Nobody Has Commercialized This in the US

The pieces exist. The data is free. The models are open source. The market is enormous. So why isn't anyone selling this?

**The expertise gap is the moat.**

Building the AI is a software problem. Archaeologists can't do it. Understanding CRM compliance, state databases, tribal consultation protocols, CEQA/Section 106 requirements, and what agencies actually need in deliverables — that's domain expertise that takes a decade to build. Software engineers don't have it.

The only team that can build this is one that bridges both worlds. An AI engineer and a domain expert with deep regulatory knowledge and industry relationships.

The closest competitors tell the story:

- **ArchAI** (UK) proved the commercial model works — but they're UK-only
- **ADAF** (Ireland) built the open-source foundation — but it's academic, not commercial
- **GlobalXplorer** (Sarah Parcak's citizen-science platform) went inactive in 2023
- **CRM firms** like AECOM and ICF are tech laggards — they'd be customers, not competitors

There is no US commercial AI archaeology software company. Zero.

## The Business Model That Writes Itself

If you're thinking about this from a startup perspective, the economics are almost unfair:

**SaaS**: Upload your LiDAR or satellite data, get archaeological probability maps. $50-500/month. Target: 8,000+ CRM firms, state agencies, universities, tribal nations.

**Drone surveys**: Fly sites with drone LiDAR, run AI analysis, deliver GIS-ready reports. $150-500/acre. A single CalTrans highway project can be hundreds of acres.

**Government grants**: NSF SBIR explicitly lists archaeological technology as an eligible topic. Phase I is $275K. Phase II is $1M. A 501(c)(3) research partner makes you even more competitive.

**Training**: "AI for Archaeologists" certification. A CRM industry that desperately needs to modernize. $500-2,000 per course.

Hardware costs have collapsed. A DJI Matrice 350 RTK with a Zenmuse L2 LiDAR payload — survey-grade, 4cm accuracy — runs $26,875. That's a rounding error on a government contract. And you can start with $0 by processing free USGS data.

## What This Tells Us About Real AI Value

The AI gold rush is obsessed with chatbots, image generators, and coding assistants. Those are real products, but they're also crowded markets where every major tech company is competing.

The actual opportunities — the ones with enormous markets, zero competition, and clear paths to revenue — are in industries that most AI engineers have never heard of.

Cultural resource management. Agricultural yield optimization. Infrastructure inspection. Environmental compliance. Water rights management.

These aren't sexy. They don't get Product Hunt launches. But they're massive, underserved, and hungry for exactly what modern AI can deliver.

The pattern is always the same:

1. A regulated industry with mandatory compliance requirements
2. Existing workflows that are manual, slow, and expensive
3. Free or cheap data that AI can process better than humans
4. A domain expertise barrier that keeps generic tech companies out
5. Government funding pathways (grants, contracts) that de-risk the business

If you're an AI engineer looking for your next venture, stop scrolling Twitter and start reading federal regulations. The $1.72 billion archaeology market is just one example. There are dozens of industries with the same profile.

## The Takeaway

AI's most transformative applications aren't in Silicon Valley's comfort zone. They're in industries where people still walk in straight lines across fields, record data in Access databases, and wait weeks for results that a neural network could produce in hours.

The tools are free. The data is free. The market is there. The only thing missing is the team that bridges the gap between the technology and the domain.

That's the real AI opportunity in 2026 — not building another chatbot, but finding the industries that desperately need what already exists and delivering it.

---

*Like One builds AI systems that work autonomously — from grant writing to music production to archaeological survey. [See what we're building →](/)*
