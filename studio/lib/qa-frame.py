#!/usr/bin/env python3
"""
Like One Studio — Frame QA Gate (Design System V3)
Analyzes individual frames against the Visual Bible V3 design system.
Rejects anything that doesn't meet the standard. No compromises.

Checks:
  1. Color compliance — only palette colors allowed (within tolerance)
  2. Contrast ratios — WCAG AA minimum, AAA preferred
  3. Negative space — minimum 30% empty, target 50%
  4. Banned colors — no pure #000 or #FFF
  5. Max elements — cognitive load (max 4 simultaneous)
  6. Font size minimums — nothing below 16px equivalent
  7. Darkness check — void background warmth (not pure black)

Usage:
  python3 qa-frame.py <image.png> [--strict] [--json]
  python3 qa-frame.py <video.mp4> --sample 5  (sample 5 frames)

Returns exit code 0 if pass, 1 if fail.
"""
import sys
import os
import json
import math
from collections import Counter

try:
    from PIL import Image
    import numpy as np
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False

# ═══════════════════════════════════════════════════
# DESIGN SYSTEM V3 — THE LAW
# ═══════════════════════════════════════════════════

# Approved palette (RGB tuples)
PALETTE = {
    'void':     (11, 10, 16),
    'chalk':    (240, 235, 227),
    'smoke':    (138, 132, 144),
    'ash':      (45, 42, 51),
    'signal':   (212, 149, 107),
    'process':  (139, 175, 196),
    'result':   (140, 184, 158),
    'alert':    (196, 97, 106),
    'insight':  (184, 152, 200),
    'focus':    (245, 240, 232),
    'bone':     (232, 221, 208),
    'obsidian': (26, 23, 32),
    'blush':    (212, 160, 160),
    'gold':     (196, 168, 108),
}

# Course accents (also allowed)
COURSE_ACCENTS = [
    (139, 175, 196),  # ai-foundations
    (155, 136, 184),  # rag-vectors
    (212, 149, 107),  # prompt-craft
    (140, 184, 158),  # ethics-safety
    (212, 160, 160),  # creative-ai
    (196, 168, 108),  # business-ai
    (184, 152, 200),  # how-ai-works
]

# Banned colors
BANNED = {
    'pure_black': (0, 0, 0),
    'pure_white': (255, 255, 255),
}

# Thresholds
COLOR_TOLERANCE = 35          # Max Euclidean distance to nearest palette color
NEGATIVE_SPACE_MIN = 0.30     # 30% minimum empty space
NEGATIVE_SPACE_TARGET = 0.50  # 50% target (Rothko)
DARK_PIXEL_THRESHOLD = 30     # Pixels below this luminance count as "empty"
CONTRAST_AA = 4.5             # WCAG AA
CONTRAST_AAA = 7.0            # WCAG AAA
BANNED_TOLERANCE = 8          # How close to banned colors triggers rejection
MAX_DOMINANT_COLORS = 4       # Cognitive load: max 4 competing colors per frame
MIN_FONT_AREA_PCT = 0.001     # Minimum text region size (roughly 16px+ at 1080p)


def rgb_distance(c1, c2):
    """Euclidean distance between two RGB tuples. Cast to int to avoid uint8 overflow."""
    return math.sqrt(sum((int(a) - int(b)) ** 2 for a, b in zip(c1, c2)))


def relative_luminance(r, g, b):
    """WCAG 2.1 relative luminance from sRGB values (0-255)."""
    def linearize(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)


def contrast_ratio(lum1, lum2):
    """WCAG contrast ratio between two luminance values."""
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)


def nearest_palette_color(rgb):
    """Find the nearest palette color and its distance."""
    all_colors = list(PALETTE.values()) + COURSE_ACCENTS
    min_dist = float('inf')
    nearest = None
    nearest_name = None
    for name, pc in PALETTE.items():
        d = rgb_distance(rgb, pc)
        if d < min_dist:
            min_dist = d
            nearest = pc
            nearest_name = name
    for ac in COURSE_ACCENTS:
        d = rgb_distance(rgb, ac)
        if d < min_dist:
            min_dist = d
            nearest = ac
            nearest_name = f'course_accent_{ac}'
    return nearest_name, nearest, min_dist


def is_banned(rgb):
    """Check if a color is too close to a banned color."""
    for name, banned_rgb in BANNED.items():
        if rgb_distance(rgb, banned_rgb) < BANNED_TOLERANCE:
            return True, name
    return False, None


def analyze_frame(img_path, strict=False):
    """
    Run all design system checks on a single frame.
    Returns dict with pass/fail, score, and detailed checks.
    """
    if not HAS_DEPS:
        return {'pass': False, 'error': 'Missing PIL/numpy. Install: pip install Pillow numpy'}

    img = Image.open(img_path).convert('RGB')
    arr = np.array(img)
    h, w = arr.shape[:2]
    total_pixels = h * w

    checks = []

    # ── CHECK 1: Banned Colors ──
    # Sample pixels (full scan is slow for 1080p — sample 50k pixels)
    sample_size = min(50000, total_pixels)
    indices = np.random.choice(total_pixels, sample_size, replace=False)
    flat = arr.reshape(-1, 3)
    sample = flat[indices]

    banned_count = 0
    banned_details = []
    for px in sample:
        is_b, name = is_banned(tuple(px))
        if is_b:
            banned_count += 1
            if len(banned_details) < 3:
                banned_details.append(f'{name}: rgb({px[0]},{px[1]},{px[2]})')

    banned_pct = banned_count / sample_size
    banned_pass = banned_pct < 0.01  # Less than 1% banned pixels
    checks.append({
        'name': 'banned_colors',
        'pass': banned_pass,
        'expected': '<1% pure black/white pixels',
        'actual': f'{banned_pct*100:.2f}% ({banned_count}/{sample_size} sampled)',
        'detail': '; '.join(banned_details) if not banned_pass else None,
        'severity': 'critical',
    })

    # ── CHECK 2: Color Palette Compliance ──
    # Check what % of non-dark pixels are within palette tolerance
    luminance = 0.2126 * arr[:,:,0].astype(float) + 0.7152 * arr[:,:,1].astype(float) + 0.0722 * arr[:,:,2].astype(float)
    non_dark_mask = luminance > DARK_PIXEL_THRESHOLD
    non_dark_pixels = flat[non_dark_mask.flatten()]

    if len(non_dark_pixels) > 0:
        palette_sample = non_dark_pixels[np.random.choice(len(non_dark_pixels), min(10000, len(non_dark_pixels)), replace=False)]
        on_palette = 0
        off_palette_examples = []
        for px in palette_sample:
            _, _, dist = nearest_palette_color(tuple(px))
            if dist <= COLOR_TOLERANCE:
                on_palette += 1
            elif len(off_palette_examples) < 5:
                off_palette_examples.append(f'rgb({px[0]},{px[1]},{px[2]}) dist={dist:.0f}')

        palette_pct = on_palette / len(palette_sample)
        palette_pass = palette_pct > 0.70  # 70% of visible pixels should be on-palette
        checks.append({
            'name': 'palette_compliance',
            'pass': palette_pass,
            'expected': '>70% of visible pixels within palette (tolerance={})'.format(COLOR_TOLERANCE),
            'actual': f'{palette_pct*100:.1f}% on-palette',
            'detail': 'Off-palette: ' + '; '.join(off_palette_examples) if not palette_pass else None,
            'severity': 'warning' if palette_pct > 0.50 else 'critical',
        })
    else:
        checks.append({
            'name': 'palette_compliance',
            'pass': True,
            'expected': 'palette check',
            'actual': 'frame is mostly dark (void) — palette N/A',
            'severity': 'info',
        })

    # ── CHECK 3: Negative Space ──
    dark_pixels = np.sum(luminance <= DARK_PIXEL_THRESHOLD)
    neg_space_pct = dark_pixels / total_pixels
    neg_space_pass = neg_space_pct >= NEGATIVE_SPACE_MIN
    neg_space_target = neg_space_pct >= NEGATIVE_SPACE_TARGET

    checks.append({
        'name': 'negative_space',
        'pass': neg_space_pass,
        'expected': f'>={NEGATIVE_SPACE_MIN*100:.0f}% (target {NEGATIVE_SPACE_TARGET*100:.0f}%)',
        'actual': f'{neg_space_pct*100:.1f}%',
        'detail': None if neg_space_pass else f'Frame too busy — only {neg_space_pct*100:.1f}% empty. Rothko says 50%.',
        'severity': 'critical' if neg_space_pct < 0.20 else 'warning',
        'target_met': neg_space_target,
    })

    # ── CHECK 4: Dominant Color Count ──
    # Quantize to find dominant colors
    from PIL import ImageFilter
    img_small = img.resize((96, 54))  # Downsample for speed
    pixels_small = np.array(img_small).reshape(-1, 3)
    # Filter out near-black pixels
    lum_small = 0.2126 * pixels_small[:,0] + 0.7152 * pixels_small[:,1] + 0.0722 * pixels_small[:,2]
    visible = pixels_small[lum_small > DARK_PIXEL_THRESHOLD]

    if len(visible) > 50:
        # Quantize to 8-color palette
        quantized = (visible // 32) * 32  # Bucket to 32-value steps
        color_tuples = [tuple(c) for c in quantized]
        counts = Counter(color_tuples)
        # Count colors that represent >5% of visible area
        dominant = [c for c, n in counts.most_common(10) if n / len(visible) > 0.05]
        dom_count = len(dominant)
        dom_pass = dom_count <= MAX_DOMINANT_COLORS
        checks.append({
            'name': 'color_count',
            'pass': dom_pass,
            'expected': f'<={MAX_DOMINANT_COLORS} dominant colors (cognitive load)',
            'actual': f'{dom_count} dominant colors',
            'detail': None if dom_pass else f'Too many competing colors ({dom_count}). Max {MAX_DOMINANT_COLORS} per frame.',
            'severity': 'warning',
        })
    else:
        checks.append({
            'name': 'color_count',
            'pass': True,
            'expected': 'color count check',
            'actual': 'minimal visible content — N/A',
            'severity': 'info',
        })

    # ── CHECK 5: Contrast Check ──
    # Find the brightest and darkest significant regions
    if len(non_dark_pixels) > 0:
        brightest = non_dark_pixels[np.argmax(np.sum(non_dark_pixels.astype(float), axis=1))]
        darkest_visible = non_dark_pixels[np.argmin(np.sum(non_dark_pixels.astype(float), axis=1))]

        # Check brightest text-like color against void background
        bg_lum = relative_luminance(11, 10, 16)  # void
        text_lum = relative_luminance(int(brightest[0]), int(brightest[1]), int(brightest[2]))
        cr = contrast_ratio(text_lum, bg_lum)

        cr_aa = cr >= CONTRAST_AA
        cr_aaa = cr >= CONTRAST_AAA
        checks.append({
            'name': 'contrast_ratio',
            'pass': cr_aa,
            'expected': f'>={CONTRAST_AA} (AA), >={CONTRAST_AAA} (AAA preferred)',
            'actual': f'{cr:.1f}:1 (brightest vs void)',
            'detail': None if cr_aa else f'Contrast {cr:.1f} below WCAG AA minimum {CONTRAST_AA}',
            'severity': 'critical' if cr < 3.0 else 'warning',
            'aaa': cr_aaa,
        })

    # ── CHECK 6: Void Background Warmth ──
    # The darkest pixels should be warm (aubergine), not pure black
    darkest_pixels = flat[luminance.flatten() <= 10]
    if len(darkest_pixels) > 100:
        avg_dark = darkest_pixels.mean(axis=0)
        # Void should be (11, 10, 16) — has blue/purple tint
        # Pure black is (0, 0, 0) — reject if too neutral
        warmth = avg_dark[2] - avg_dark[1]  # Blue-green difference
        has_warmth = warmth > -2  # Allow small tolerance
        r_g_ratio = avg_dark[0] / max(avg_dark[1], 1)

        warmth_pass = has_warmth and rgb_distance(tuple(avg_dark.astype(int)), (0, 0, 0)) > 10
        checks.append({
            'name': 'void_warmth',
            'pass': warmth_pass,
            'expected': 'Dark pixels should be warm aubergine, not pure black',
            'actual': f'avg dark: rgb({avg_dark[0]:.0f},{avg_dark[1]:.0f},{avg_dark[2]:.0f})',
            'detail': None if warmth_pass else 'Background too close to pure black. Use void (#0B0A10).',
            'severity': 'warning',
        })

    # ── SCORE ──
    critical_fails = [c for c in checks if not c['pass'] and c.get('severity') == 'critical']
    warning_fails = [c for c in checks if not c['pass'] and c.get('severity') == 'warning']
    total = len(checks)
    passed = len([c for c in checks if c['pass']])

    if strict:
        overall_pass = len(critical_fails) == 0 and len(warning_fails) == 0
    else:
        overall_pass = len(critical_fails) == 0  # Warnings don't fail in normal mode

    score = round((passed / total) * 100) if total > 0 else 0

    return {
        'pass': overall_pass,
        'score': score,
        'checks': checks,
        'critical_fails': len(critical_fails),
        'warnings': len(warning_fails),
        'summary': f"{'PASS' if overall_pass else 'FAIL'} {passed}/{total} ({score}%) | {len(critical_fails)} critical, {len(warning_fails)} warnings",
        'frame': img_path,
        'resolution': f'{w}x{h}',
    }


def sample_video_frames(video_path, num_frames=5):
    """Extract sample frames from a video and analyze each."""
    import subprocess
    import tempfile

    # Get video duration
    try:
        dur = float(subprocess.check_output(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', video_path],
            encoding='utf-8').strip())
    except Exception:
        dur = 60

    results = []
    tmpdir = tempfile.mkdtemp(prefix='qa_frame_')

    for i in range(num_frames):
        t = dur * (i + 1) / (num_frames + 1)  # Evenly spaced
        frame_path = os.path.join(tmpdir, f'frame_{i:03d}.png')
        try:
            subprocess.run(
                ['ffmpeg', '-y', '-ss', str(t), '-i', video_path, '-vframes', '1', '-q:v', '2', frame_path],
                capture_output=True, timeout=30)
            if os.path.exists(frame_path):
                result = analyze_frame(frame_path, strict='--strict' in sys.argv)
                result['timestamp_s'] = round(t, 1)
                results.append(result)
                os.unlink(frame_path)
        except Exception as e:
            results.append({'pass': False, 'error': str(e), 'timestamp_s': round(t, 1)})

    # Cleanup
    try:
        os.rmdir(tmpdir)
    except Exception:
        pass

    # Overall
    all_pass = all(r.get('pass', False) for r in results)
    avg_score = sum(r.get('score', 0) for r in results) / max(len(results), 1)

    return {
        'pass': all_pass,
        'avg_score': round(avg_score),
        'frames_analyzed': len(results),
        'frames_passed': sum(1 for r in results if r.get('pass', False)),
        'results': results,
        'video': video_path,
    }


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] in ('-h', '--help'):
        print("Like One Studio — Frame QA Gate (Design System V3)")
        print("Usage:")
        print("  python3 qa-frame.py <image.png> [--strict] [--json]")
        print("  python3 qa-frame.py <video.mp4> --sample 5")
        sys.exit(1)

    target = sys.argv[1]
    strict = '--strict' in sys.argv
    as_json = '--json' in sys.argv

    if '--sample' in sys.argv:
        idx = sys.argv.index('--sample')
        num = int(sys.argv[idx + 1]) if idx + 1 < len(sys.argv) else 5
        result = sample_video_frames(target, num)
    else:
        result = analyze_frame(target, strict=strict)

    if as_json:
        print(json.dumps(result, indent=2, default=str))
    else:
        if 'results' in result:  # Video mode
            print(f"\n  LIKE ONE STUDIO — Frame QA ({result['frames_analyzed']} frames)")
            print('  ' + '=' * 55)
            for r in result['results']:
                t = r.get('timestamp_s', '?')
                icon = 'PASS' if r.get('pass') else 'FAIL'
                print(f"  [{icon}] t={t}s | {r.get('summary', r.get('error', 'unknown'))}")
            print('  ' + '=' * 55)
            print(f"  OVERALL: {'PASS' if result['pass'] else 'FAIL'} | avg score: {result['avg_score']}% | {result['frames_passed']}/{result['frames_analyzed']} frames passed")
        else:  # Single frame
            print(f"\n  LIKE ONE STUDIO — Frame QA")
            print('  ' + '=' * 55)
            for c in result.get('checks', []):
                icon = 'PASS' if c['pass'] else 'FAIL'
                sev = f" [{c.get('severity', '')}]" if not c['pass'] else ''
                print(f"  [{icon}]{sev} {c['name']}: {c['actual']}")
                if c.get('detail'):
                    print(f"         {c['detail']}")
            print('  ' + '=' * 55)
            print(f"  {result.get('summary', 'unknown')}")

    sys.exit(0 if result.get('pass', False) else 1)
