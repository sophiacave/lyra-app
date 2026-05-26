---
title: "A 2016 Math Paper Predicted How to Train LLMs 2.5x Faster — Here's the Proof"
slug: "train-llms-faster-bregman-lagrangian-2026"
date: "2026-05-25"
author: "Sophie Cave"
category: "AI Engineering"
tags: ["optimization", "llm training", "machine learning", "nesterov momentum", "research", "deep learning"]
description: "In 2016, Andre Wibisono proved that all accelerated optimization methods are the same equation. In 2025, Meta used that insight to train LLMs 2.5x faster. Here's the full story — and what it means for your next training run."
image: "/images/blog/bregman-acceleration.jpg"
published: true
---

# A 2016 Math Paper Predicted How to Train LLMs 2.5x Faster — Here's the Proof

In October 2025, Meta published a paper called SNOO — Step-K Nesterov Outer Optimizer. Their claim: **1.5–2.5× compute factor gains** on LLM pretraining. Not on toy benchmarks. On real production runs with 2,048 H100 GPUs and 25 trillion tokens of training data.

At H100 rental rates, that's the difference between a $10M training run and a $4M one.

The technique they used? Nesterov momentum applied to pseudo-gradients. An idea that traces directly back to a PNAS paper from 2016 by Andre Wibisono, Ashia Wilson, and Michael Jordan at Berkeley.

That paper didn't mention LLMs. They didn't exist yet. But it laid out the mathematical framework that explains *why* every new optimizer breakthrough in 2025 works — and how to design the next one.

## The Problem: Your Optimizer Is Blind

Here's the state of LLM training in 2026: almost everyone uses AdamW. The recipe is stable. The hyperparameters are well-studied. The results are predictable.

But predictable isn't optimal.

AdamW treats every optimization step independently. It scales gradients by their running variance, takes a step, forgets the trajectory. There's no "memory" of where you're going — only where you've been.

This is like navigating by looking exclusively at the ground beneath your feet. You'll get somewhere, but you won't get there fast.

Nesterov momentum, proposed in 1983, was the first hint that optimizers could "look ahead." Instead of stepping to the gradient at your current position, you step to the gradient at a predicted future position. Simple idea. Dramatically faster convergence.

But for 30+ years, nobody could explain *why* it worked. The proofs were algebraic tricks. The intuition was vague. You couldn't generalize it to new settings because you couldn't see the underlying principle.

## The Paper: One Equation to Unify Them All

In 2016, Wibisono, Wilson, and Jordan published "A Variational Perspective on Accelerated Methods in Optimization" in PNAS. Their insight was elegant and devastating:

**Every accelerated optimization method — Nesterov, mirror descent, higher-order methods — is the same continuous-time curve traversed at different speeds.**

The unifying object is the **Bregman Lagrangian**:

```
L(X, Ẋ, t) = e^(α_t + γ_t) · [D_h(X + e^(-α_t)·Ẋ, X) - e^(-α_t)·f(X)]
```

Where `D_h` is a Bregman divergence — a generalized notion of "distance" that doesn't have to be Euclidean.

Here's what this means in plain language:

1. **Acceleration isn't a trick.** It's a natural consequence of the variational principle (least action) applied to optimization. The same principle that governs planetary orbits governs Nesterov momentum.

2. **The choice of distance metric determines the optimizer.** Euclidean distance gives you standard Nesterov. KL divergence gives you mirror descent. Choose a different Bregman divergence, get a different (possibly better) accelerated method.

3. **All accelerated methods are the same object.** They differ only in how you discretize time (step size) and how you measure distance (Bregman divergence). This means if you understand the framework, you can *design* new optimizers for specific loss landscapes.

## Why This Matters Now: The 2025 Optimizer Explosion

For eight years after publication, this paper was mostly theoretical. Cited by other theorists. Appreciated by mathematicians. Ignored by engineers.

Then LLMs got expensive enough that optimizer efficiency became a million-dollar question. And suddenly, a wave of papers landed in 2025 that all — whether they cite Wibisono directly or not — harvest the same insight:

### SNOO (Meta, October 2025)

**Step-K Nesterov Outer Optimizer.** The headline result: 1.5–2.5× compute factor gains on LLM pretraining.

SNOO's architecture is simple. It wraps any inner optimizer (AdamW, Muon, whatever you're using) with an outer loop that applies Nesterov momentum to the "pseudo-gradient" — the difference between parameters before and after K inner steps.

```python
# Simplified SNOO pseudocode
for outer_step in range(total_steps // K):
    theta_before = model.parameters()

    # K inner steps with your normal optimizer
    for inner_step in range(K):
        loss = forward(batch)
        inner_optimizer.step(loss)

    theta_after = model.parameters()
    pseudo_grad = theta_before - theta_after

    # Nesterov momentum on the pseudo-gradient
    momentum = beta * momentum + pseudo_grad
    model.parameters = theta_before - lr * (pseudo_grad + beta * momentum)
```

Through the Bregman lens, SNOO is doing something precise: it's applying Wibisono's acceleration framework at a *coarser time scale*. The inner optimizer handles local curvature. The outer Nesterov loop handles the global trajectory. Two levels of acceleration, each operating at a different discretization of the same underlying continuous dynamics.

The results at Meta's scale:
- **300M parameter dense transformer:** Lower train and validation loss throughout training vs AdamW
- **1e23 FLOPs scale:** Improvements *increase* with model size
- **Generalization:** Models trained with SNOO have smaller weight norms and less overfitting
- **Overhead:** Minimal compute and memory cost, compatible with model sharding

### AdamS (EMNLP 2025)

AdamS eliminates second-moment estimates entirely. It uses a weighted sum of squares of momentum and gradient as the denominator — meaning momentum *itself* becomes the normalizer.

This directly embodies Wibisono's insight that the distance metric (how you measure step size) is the lever for acceleration. AdamS changes the metric while preserving the momentum structure.

### Principal Spectral Regularization (OpenReview 2025)

This paper made SGD with momentum **surpass Adam** for LLM training. The trick: regularize the spectral properties of weight matrices so the loss landscape becomes more amenable to momentum-based acceleration.

In Bregman terms: they're reshaping the landscape to match the distance metric that Nesterov momentum assumes (approximately Euclidean). When landscape geometry and optimizer geometry align, acceleration is maximal.

## The Better Solution: Geometric Optimizer Selection

Here's what most practitioners do: pick AdamW, tune the learning rate, train, ship.

Here's what the Bregman framework tells you to do instead:

**Match your optimizer's geometry to your loss landscape's geometry.**

This isn't abstract philosophy. It's an engineering principle with measurable consequences:

| Loss Landscape Property | Optimal Bregman Geometry | Practical Optimizer |
|---|---|---|
| Approximately quadratic (well-conditioned) | Euclidean | SGD + Nesterov momentum |
| Sparse gradients, heavy tails | KL divergence | Mirror descent / AdaGrad |
| Mixed curvature (some flat, some sharp) | Composite | SNOO (two-level acceleration) |
| Spectral structure in weights | Mahalanobis-like | Shampoo / SOAP |
| Noisy, high-variance gradients | Smoothed Euclidean | SPAM / Adam + momentum reset |

The practical takeaway: **if your training is slow, the problem might not be your learning rate. It might be that your optimizer is measuring distance wrong.**

SNOO works because it adds a second distance scale — macro-trajectory momentum over micro-step adaptation. AdamS works because it fuses momentum into the distance metric itself. Spectral regularization works because it reshapes the landscape to match Euclidean geometry.

All three are implementations of the same principle Wibisono wrote down in 2016.

## What This Means For Your Next Training Run

If you're training models at scale, here's the actionable hierarchy:

**Level 1: Use SNOO as a wrapper (free speedup)**

SNOO requires minimal code changes and works with any inner optimizer. If you're on AdamW, wrap it. The Meta paper reports consistent gains across architectures and scales. There's no reason not to.

**Level 2: Profile your loss landscape geometry**

Before your next big run, spend 1% of compute characterizing your loss surface. What's the spectral decay of the Hessian? Are gradients heavy-tailed? Is there structure you can exploit?

Tools like [PyHessian](https://github.com/amirgholami/PyHessian) give you this information cheaply. The answers inform which Bregman geometry to use.

**Level 3: Design a custom accelerated method**

If you have a training problem with known structure (e.g., mixture-of-experts routing, sparse attention patterns, specific architectural symmetries), the Bregman Lagrangian framework lets you derive a purpose-built optimizer. This is where the real gains are for well-resourced teams.

## The Deeper Lesson

Academic optimization theory is not a luxury. It's not "just theory." The companies that read Wibisono's paper in 2016 and understood it had a decade head start on building the engineering that Meta shipped in 2025.

The gap between theory and practice is measured in patience, not possibility.

Nesterov wrote down accelerated gradient descent in 1983. For 33 years it was a beautiful theorem. Then Wibisono revealed the underlying principle. Then Meta turned it into a 2.5× speedup on the most expensive computation in AI.

The next Wibisono paper is already on arXiv. The question is whether you'll read it now, or wait ten years for someone to build the product.

---

*Want to understand optimization at this depth? Our [AI Engineering courses](/academy/) go beyond API wrappers into the mathematics that matters. The kind of knowledge that compounds.*

## FAQ

### Is SNOO available as a library?

Not as an official Meta release yet, but the algorithm is fully described in the paper and simple to implement. The pseudocode above captures the core loop. Expect community implementations in PyTorch within months.

### Do I need to understand Bregman divergences to use SNOO?

No. SNOO works as a drop-in wrapper. But understanding *why* it works — the Bregman framework — lets you reason about when it will give the largest gains and how to tune the K parameter (inner step count).

### How does this relate to Wibisono's newer work on sampling?

Wibisono's 2024-2025 papers on Langevin dynamics extend the same variational framework from optimization (finding minimums) to sampling (exploring distributions). The Bregman structure carries over: accelerated sampling methods use the same Lagrangian mechanics, applied to probability distributions instead of loss functions. This is directly relevant to diffusion models and MCMC methods.

### Is AdamW obsolete?

Not yet. AdamW remains the safe, well-understood default. But the 2025 papers show that you're leaving 40-60% of your compute budget on the table if you don't at least add SNOO on top. For teams training at scale, this is significant.

### What's the connection between momentum and generalization?

SNOO-trained models have smaller weight norms and resist overfitting better. The Bregman framework explains this: accelerated methods don't just reach minimums faster — they preferentially find *flat* minimums (which generalize better) because the momentum carries them past sharp, narrow valleys.

---

## References

1. Wibisono, A., Wilson, A.C., & Jordan, M.I. (2016). [A Variational Perspective on Accelerated Methods in Optimization](https://arxiv.org/abs/1603.04245). *Proceedings of the National Academy of Sciences*, 113(47).

2. Meta FAIR (2025). [SNOO: Step-K Nesterov Outer Optimizer — The Surprising Effectiveness of Nesterov Momentum Applied to Pseudo-Gradients](https://arxiv.org/abs/2510.15830). *arXiv:2510.15830*.

3. Li, Y. et al. (2025). [AdamS: Momentum Itself Can Be A Normalizer for LLM Pretraining and Post-training](https://aclanthology.org/2025.emnlp-main.543/). *EMNLP 2025*.

4. Chen, X. et al. (2025). [Principal Spectral Regularization Makes Momentum Surpass Adam for LLM Training](https://openreview.net/forum?id=xc6uGzNNVe). *OpenReview*.

5. Mitra, S. & Wibisono, A. (2025). [Fast Convergence of Phi-Divergence Along the Unadjusted Langevin Algorithm and Proximal Sampler](https://arxiv.org/abs/2401.05196). *ALT 2025*.
