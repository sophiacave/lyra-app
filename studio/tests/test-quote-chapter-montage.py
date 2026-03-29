#!/usr/bin/env python3
"""
Test suite for quote, chapter, and montage Pillow renderers.
Validates rendering, dimensions, cinema post-processing, and design system compliance.

Run: python3 studio/tests/test-quote-chapter-montage.py
"""
import json
import math
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(ROOT / "studio"))

passed = 0
failed = 0

def test(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}{f' — {detail}' if detail else ''}")

# ── Import graphics engine ──
print("=" * 60)
print("IMPORT: graphics engine + new renderers")
print("=" * 60)

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("graphics_engine", ROOT / "studio" / "graphics-engine.py")
    gfx = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gfx)
    test("import graphics engine", True)
except Exception as e:
    test("import graphics engine", False, str(e))
    sys.exit(1)

# ── Function existence ──
test("render_quote_card exists", hasattr(gfx, 'render_quote_card'))
test("render_chapter_card exists", hasattr(gfx, 'render_chapter_card'))
test("render_montage exists", hasattr(gfx, 'render_montage'))

# ── RENDERING_PRESETS ──
print("\n" + "=" * 60)
print("PRESETS: quote, chapter, montage")
print("=" * 60)

required_keys = ['vignette', 'grain', 'letterbox', 'glow']
for preset_name in ['quote', 'chapter', 'montage']:
    preset = gfx.RENDERING_PRESETS[preset_name]
    test(f"preset '{preset_name}' exists", preset is not None)
    for key in required_keys:
        test(f"preset '{preset_name}' has '{key}'", key in preset, f"missing {key}")
    glow = preset.get('glow', {})
    test(f"preset '{preset_name}' glow has radius", 'radius' in glow)
    test(f"preset '{preset_name}' glow has opacity", 'opacity' in glow)

# ══════════════════════════════════════════════════════
# RENDER TESTS: Quote Card
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("RENDER: Quote Card")
print("=" * 60)

import numpy as np

# Basic render
img_quote = gfx.render_quote_card("The best way to predict the future is to invent it.", "Alan Kay")
test("quote: returns image", img_quote is not None)
test("quote: 1920×1080", img_quote.size == (1920, 1080))
test("quote: RGB mode", img_quote.mode == "RGB")

# No pure black pixels (design system rule)
arr_q = np.array(img_quote)
black_mask = np.all(arr_q == 0, axis=2)
test("quote: no pure black pixels", not np.any(black_mask))

# Has visual content (not all one color)
unique_colors = len(np.unique(arr_q.reshape(-1, 3), axis=0))
test("quote: visual diversity (>100 unique colors)", unique_colors > 100, f"got {unique_colors}")

# Long quote wrapping
long_quote = "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him."
img_long = gfx.render_quote_card(long_quote)
test("quote: long text doesn't crash", img_long is not None)
test("quote: long text correct size", img_long.size == (1920, 1080))

# No attribution
img_no_attr = gfx.render_quote_card("Just a thought.", "")
test("quote: empty attribution ok", img_no_attr is not None)

# Custom accent
accent = gfx.COLORS["signal"]
img_accent = gfx.render_quote_card("Colored", "Test", accent)
test("quote: custom accent ok", img_accent is not None)

# ══════════════════════════════════════════════════════
# RENDER TESTS: Chapter Card
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("RENDER: Chapter Card")
print("=" * 60)

img_chapter = gfx.render_chapter_card("CHAPTER 01", "The Foundations of AI")
test("chapter: returns image", img_chapter is not None)
test("chapter: 1920×1080", img_chapter.size == (1920, 1080))
test("chapter: RGB mode", img_chapter.mode == "RGB")

# No pure black pixels
arr_c = np.array(img_chapter)
black_mask_c = np.all(arr_c == 0, axis=2)
test("chapter: no pure black pixels", not np.any(black_mask_c))

# Visual content
unique_c = len(np.unique(arr_c.reshape(-1, 3), axis=0))
test("chapter: visual diversity (>100 unique)", unique_c > 100, f"got {unique_c}")

# Numeric chapter
img_num = gfx.render_chapter_card("01", "First Steps")
test("chapter: numeric label ok", img_num is not None)

# Long title wrapping
img_long_ch = gfx.render_chapter_card("CHAPTER 03", "Understanding How Neural Networks Learn Through Backpropagation and Gradient Descent")
test("chapter: long title ok", img_long_ch is not None)
test("chapter: long title correct size", img_long_ch.size == (1920, 1080))

# Custom accent
img_ch_accent = gfx.render_chapter_card("PART II", "Deep Dive", gfx.COLORS["result"])
test("chapter: custom accent ok", img_ch_accent is not None)

# ══════════════════════════════════════════════════════
# RENDER TESTS: Montage
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("RENDER: Montage")
print("=" * 60)

scene_montage = {
    "id": "rapid-recap",
    "type": "montage",
    "beat": "deepen",
    "visual": "Quick cuts: neuron firing, weights adjusting, loss decreasing",
    "dialogue": "Everything connects."
}
img_montage = gfx.render_montage(scene_montage)
test("montage: returns image", img_montage is not None)
test("montage: 1920×1080", img_montage.size == (1920, 1080))
test("montage: RGB mode", img_montage.mode == "RGB")

# No pure black pixels
arr_m = np.array(img_montage)
black_mask_m = np.all(arr_m == 0, axis=2)
test("montage: no pure black pixels", not np.any(black_mask_m))

# Visual content
unique_m = len(np.unique(arr_m.reshape(-1, 3), axis=0))
test("montage: visual diversity (>100 unique)", unique_m > 100, f"got {unique_m}")

# Minimal scene (only id/type)
scene_min = {"id": "recap", "type": "montage"}
img_min = gfx.render_montage(scene_min)
test("montage: minimal scene ok", img_min is not None)
test("montage: minimal scene correct size", img_min.size == (1920, 1080))

# Custom accent
img_m_accent = gfx.render_montage(scene_montage, gfx.COLORS["insight"])
test("montage: custom accent ok", img_m_accent is not None)

# Long visual text (should truncate)
scene_long = {
    "id": "big-recap",
    "type": "montage",
    "visual": "A very very very long visual description that goes on and on and exceeds the sixty character limit we set"
}
img_long_m = gfx.render_montage(scene_long)
test("montage: long visual ok", img_long_m is not None)

# ══════════════════════════════════════════════════════
# CINEMA POST-PROCESSING VALIDATION
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("CINEMA: Post-processing effects applied")
print("=" * 60)

# Quote has letterbox (from preset)
preset_quote = gfx.RENDERING_PRESETS['quote']
test("quote preset: letterbox enabled", preset_quote['letterbox'] is True)
test("quote preset: grain > 0", preset_quote['grain'] > 0)
test("quote preset: vignette > 0", preset_quote['vignette'] > 0)

# Chapter has letterbox
preset_chapter = gfx.RENDERING_PRESETS['chapter']
test("chapter preset: letterbox enabled", preset_chapter['letterbox'] is True)
test("chapter preset: grain > 0", preset_chapter['grain'] > 0)

# Montage: no letterbox (rapid-cut doesn't need bars)
preset_montage = gfx.RENDERING_PRESETS['montage']
test("montage preset: no letterbox", preset_montage['letterbox'] is False)
test("montage preset: vignette > 0", preset_montage['vignette'] > 0)

# Verify letterbox bars exist on quote card (dark pixels in top/bottom regions)
# Letterbox at 2.39:1 means bars of ~(1080 - 803)/2 ≈ 138px
arr_q = np.array(img_quote)
top_bar = arr_q[:100, :, :]  # Top 100px
bot_bar = arr_q[-100:, :, :]  # Bottom 100px
center = arr_q[400:600, 400:600, :]  # Center region

# Top/bottom should be darker than center (letterbox effect)
top_mean = np.mean(top_bar)
bot_mean = np.mean(bot_bar)
center_mean = np.mean(center)
test("quote: letterbox bars (top darker than center)", top_mean < center_mean,
     f"top={top_mean:.1f} center={center_mean:.1f}")
test("quote: letterbox bars (bottom darker than center)", bot_mean < center_mean,
     f"bottom={bot_mean:.1f} center={center_mean:.1f}")

# ══════════════════════════════════════════════════════
# PROCESS_SCREENPLAY INTEGRATION
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("INTEGRATION: process_screenplay handles new types")
print("=" * 60)

# Verify the process_screenplay function handles quote, chapter, montage
import inspect
source = inspect.getsource(gfx.process_screenplay)
test("process_screenplay handles 'quote'", "'quote'" in source or '"quote"' in source)
test("process_screenplay handles 'chapter'", "'chapter'" in source or '"chapter"' in source)
test("process_screenplay handles 'montage'", "'montage'" in source or '"montage"' in source)
test("process_screenplay calls render_quote_card", "render_quote_card" in source)
test("process_screenplay calls render_chapter_card", "render_chapter_card" in source)
test("process_screenplay calls render_montage", "render_montage" in source)

# ══════════════════════════════════════════════════════
# Summary
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print(f"RESULTS: {passed}/{passed + failed} passed, {failed} failed")
print("=" * 60)

if failed > 0:
    print("SOME TESTS FAILED")
    sys.exit(1)
else:
    print("All quote/chapter/montage renderer tests passed!")
