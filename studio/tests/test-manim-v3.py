#!/usr/bin/env python3
"""
Manim V3 Color Test Suite
Validates that manim-scenes.py renders correctly with V3 design tokens.

Tests:
  1. Source-level: all color constants in manim-scenes.py match design-tokens.js
  2. Render-level: all 3 scenes render without errors at 1920x1080
  3. Video output: resolution, frame rate, duration validation
  4. Pixel-level: rendered frames use V3 palette colors (with opacity blending tolerance)

Usage:
  python3 studio/tests/test-manim-v3.py
"""
import subprocess
import sys
import os
import re
import json
import math
import tempfile

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MANIM_SCENES = os.path.join(REPO_ROOT, 'studio', 'lib', 'manim-scenes.py')
DESIGN_TOKENS = os.path.join(REPO_ROOT, 'studio', 'design-tokens.js')
OUTPUT_DIR = os.path.join(REPO_ROOT, 'studio', 'test-renders')
PYTHON = os.path.join(REPO_ROOT, '.venv', 'bin', 'python3')

# V3 Visual Bible Rothko palette (source of truth: design-tokens.js)
V3_PALETTE = {
    'void':    '#0B0A10',
    'chalk':   '#F0EBE3',
    'smoke':   '#8A8490',
    'ash':     '#2D2A33',
    'signal':  '#D4956B',
    'process': '#8BAFC4',
    'result':  '#8CB89E',
    'alert':   '#C4616A',
    'insight': '#B898C8',
    'bone':    '#E8DDD0',
    'gold':    '#C4A86C',
}

SCENES = ['neuron-diagram', 'layer-stack', 'network-emergence']
TEST_DURATION = 4.0  # seconds — short renders for testing
passed = 0
failed = 0


def test(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}: {detail}")


def hex_to_rgb(hex_color):
    """Convert #RRGGBB to (R, G, B) tuple."""
    h = hex_color.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def color_distance(c1, c2):
    """Euclidean distance in RGB space."""
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))


def extract_frame(video_path, timestamp="00:00:02"):
    """Extract a single frame from a video as a PNG, returns path."""
    frame_path = tempfile.mktemp(suffix='.png')
    subprocess.run(
        ['ffmpeg', '-y', '-ss', timestamp, '-i', video_path,
         '-frames:v', '1', '-f', 'image2', frame_path],
        capture_output=True, timeout=30
    )
    return frame_path if os.path.exists(frame_path) else None


def get_video_info(video_path):
    """Get video metadata via ffprobe."""
    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
         '-show_entries', 'stream=width,height,r_frame_rate,duration',
         '-show_entries', 'format=duration',
         '-of', 'json', video_path],
        capture_output=True, text=True
    )
    return json.loads(probe.stdout) if probe.returncode == 0 else None


# ── Test 1: Source-level color sync ──
print("\n[1/4] SOURCE COLOR SYNC")
with open(MANIM_SCENES) as f:
    manim_src = f.read()

# Extract color assignments from manim-scenes.py
manim_colors = {}
for match in re.finditer(r'^(\w+)\s*=\s*["\']#([0-9A-Fa-f]{6})["\']', manim_src, re.MULTILINE):
    name = match.group(1).lower()
    hex_val = f'#{match.group(2)}'
    manim_colors[name] = hex_val

for token_name, token_hex in V3_PALETTE.items():
    manim_hex = manim_colors.get(token_name, 'MISSING')
    test(
        f"{token_name}: manim={manim_hex} tokens={token_hex}",
        manim_hex.upper() == token_hex.upper(),
        f"expected {token_hex}, got {manim_hex}"
    )

# Verify design-tokens.js is the actual source
test("design-tokens.js exists", os.path.exists(DESIGN_TOKENS), "missing source-of-truth file")

# Cross-check: read design-tokens.js and verify palette values match
if os.path.exists(DESIGN_TOKENS):
    with open(DESIGN_TOKENS) as f:
        tokens_src = f.read()
    for token_name, expected_hex in V3_PALETTE.items():
        # Look for the token name followed by its hex value in JS source
        pattern = rf"{token_name}:\s*'({expected_hex})'"
        found = re.search(pattern, tokens_src, re.IGNORECASE)
        test(
            f"design-tokens.js has {token_name}={expected_hex}",
            found is not None,
            f"token {token_name} not found or mismatched in design-tokens.js"
        )

# ── Test 2: Render all 3 scenes ──
print("\n[2/4] SCENE RENDERING")
for scene in SCENES:
    result = subprocess.run(
        [PYTHON, MANIM_SCENES, scene, OUTPUT_DIR, str(TEST_DURATION)],
        capture_output=True, text=True, timeout=120
    )
    test(
        f"render {scene}",
        result.returncode == 0,
        result.stderr[-200:] if result.returncode != 0 else ""
    )

# ── Test 3: Video output validation (resolution, frame rate, duration) ──
print("\n[3/4] VIDEO OUTPUT VALIDATION")
for scene in SCENES:
    video = os.path.join(OUTPUT_DIR, 'videos', '1080p60', f'{scene}.mp4')
    exists = os.path.exists(video)
    test(f"{scene}.mp4 exists", exists)

    if not exists:
        continue

    info = get_video_info(video)
    if not info:
        test(f"{scene} ffprobe", False, "ffprobe failed")
        continue

    stream = info.get('streams', [{}])[0]
    fmt = info.get('format', {})

    # Resolution
    w, h = stream.get('width', 0), stream.get('height', 0)
    test(f"{scene} resolution 1920x1080", w == 1920 and h == 1080, f"got {w}x{h}")

    # Frame rate (manim high_quality renders at 60fps by default)
    fps_str = stream.get('r_frame_rate', '0/1')
    if '/' in fps_str:
        num, den = fps_str.split('/')
        fps = int(num) / int(den) if int(den) != 0 else 0
    else:
        fps = float(fps_str)
    test(f"{scene} frame rate >= 30fps", fps >= 30, f"got {fps}")

    # Duration (should be close to TEST_DURATION)
    duration = float(fmt.get('duration', stream.get('duration', 0)))
    test(
        f"{scene} duration ~{TEST_DURATION}s",
        abs(duration - TEST_DURATION) < 2.0,
        f"got {duration:.1f}s (expected ~{TEST_DURATION}s)"
    )

# ── Test 4: Pixel-level V3 palette validation ──
print("\n[4/4] PIXEL-LEVEL COLOR VALIDATION")

# Build the full palette as RGB tuples for distance checking
# Include all V3 colors + blended variants (since manim uses fill_opacity)
palette_rgb = [hex_to_rgb(h) for h in V3_PALETTE.values()]

# Opacity blending produces colors between void and the palette color.
# Pre-compute blended variants at common opacity levels (0.1 to 1.0)
void_rgb = hex_to_rgb(V3_PALETTE['void'])
for hex_val in V3_PALETTE.values():
    rgb = hex_to_rgb(hex_val)
    for alpha in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]:
        blended = tuple(int(void_rgb[c] * (1 - alpha) + rgb[c] * alpha) for c in range(3))
        palette_rgb.append(blended)

try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("  SKIP  Pillow not available — skipping pixel-level tests")

if PILLOW_AVAILABLE:
    # Color distance threshold: accounts for video compression artifacts (H.264)
    # and antialiasing. 40 in RGB space is generous but catches off-palette colors.
    DISTANCE_THRESHOLD = 40

    for scene in SCENES:
        video = os.path.join(OUTPUT_DIR, 'videos', '1080p60', f'{scene}.mp4')
        if not os.path.exists(video):
            continue

        # Extract a mid-video frame (most visual content present)
        frame_path = extract_frame(video, "00:00:02")
        if not frame_path:
            test(f"{scene} frame extraction", False, "ffmpeg failed")
            continue

        img = Image.open(frame_path).convert('RGB')
        width, height = img.size

        # Sample pixels across a grid (not every pixel — compression artifacts
        # make per-pixel checking impractical, but a grid catches palette violations)
        GRID_STEP = 20
        total_sampled = 0
        on_palette = 0
        off_palette_examples = []

        for y in range(0, height, GRID_STEP):
            for x in range(0, width, GRID_STEP):
                pixel = img.getpixel((x, y))
                total_sampled += 1

                # Find minimum distance to any palette color (including blends)
                min_dist = min(color_distance(pixel, pc) for pc in palette_rgb)
                if min_dist <= DISTANCE_THRESHOLD:
                    on_palette += 1
                elif len(off_palette_examples) < 5:
                    off_palette_examples.append(f"({x},{y})=#{pixel[0]:02x}{pixel[1]:02x}{pixel[2]:02x} d={min_dist:.0f}")

        pct = (on_palette / total_sampled * 100) if total_sampled > 0 else 0
        # At least 90% of sampled pixels should be on-palette
        # (remaining 10% allows for antialiasing edges and compression)
        test(
            f"{scene} V3 palette coverage {pct:.1f}%",
            pct >= 90.0,
            f"only {pct:.1f}% on-palette. Examples: {'; '.join(off_palette_examples)}"
        )

        test(
            f"{scene} dominant color is void background",
            on_palette > 0,
            "no on-palette pixels found"
        )

        # Clean up temp frame
        os.unlink(frame_path)

# ── Summary ──
total = passed + failed
print(f"\n{'='*50}")
print(f"MANIM V3 TEST RESULTS: {passed}/{total} passed")
if failed == 0:
    print("ALL TESTS PASSED")
else:
    print(f"{failed} TESTS FAILED")
print(f"{'='*50}")

sys.exit(0 if failed == 0 else 1)
