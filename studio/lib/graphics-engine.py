#!/usr/bin/env python3
"""
Like One Studio — Graphics Engine V3
Generates title cards, lower thirds, text overlays, section headers,
quote cards, and chapter cards.

Design System V3: McQueen x Rothko x Apple.
Font system: Outfit (display), Inter (body), Cormorant Garamond (accent),
JetBrains Mono (code). All loaded from studio/assets/fonts/.

Every frame this engine produces MUST pass qa-frame.py.

Usage:
  python3 graphics-engine.py title "What Is a Neuron?" "Like One Academy" output.png
  python3 graphics-engine.py lower-third "What Is a Neuron?" output.png
  python3 graphics-engine.py text-overlay "One → Thousands → Layers" output.png
  python3 graphics-engine.py section-header "How Neurons Fire" output.png
  python3 graphics-engine.py quote "The map is not the territory" "Alfred Korzybski" output.png
  python3 graphics-engine.py chapter "Chapter 1" "The Artificial Neuron" output.png
"""
import sys
import os
from PIL import Image, ImageDraw, ImageFont

# ═══════════════════════════════════════════════════
# DESIGN SYSTEM V3 — TOKENS
# ═══════════════════════════════════════════════════

# Foundations
VOID = (11, 10, 16)         # #0B0A10 — deep aubergine-black (NEVER pure #000)
OBSIDIAN = (26, 23, 32)     # #1A1720 — deepest shadow
CHALK = (240, 235, 227)     # #F0EBE3 — bone white (NEVER pure #FFF)
SMOKE = (138, 132, 144)     # #8A8490 — mauve gray
ASH = (45, 42, 51)          # #2D2A33 — warm charcoal

# Semantic
SIGNAL = (212, 149, 107)    # #D4956B — terracotta (input/data)
PROCESS = (139, 175, 196)   # #8BAFC4 — dusty blue (transformation)
RESULT = (140, 184, 158)    # #8CB89E — sage (output/growth)
ALERT = (196, 97, 106)      # #C4616A — muted rose (attention)
INSIGHT = (184, 152, 200)   # #B898C8 — wisteria (aha/sublime)

# McQueen accents
BONE = (232, 221, 208)      # #E8DDD0 — skeletal elegance
BLUSH = (212, 160, 160)     # #D4A0A0 — the feminine touch
GOLD = (196, 168, 108)      # #C4A86C — earned warmth, used sparingly

W, H = 1920, 1080
SAFE_MARGIN = 96             # Title-safe area

# ═══════════════════════════════════════════════════
# FONT SYSTEM V3
# ═══════════════════════════════════════════════════

FONTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "fonts")

# Font role → file mapping (priority order)
FONT_MAP = {
    'display': [
        'Outfit-Variable.ttf',
        'GeneralSans-Variable.ttf',
    ],
    'body': [
        'Inter-Variable.ttf',
        'DMSans-Variable.ttf',
        'GeneralSans-Variable.ttf',
    ],
    'accent': [
        'CormorantGaramond-Regular.ttf',
        'CormorantGaramond-Light.ttf',
        'PlayfairDisplay-Variable.ttf',
        'Lora-Variable.ttf',
    ],
    'accent_light': [
        'CormorantGaramond-Light.ttf',
        'CormorantGaramond-Regular.ttf',
    ],
    'code': [
        'JetBrainsMono-Regular.ttf',
        'JetBrainsMono-Light.ttf',
    ],
    'serif': [
        'PlayfairDisplay-Variable.ttf',
        'Lora-Variable.ttf',
    ],
    'tech': [
        'SpaceGrotesk-Variable.ttf',
        'Outfit-Variable.ttf',
    ],
}

# System fallbacks
SYSTEM_FALLBACKS = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/SFNSDisplay.ttf",
    "/Library/Fonts/Arial.ttf",
]

_font_cache = {}

def load_font(role, size):
    """Load a font by role (display, body, accent, code) and size.
    Uses caching for performance."""
    cache_key = (role, size)
    if cache_key in _font_cache:
        return _font_cache[cache_key]

    candidates = FONT_MAP.get(role, FONT_MAP['body'])
    for fname in candidates:
        fpath = os.path.join(FONTS_DIR, fname)
        if os.path.exists(fpath):
            try:
                font = ImageFont.truetype(fpath, size)
                _font_cache[cache_key] = font
                return font
            except Exception:
                continue

    # System fallbacks
    for fpath in SYSTEM_FALLBACKS:
        if os.path.exists(fpath):
            try:
                font = ImageFont.truetype(fpath, size)
                _font_cache[cache_key] = font
                return font
            except Exception:
                continue

    font = ImageFont.load_default()
    _font_cache[cache_key] = font
    return font


# ═══════════════════════════════════════════════════
# UTILITY
# ═══════════════════════════════════════════════════

def vignette(img, strength=0.4):
    """Apply radial vignette darkening. McQueen drama."""
    try:
        import numpy as np
        arr = np.array(img, dtype=np.float32)
        h, w = arr.shape[:2]
        cx, cy = w / 2, h / 2
        y_coords, x_coords = np.mgrid[0:h, 0:w]
        dist = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
        max_dist = np.sqrt(cx**2 + cy**2)
        factor = 1.0 - (dist / max_dist * strength)
        factor = factor[:, :, np.newaxis]
        arr[:, :, :3] *= factor
        arr = np.clip(arr, 0, 255).astype(np.uint8)
        return Image.fromarray(arr, img.mode)
    except ImportError:
        return img


def text_bbox_size(draw, text, font):
    """Get text width and height."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def center_x(text_width):
    """Center horizontally."""
    return (W - text_width) // 2


def draw_glow(draw, x, y, text, font, color, radius=2, alpha=25):
    """Draw subtle glow behind text. Candlelight, not spotlight."""
    for dx in range(-radius, radius + 1):
        for dy in range(-radius, radius + 1):
            if dx == 0 and dy == 0:
                continue
            draw.text((x + dx, y + dy), text, font=font, fill=color + (alpha,))


# ═══════════════════════════════════════════════════
# RENDERERS
# ═══════════════════════════════════════════════════

def render_title(title, subtitle, output_path):
    """Cinema title card. Outfit display + Inter subtitle.
    McQueen restraint: one devastating title, minimal decoration.
    Rothko: void canvas with warm gold accent.
    Composition: center-weighted, generous negative space."""
    img = Image.new('RGBA', (W, H), VOID + (255,))
    draw = ImageDraw.Draw(img)

    # Title — Outfit display, light weight (72pt = hero scale)
    title_font = load_font('display', 72)
    tw, th = text_bbox_size(draw, title, title_font)
    tx = center_x(tw)
    ty = int(H * 0.42) - th // 2  # 42% vertical — golden ratio zone

    # Subtle gold glow (barely there — candle, not spotlight)
    glow_font = load_font('display', 74)
    draw_glow(draw, tx, ty, title, glow_font, GOLD, radius=2, alpha=25)

    # Title text — chalk on void
    draw.text((tx, ty), title, font=title_font, fill=CHALK + (255,))

    # Accent line — bone, thin, restrained (McQueen: one devastating accent)
    line_w = min(tw + 40, 600)
    line_x = center_x(line_w)
    line_y = ty + th + 16
    draw.rectangle([line_x, line_y, line_x + line_w, line_y + 2], fill=BONE + (100,))

    # Subtitle — Inter body, smoke color (whisper, not shout)
    if subtitle:
        sub_font = load_font('body', 28)
        sw, sh = text_bbox_size(draw, subtitle, sub_font)
        sx = center_x(sw)
        sy = int(H * 0.58)  # 58% vertical
        draw.text((sx, sy), subtitle, font=sub_font, fill=SMOKE + (220,))

    img = vignette(img, 0.35)
    img.save(output_path, 'PNG')
    return output_path


def render_lower_third(text, output_path):
    """Netflix-style lower third. Minimal, transparent bg.
    Typography: Inter body at 24pt, +0.05em tracking simulated.
    Documentary aesthetic — no heavy bar, just text + underline."""
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Position: bottom-left, title-safe zone
    x = SAFE_MARGIN
    y = H - 160

    # Name text — Inter, medium weight
    font = load_font('body', 28)
    draw.text((x, y), text, font=font, fill=BONE + (240,))
    tw, th = text_bbox_size(draw, text, font)

    # Subtle underline — chalk at low opacity
    underline_y = y + th + 8
    draw.rectangle([x, underline_y, x + tw, underline_y + 2], fill=CHALK + (80,))

    img.save(output_path, 'PNG')
    return output_path


def render_text_overlay(text, output_path):
    """Centered text overlay (transparent bg, for compositing over broll).
    Inter body at 42pt. Text shadow for contrast on footage.
    Max 40 chars per line (Visual Bible rule)."""
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = load_font('body', 42)
    lines = text.replace('\\n', '\n').split('\n')

    total_h = 0
    line_dims = []
    for line in lines:
        lw, lh = text_bbox_size(draw, line.strip(), font)
        line_dims.append((lw, lh))
        total_h += lh + 16  # Generous line spacing (Visual Bible: 130-150%)

    y = (H - total_h) // 2
    for i, line in enumerate(lines):
        lw, lh = line_dims[i]
        x = center_x(lw)
        # Text shadow — soft, offset (from lighting.shadows.text)
        draw.text((x + 2, y + 3), line.strip(), font=font, fill=VOID + (140,))
        # Main text
        draw.text((x, y), line.strip(), font=font, fill=CHALK + (255,))
        y += lh + 16

    img.save(output_path, 'PNG')
    return output_path


def render_section_header(text, output_path):
    """Section header card. Obsidian bg (not void — subtle contrast).
    Outfit display at 56pt. Gold accent line above.
    The McQueen moment: one word, devastating."""
    img = Image.new('RGBA', (W, H), OBSIDIAN + (255,))
    draw = ImageDraw.Draw(img)

    font = load_font('display', 56)
    tw, th = text_bbox_size(draw, text, font)
    tx = center_x(tw)
    ty = (H - th) // 2

    # Title text — chalk
    draw.text((tx, ty), text, font=font, fill=CHALK + (240,))

    # Gold accent line above — thin, restrained
    line_w = min(tw, 400)
    draw.rectangle([center_x(line_w), ty - 24, center_x(line_w) + line_w, ty - 22], fill=GOLD + (130,))

    img = vignette(img, 0.30)
    img.save(output_path, 'PNG')
    return output_path


def render_quote(quote, attribution, output_path):
    """Quote card. Cormorant Garamond italic for the quote.
    Cosmic purple gradient bg (if numpy available), else void.
    Visual Bible: the whisper is louder than the shout."""
    img = Image.new('RGBA', (W, H), VOID + (255,))

    # Attempt gradient background
    try:
        import numpy as np
        arr = np.array(img, dtype=np.float32)
        # Cosmic purple gradient: #0D0221 → #260041
        top = np.array([13, 2, 33, 255], dtype=np.float32)
        bot = np.array([38, 0, 65, 255], dtype=np.float32)
        for y in range(H):
            t = y / H
            arr[y, :] = top * (1 - t) + bot * t
        img = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    except ImportError:
        pass

    draw = ImageDraw.Draw(img)

    # Quote mark — massive, ghostly
    mark_font = load_font('accent', 200)
    draw.text((W * 0.1, H * 0.15), '\u201C', font=mark_font, fill=CHALK + (25,))

    # Quote text — Cormorant Garamond, whisper weight
    quote_font = load_font('accent_light', 40)
    # Word-wrap at ~55 chars
    words = quote.split()
    lines = []
    current = ''
    for w in words:
        test = (current + ' ' + w).strip()
        if len(test) > 55:
            lines.append(current)
            current = w
        else:
            current = test
    if current:
        lines.append(current)

    total_h = 0
    line_dims = []
    for line in lines:
        lw, lh = text_bbox_size(draw, line, quote_font)
        line_dims.append((lw, lh))
        total_h += lh + 12

    y = int(H * 0.38) - total_h // 2
    for i, line in enumerate(lines):
        lw, lh = line_dims[i]
        x = center_x(lw)
        draw.text((x, y), line, font=quote_font, fill=CHALK + (230,))
        y += lh + 12

    # Attribution — Inter, smoke, smaller
    if attribution:
        attr_font = load_font('body', 20)
        aw, ah = text_bbox_size(draw, f'— {attribution}', attr_font)
        draw.text((center_x(aw), int(H * 0.62)), f'— {attribution}', font=attr_font, fill=SMOKE + (200,))

    img = vignette(img, 0.45)
    img.save(output_path, 'PNG')
    return output_path


def render_chapter(number, title, output_path):
    """Chapter card. Overline number + display title.
    Visual Bible pattern: overline (14pt uppercase) + section title (48pt)."""
    img = Image.new('RGBA', (W, H), VOID + (255,))
    draw = ImageDraw.Draw(img)

    # Chapter number — overline style (uppercase, tracked)
    num_font = load_font('body', 16)
    num_text = number.upper()
    nw, nh = text_bbox_size(draw, num_text, num_font)
    draw.text((center_x(nw), int(H * 0.38)), num_text, font=num_font, fill=SMOKE + (180,))

    # Title — Outfit display
    title_font = load_font('display', 48)
    tw, th = text_bbox_size(draw, title, title_font)
    draw.text((center_x(tw), int(H * 0.46)), title, font=title_font, fill=CHALK + (250,))

    img = vignette(img, 0.30)
    img.save(output_path, 'PNG')
    return output_path


# ═══════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════

RENDERERS = {
    'title': lambda args: render_title(
        args[0], args[1] if len(args) > 2 else '', args[-1]),
    'lower-third': lambda args: render_lower_third(args[0], args[1]),
    'text-overlay': lambda args: render_text_overlay(args[0], args[1]),
    'section-header': lambda args: render_section_header(args[0], args[1]),
    'quote': lambda args: render_quote(
        args[0], args[1] if len(args) > 2 else '', args[-1]),
    'chapter': lambda args: render_chapter(args[0], args[1], args[2]),
}

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Like One Studio — Graphics Engine V3")
        print("Usage: graphics-engine.py <type> <text> [subtitle/attr] <output.png>")
        print(f"Types: {', '.join(RENDERERS.keys())}")
        sys.exit(1)

    gtype = sys.argv[1]
    if gtype not in RENDERERS:
        print(f"Unknown type: {gtype}. Available: {', '.join(RENDERERS.keys())}")
        sys.exit(1)

    RENDERERS[gtype](sys.argv[2:])
    print(f"\u2705 {gtype} \u2192 {sys.argv[-1]}")
