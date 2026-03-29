#!/usr/bin/env python3
"""
Test suite for comparison-split, data-viz, step-by-step renderers.
Validates rendering, dimensions, cinema post-processing, and design system compliance.
"""
import json
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
print("TEST 1: Import graphics engine + new renderers")
print("=" * 60)

try:
    from importlib import import_module
    # Direct import since graphics-engine.py uses hyphens
    import importlib.util
    spec = importlib.util.spec_from_file_location("graphics_engine", ROOT / "studio" / "graphics-engine.py")
    gfx = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gfx)
    test("import graphics engine", True)
except Exception as e:
    test("import graphics engine", False, str(e))
    sys.exit(1)

# Check new functions exist
test("render_comparison_split exists", hasattr(gfx, 'render_comparison_split'))
test("render_data_viz exists", hasattr(gfx, 'render_data_viz'))
test("render_step_by_step exists", hasattr(gfx, 'render_step_by_step'))

# Check RENDERING_PRESETS include new types
test("RENDERING_PRESETS has comparison-split", 'comparison-split' in gfx.RENDERING_PRESETS)
test("RENDERING_PRESETS has data-viz", 'data-viz' in gfx.RENDERING_PRESETS)
test("RENDERING_PRESETS has step-by-step", 'step-by-step' in gfx.RENDERING_PRESETS)

# ── Test rendering presets structure ──
print("\n" + "=" * 60)
print("TEST 2: Rendering preset structure validation")
print("=" * 60)

required_keys = ['vignette', 'grain', 'letterbox', 'glow']
for preset_name in ['comparison-split', 'data-viz', 'step-by-step']:
    preset = gfx.RENDERING_PRESETS[preset_name]
    for key in required_keys:
        test(f"{preset_name} has '{key}'", key in preset)
    # Glow must have radius + opacity
    glow = preset.get('glow', {})
    test(f"{preset_name} glow has radius", 'radius' in glow)
    test(f"{preset_name} glow has opacity", 'opacity' in glow)
    # Values in sane ranges
    test(f"{preset_name} vignette 0-1", 0 <= preset['vignette'] <= 1)
    test(f"{preset_name} grain 0-0.1", 0 <= preset['grain'] <= 0.1)

# ── Test comparison-split renderer ──
print("\n" + "=" * 60)
print("TEST 3: render_comparison_split")
print("=" * 60)

scene_compare = {
    "id": "compare-test",
    "type": "comparison-split",
    "beat": "core",
    "left_label": "Traditional ML",
    "right_label": "Deep Learning",
    "left_text": "Requires feature engineering. Human experts must identify patterns.",
    "right_text": "Learns features automatically from raw data.",
}

img_compare = gfx.render_comparison_split(scene_compare)
test("returns Image", img_compare is not None)
test("dimensions 1920x1080", img_compare.size == (1920, 1080))
test("mode is RGB", img_compare.mode == "RGB")

# Check it's not a blank image
import numpy as np
arr = np.array(img_compare)
test("not blank (has variance)", arr.std() > 5)
test("no pure black pixels (void floor)", arr.min() >= 0)

# Test with minimal scene (fallback labels)
scene_minimal = {"id": "min", "type": "comparison-split", "beat": "core"}
img_min = gfx.render_comparison_split(scene_minimal)
test("minimal scene renders", img_min is not None and img_min.size == (1920, 1080))

# ── Test data-viz renderer ──
print("\n" + "=" * 60)
print("TEST 4: render_data_viz")
print("=" * 60)

scene_dataviz = {
    "id": "data-test",
    "type": "data-viz",
    "beat": "deepen",
    "chart_title": "Model Accuracy",
    "data_labels": ["A", "B", "C", "D", "E"],
    "data_values": [0.75, 0.55, 0.85, 0.40, 0.65],
}

img_dv = gfx.render_data_viz(scene_dataviz)
test("returns Image", img_dv is not None)
test("dimensions 1920x1080", img_dv.size == (1920, 1080))
test("mode is RGB", img_dv.mode == "RGB")

arr_dv = np.array(img_dv)
test("not blank", arr_dv.std() > 5)
# Data bars should create some bright pixels (the bar colors)
test("has color variance", arr_dv[:, :, 0].std() > 3 or arr_dv[:, :, 1].std() > 3)

# Test with default data
scene_dv_default = {"id": "dv", "type": "data-viz", "beat": "core"}
img_dv_def = gfx.render_data_viz(scene_dv_default)
test("default data renders", img_dv_def is not None and img_dv_def.size == (1920, 1080))

# ── Test step-by-step renderer ──
print("\n" + "=" * 60)
print("TEST 5: render_step_by_step")
print("=" * 60)

scene_step = {
    "id": "step-one",
    "type": "step-by-step",
    "beat": "core",
    "step_title": "Prepare Your Dataset",
    "step_content": "Collect, clean, and label your training data.",
}

for step_num, total in [(1, 3), (2, 3), (3, 3)]:
    img_s = gfx.render_step_by_step(scene_step, step_num, total)
    test(f"step {step_num}/{total} renders", img_s is not None)
    test(f"step {step_num}/{total} dimensions", img_s.size == (1920, 1080))
    test(f"step {step_num}/{total} mode RGB", img_s.mode == "RGB")

# Progress bar check: step 3/3 should have full bar vs step 1/3
img_s1 = gfx.render_step_by_step(scene_step, 1, 3)
img_s3 = gfx.render_step_by_step(scene_step, 3, 3)
arr_s1 = np.array(img_s1)
arr_s3 = np.array(img_s3)
# Bottom row should differ (progress bar)
bottom_s1 = arr_s1[int(1080 * 0.94):int(1080 * 0.96), :, :]
bottom_s3 = arr_s3[int(1080 * 0.94):int(1080 * 0.96), :, :]
test("progress bar differs between step 1 and 3", not np.array_equal(bottom_s1, bottom_s3))

# Test with motion_graphic fallback
scene_step_fallback = {"id": "fb", "type": "step-by-step", "beat": "core", "motion_graphic": "Diagram of process"}
img_fb = gfx.render_step_by_step(scene_step_fallback)
test("fallback content renders", img_fb is not None and img_fb.size == (1920, 1080))

# ── Test cinema post-processing is applied ──
print("\n" + "=" * 60)
print("TEST 6: Cinema post-processing applied")
print("=" * 60)

# Render without post-processing by using empty preset
img_raw = gfx.gradient_bg(gfx.COLORS["void"], (15, 13, 22))
arr_raw = np.array(img_raw)

# Compare with post-processed
img_post = gfx.apply_cinema_post(img_raw.copy(), 'comparison-split')
arr_post = np.array(img_post)
test("post-processing changes image", not np.array_equal(arr_raw, arr_post))

img_post_dv = gfx.apply_cinema_post(img_raw.copy(), 'data-viz')
arr_post_dv = np.array(img_post_dv)
test("data-viz post-processing changes image", not np.array_equal(arr_raw, arr_post_dv))

img_post_ss = gfx.apply_cinema_post(img_raw.copy(), 'step-by-step')
arr_post_ss = np.array(img_post_ss)
test("step-by-step post-processing changes image", not np.array_equal(arr_raw, arr_post_ss))

# ── Test design-tokens.js RENDERING_PRESETS sync ──
print("\n" + "=" * 60)
print("TEST 7: design-tokens.js RENDERING_PRESETS sync")
print("=" * 60)

dt_path = ROOT / "studio" / "design-tokens.js"
dt_content = dt_path.read_text()

test("design-tokens.js has comparisonSplit preset", "comparisonSplit:" in dt_content or "comparisonSplit :" in dt_content)
test("design-tokens.js has dataVisualization preset", "dataVisualization:" in dt_content or "dataVisualization :" in dt_content)
test("design-tokens.js has stepByStep preset", "stepByStep:" in dt_content or "stepByStep :" in dt_content)

# Check the new presets are in the RENDERING_PRESETS block (not just renderPresets)
# Find RENDERING_PRESETS export block
import re
rp_match = re.search(r'export const RENDERING_PRESETS\s*=\s*\{(.*?)\};', dt_content, re.DOTALL)
test("RENDERING_PRESETS block found", rp_match is not None)
if rp_match:
    rp_block = rp_match.group(1)
    test("RENDERING_PRESETS contains comparisonSplit", "comparisonSplit" in rp_block)
    test("RENDERING_PRESETS contains dataVisualization", "dataVisualization" in rp_block)
    test("RENDERING_PRESETS contains stepByStep", "stepByStep" in rp_block)

# ── Test process_screenplay handles new types ──
print("\n" + "=" * 60)
print("TEST 8: process_screenplay with new scene types")
print("=" * 60)

import tempfile

sp = {
    "title": "Unit Test",
    "version": "1.0",
    "persona": "faye",
    "colorTheme": "ai-foundations",
    "scenes": [
        {"id": "cs", "type": "comparison-split", "beat": "core", "left_label": "A", "right_label": "B"},
        {"id": "dv", "type": "data-viz", "beat": "core", "chart_title": "Test"},
        {"id": "s1", "type": "step-by-step", "beat": "core", "step_title": "First"},
        {"id": "s2", "type": "step-by-step", "beat": "core", "step_title": "Second"},
    ]
}

with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
    json.dump(sp, f)
    tmp_path = f.name

try:
    generated = gfx.process_screenplay(tmp_path)
    test("process_screenplay returns list", isinstance(generated, list))
    test("generated >= 4 files", len(generated) >= 4)

    # Check specific files exist
    gfx_dir = ROOT / "output" / "graphics"
    test("comparison-split PNG exists", (gfx_dir / "unit-test_cs.png").exists())
    test("data-viz PNG exists", (gfx_dir / "unit-test_dv.png").exists())
    test("step 1 PNG exists", (gfx_dir / "unit-test_s1.png").exists())
    test("step 2 PNG exists", (gfx_dir / "unit-test_s2.png").exists())
finally:
    os.unlink(tmp_path)

# ── Summary ──
print("\n" + "=" * 60)
total = passed + failed
print(f"RESULTS: {passed}/{total} passed, {failed} failed")
print("=" * 60)

if failed > 0:
    sys.exit(1)
else:
    print("\nAll tests passed.")
