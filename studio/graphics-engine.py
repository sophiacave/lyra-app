#!/usr/bin/env python3
"""
Like One Studio — Graphics Engine
Pillow + NumPy renderer for title cards, lower thirds, text overlays,
section headers, and diagram placeholders.

Visual Bible V2: McQueen x Rothko x Apple
Uses design-tokens.js color palette; renders 1920x1080 PNGs at 30fps-ready quality.

Usage:
    python3 studio/graphics-engine.py <screenplay.json> [--scene <scene_id>]
    python3 studio/graphics-engine.py <screenplay.json> --all

Outputs PNG sequences to output/graphics/<slug>_<scene_id>.png
"""

import json
import math
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── Paths ──
STUDIO = Path(__file__).parent
ROOT = STUDIO.parent
OUTPUT = ROOT / "output"
GFX_DIR = OUTPUT / "graphics"
GFX_DIR.mkdir(parents=True, exist_ok=True)

# ── Visual Bible V2 Palette (from design-tokens.js) ──
COLORS = {
    "void":     (11,  10,  16),    # #0B0A10 — deep aubergine-black
    "chalk":    (240, 235, 227),   # #F0EBE3 — bone white
    "smoke":    (138, 132, 144),   # #8A8490 — mauve gray
    "ash":      (45,  42,  51),    # #2D2A33 — warm charcoal
    "signal":   (212, 149, 107),   # #D4956B — terracotta (input/data)
    "process":  (139, 175, 196),   # #8BAFC4 — dusty blue (process)
    "result":   (140, 184, 158),   # #8CB89E — sage (output/growth)
    "alert":    (196,  97, 106),   # #C4616A — muted rose
    "insight":  (184, 152, 200),   # #B898C8 — wisteria (aha)
    "bone":     (232, 221, 208),   # #E8DDD0
    "obsidian": (26,  23,  32),    # #1A1720
    "blush":    (212, 160, 160),   # #D4A0A0
    "gold":     (196, 168, 108),   # #C4A86C
}

# Course accent colors (from design-tokens.js courseThemes)
COURSE_ACCENTS = {
    "ai-foundations":   (139, 175, 196),   # process blue
    "how-ai-works":     (184, 152, 200),   # insight purple
    "rag-vectors":      (155, 136, 184),   # depth purple
    "prompt-craft":     (212, 149, 107),   # signal terracotta
    "prompt-writing":   (212, 149, 107),   # alias for prompt-craft
    "ethics-safety":    (140, 184, 158),   # result sage
    "creatives":        (212, 160, 160),   # blush rose
    "business":         (196, 168, 108),   # gold
    "claude-beginners": (184, 152, 200),   # insight purple
}

# Beat → accent mapping for scene-specific accents
BEAT_ACCENTS = {
    "hook":    "signal",
    "setup":   "process",
    "core":    "process",
    "breathe": "insight",
    "deepen":  "process",
    "peak":    "gold",
    "close":   "insight",
}

W, H = 1920, 1080

# ── Font Loading ──
FONT_PATH = "/System/Library/Fonts/SFNS.ttf"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"
FONT_FALLBACK = "/System/Library/Fonts/HelveticaNeue.ttc"

def font(size, mono=False):
    """Load SF Pro (SFNS) at given size, with fallback."""
    primary = FONT_MONO if mono else FONT_PATH
    try:
        return ImageFont.truetype(primary, size)
    except Exception:
        try:
            return ImageFont.truetype(FONT_FALLBACK, size)
        except Exception:
            return ImageFont.load_default()


# ── Utility ──

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_alpha(rgb, alpha):
    """Return RGBA tuple."""
    return (*rgb, int(alpha * 255))

def vignette(img, intensity=0.4):
    """Apply a radial vignette (numpy). Preserves RGB or RGBA."""
    arr = np.array(img, dtype=np.float64)
    rows, cols = arr.shape[:2]
    cy, cx = rows / 2, cols / 2
    max_dist = math.sqrt(cx**2 + cy**2)
    Y, X = np.ogrid[:rows, :cols]
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2) / max_dist
    mask = 1.0 - intensity * (dist ** 1.8)
    mask = np.clip(mask, 0, 1)
    if arr.ndim == 3:
        channels = min(arr.shape[2], 3)
        arr[:, :, :channels] *= mask[:, :, np.newaxis]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def gradient_bg(color_top, color_bottom, w=W, h=H):
    """Create a vertical linear gradient background."""
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for i in range(3):
        arr[:, :, i] = np.linspace(color_top[i], color_bottom[i], h, dtype=np.uint8)[:, np.newaxis]
    return Image.fromarray(arr)

def noise_overlay(img, amount=6):
    """Add subtle film grain noise."""
    arr = np.array(img, dtype=np.int16)
    noise = np.random.normal(0, amount, arr.shape[:2]).astype(np.int16)
    channels = min(arr.shape[2], 3) if arr.ndim == 3 else 1
    if arr.ndim == 3:
        arr[:, :, :channels] += noise[:, :, np.newaxis]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def accent_line(draw, y, accent_rgb, x_start=120, x_end=400, thickness=3):
    """Draw a thin accent line (McQueen detail)."""
    draw.line([(x_start, y), (x_end, y)], fill=accent_rgb, width=thickness)

def glow_circle(img, center, radius, color, opacity=0.15):
    """Draw a soft glow circle (Rothko field effect)."""
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse(
        [center[0] - radius, center[1] - radius,
         center[0] + radius, center[1] + radius],
        fill=rgb_alpha(color, opacity)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=radius // 2))
    return Image.alpha_composite(img.convert("RGBA"), glow)

def wrap_text(text, f, max_width):
    """Word-wrap text to fit within max_width pixels."""
    words = text.split()
    lines = []
    current = []
    for word in words:
        test = " ".join(current + [word])
        bbox = f.getbbox(test)
        if bbox and (bbox[2] - bbox[0]) > max_width and current:
            lines.append(" ".join(current))
            current = [word]
        else:
            current.append(word)
    if current:
        lines.append(" ".join(current))
    return lines


# ══════════════════════════════════════════════════════
# RENDERERS — One function per graphic type
# ══════════════════════════════════════════════════════

def render_title_card(title, subtitle="", accent_rgb=None, theme_bg=None):
    """
    Opening/closing title card.
    McQueen: devastating simplicity. One title. One accent line. Void.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]
    bg_top = theme_bg[0] if theme_bg else COLORS["void"]
    bg_bot = theme_bg[1] if theme_bg else COLORS["obsidian"]

    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, 0.5)
    img = noise_overlay(img, 4)
    draw = ImageDraw.Draw(img)

    # Title — centered, large
    f_title = font(72)
    f_sub = font(24)

    lines = wrap_text(title, f_title, W - 400)
    total_h = sum(f_title.getbbox(l)[3] - f_title.getbbox(l)[1] + 16 for l in lines)
    y = (H - total_h) // 2 - 40

    for line in lines:
        bbox = f_title.getbbox(line)
        lw = bbox[2] - bbox[0]
        x = (W - lw) // 2
        draw.text((x, y), line, fill=COLORS["chalk"], font=f_title)
        y += bbox[3] - bbox[1] + 16

    # Accent line below title
    line_y = y + 20
    line_w = min(280, W // 4)
    accent_line(draw, line_y, accent_rgb, (W - line_w) // 2, (W + line_w) // 2, 3)

    # Subtitle
    if subtitle:
        sub_bbox = f_sub.getbbox(subtitle)
        sw = sub_bbox[2] - sub_bbox[0]
        draw.text(((W - sw) // 2, line_y + 30), subtitle, fill=COLORS["smoke"], font=f_sub)

    # Soft glow behind title (Rothko warmth)
    img = glow_circle(img, (W // 2, H // 2 - 30), 300, accent_rgb, 0.06)

    return img.convert("RGB")


def render_lower_third(name, role="", accent_rgb=None):
    """
    Lower-third name card — transparent PNG overlay.
    Apple-style glass: subtle blur backing, thin border, restrained type.
    Returns RGBA image (overlay onto video frame).
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Glass backing rectangle — bottom-left, with generous margin
    margin_left = 120
    margin_bottom = 100
    pad_x, pad_y = 32, 20
    f_name = font(28)
    f_role = font(18)

    name_bbox = f_name.getbbox(name)
    name_w = name_bbox[2] - name_bbox[0]
    name_h = name_bbox[3] - name_bbox[1]

    role_w = 0
    role_h = 0
    if role:
        role_bbox = f_role.getbbox(role)
        role_w = role_bbox[2] - role_bbox[0]
        role_h = role_bbox[3] - role_bbox[1]

    card_w = max(name_w, role_w) + pad_x * 2
    card_h = name_h + (role_h + 8 if role else 0) + pad_y * 2
    card_x = margin_left
    card_y = H - margin_bottom - card_h

    # Glass background
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=12,
        fill=(11, 10, 16, 180),
        outline=rgb_alpha(accent_rgb, 0.2),
        width=1
    )

    # Accent bar on left edge
    draw.rectangle(
        [card_x, card_y + 8, card_x + 3, card_y + card_h - 8],
        fill=rgb_alpha(accent_rgb, 0.8)
    )

    # Name text
    text_x = card_x + pad_x + 8
    text_y = card_y + pad_y
    draw.text((text_x, text_y), name, fill=COLORS["chalk"], font=f_name)

    # Role text
    if role:
        draw.text((text_x, text_y + name_h + 6), role, fill=COLORS["smoke"], font=f_role)

    return img


def render_text_overlay(text, style="default", accent_rgb=None):
    """
    Text overlay — transparent PNG for compositing.
    Styles: 'default', 'kinetic_reveal', 'quote', 'stat'.
    Returns RGBA image.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["chalk"]

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if style == "kinetic_reveal":
        # Big words stacked vertically — one per line, centered
        f_big = font(56)
        parts = [p.strip() for p in text.replace("→", "\n").replace("->", "\n").split("\n") if p.strip()]
        total_h = len(parts) * 80
        y = (H - total_h) // 2

        for i, part in enumerate(parts):
            bbox = f_big.getbbox(part)
            pw = bbox[2] - bbox[0]
            x = (W - pw) // 2
            # Alternating accent colors
            color = accent_rgb if i % 2 == 0 else COLORS["chalk"]
            draw.text((x, y), part, fill=rgb_alpha(color, 0.9), font=f_big)
            y += 80

    elif style == "quote":
        f_quote = font(36)
        lines = wrap_text(f'"{text}"', f_quote, W - 500)
        total_h = len(lines) * 52
        y = (H - total_h) // 2

        # Subtle quote mark
        f_mark = font(120)
        draw.text((200, y - 80), "\u201C", fill=rgb_alpha(accent_rgb, 0.15), font=f_mark)

        for line in lines:
            bbox = f_quote.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["chalk"], 0.9), font=f_quote)
            y += 52

    elif style == "stat":
        # Large number/stat centered
        f_stat = font(96)
        f_label = font(22)
        parts = text.split("|") if "|" in text else [text, ""]
        stat_text = parts[0].strip()
        label_text = parts[1].strip() if len(parts) > 1 else ""

        bbox = f_stat.getbbox(stat_text)
        sw = bbox[2] - bbox[0]
        draw.text(((W - sw) // 2, H // 2 - 60), stat_text, fill=accent_rgb + (230,), font=f_stat)

        if label_text:
            lbbox = f_label.getbbox(label_text)
            lw = lbbox[2] - lbbox[0]
            draw.text(((W - lw) // 2, H // 2 + 50), label_text, fill=COLORS["smoke"] + (200,), font=f_label)

    else:
        # Default: centered text block
        f_text = font(34)
        lines = wrap_text(text, f_text, W - 400)
        total_h = len(lines) * 48
        y = (H - total_h) // 2

        for line in lines:
            bbox = f_text.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["chalk"], 0.85), font=f_text)
            y += 48

    return img


def render_section_header(label, beat="core", accent_rgb=None):
    """
    Section header — full-frame with overline label.
    Used for beat transitions (e.g., "CORE CONCEPT", "THE REVEAL").
    """
    if accent_rgb is None:
        accent_rgb = COLORS.get(BEAT_ACCENTS.get(beat, "process"), COLORS["process"])

    bg_top = COLORS["void"]
    bg_bot = COLORS["obsidian"]
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, 0.45)
    img = noise_overlay(img, 3)
    draw = ImageDraw.Draw(img)

    # Overline (small caps, tracked)
    f_over = font(13)
    overline = label.upper()
    over_bbox = f_over.getbbox(overline)
    ow = over_bbox[2] - over_bbox[0]
    draw.text(((W - ow) // 2, H // 2 - 30), overline, fill=accent_rgb, font=f_over)

    # Accent line below overline
    line_y = H // 2 + 2
    accent_line(draw, line_y, accent_rgb, (W - 60) // 2, (W + 60) // 2, 2)

    # Soft glow
    img = glow_circle(img, (W // 2, H // 2), 200, accent_rgb, 0.05)

    return img.convert("RGB")


def render_diagram_placeholder(scene, accent_rgb=None):
    """
    Diagram placeholder — structured background for scenes with type='diagram'.
    Shows the scene description with a clean layout, ready for manim/Remotion overlay.
    Not a final diagram — a production-quality backdrop.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]

    bg_top = COLORS["void"]
    bg_bot = (15, 13, 22)  # slightly lighter than obsidian
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, 0.35)
    draw = ImageDraw.Draw(img)

    # Grid dots (subtle structure hint)
    dot_color = rgb_alpha(COLORS["ash"], 0.3)
    for gx in range(0, W, 80):
        for gy in range(0, H, 80):
            draw.ellipse([gx - 1, gy - 1, gx + 1, gy + 1], fill=dot_color)

    # Scene ID label — top left
    f_label = font(13)
    scene_id = scene.get("id", "diagram")
    draw.text((120, 60), scene_id.upper(), fill=COLORS["smoke"], font=f_label)
    accent_line(draw, 82, accent_rgb, 120, 120 + len(scene_id) * 9, 2)

    # Diagram description (motion_graphic field) — centered, wrapped
    motion_desc = scene.get("motion_graphic", scene.get("visual", ""))
    if motion_desc:
        f_desc = font(18)
        lines = wrap_text(motion_desc, f_desc, W - 400)
        # Show first 4 lines max (preview, not full spec)
        lines = lines[:4]
        if len(lines) == 4:
            lines[-1] = lines[-1][:60] + "..."
        total_h = len(lines) * 30
        y = H // 2 - total_h // 2

        for line in lines:
            bbox = f_desc.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["smoke"], 0.6), font=f_desc)
            y += 30

    # Corner marks (compositional grid hints)
    mark_color = rgb_alpha(accent_rgb, 0.15)
    mark_len = 30
    corners = [(200, 200), (W - 200, 200), (200, H - 200), (W - 200, H - 200)]
    for cx, cy in corners:
        draw.line([(cx - mark_len, cy), (cx + mark_len, cy)], fill=mark_color, width=1)
        draw.line([(cx, cy - mark_len), (cx, cy + mark_len)], fill=mark_color, width=1)

    img = noise_overlay(img, 3)

    # Soft central glow
    img = glow_circle(img, (W // 2, H // 2), 350, accent_rgb, 0.04)

    return img.convert("RGB")


def render_outro_card(title, next_lesson="", brand="likeone.ai", accent_rgb=None):
    """
    Outro card — warm dissolve-ready.
    Shows next lesson prompt + brand.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["gold"]

    bg_top = COLORS["void"]
    bg_bot = COLORS["obsidian"]
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, 0.5)
    img = noise_overlay(img, 4)
    draw = ImageDraw.Draw(img)

    y_center = H // 2

    if next_lesson:
        # "Next:" overline
        f_over = font(15)
        f_next = font(44)
        f_brand = font(18)

        draw.text(((W - f_over.getbbox("NEXT")[2]) // 2, y_center - 60),
                   "NEXT", fill=COLORS["smoke"], font=f_over)

        accent_line(draw, y_center - 38, accent_rgb, (W - 50) // 2, (W + 50) // 2, 2)

        bbox = f_next.getbbox(next_lesson)
        nw = bbox[2] - bbox[0]
        draw.text(((W - nw) // 2, y_center - 20), next_lesson, fill=COLORS["chalk"], font=f_next)

        # Brand
        bbox_b = f_brand.getbbox(brand)
        bw = bbox_b[2] - bbox_b[0]
        draw.text(((W - bw) // 2, y_center + 50), brand, fill=COLORS["smoke"], font=f_brand)
    else:
        # Just brand
        f_brand = font(28)
        bbox_b = f_brand.getbbox(brand)
        bw = bbox_b[2] - bbox_b[0]
        draw.text(((W - bw) // 2, y_center), brand, fill=COLORS["smoke"], font=f_brand)

    img = glow_circle(img, (W // 2, H // 2), 250, accent_rgb, 0.06)

    return img.convert("RGB")


# ══════════════════════════════════════════════════════
# SCREENPLAY PROCESSOR — Generates all graphics for a screenplay
# ══════════════════════════════════════════════════════

def get_accent_for_scene(scene, color_theme=None):
    """Determine accent color for a scene based on beat and theme."""
    if color_theme and color_theme in COURSE_ACCENTS:
        return COURSE_ACCENTS[color_theme]
    beat = scene.get("beat", "core")
    color_name = BEAT_ACCENTS.get(beat, "process")
    return COLORS.get(color_name, COLORS["process"])

def get_theme_gradient(color_theme=None):
    """Get background gradient for course theme."""
    theme_grads = {
        "ai-foundations":   ((11, 10, 16), (26, 37, 53)),
        "how-ai-works":     ((11, 10, 16), (26, 21, 37)),
        "rag-vectors":      ((11, 10, 16), (26, 24, 40)),
        "prompt-craft":     ((11, 10, 16), (26, 21, 16)),
        "prompt-writing":   ((11, 10, 16), (26, 21, 16)),
        "ethics-safety":    ((11, 10, 16), (16, 26, 21)),
        "creatives":        ((11, 10, 16), (26, 16, 21)),
        "business":         ((11, 10, 16), (26, 24, 16)),
        "claude-beginners": ((11, 10, 16), (26, 21, 37)),
    }
    return theme_grads.get(color_theme, (COLORS["void"], COLORS["obsidian"]))


def process_screenplay(sp_path, scene_filter=None):
    """Generate all graphics for a screenplay."""
    sp = json.loads(Path(sp_path).read_text())
    title = sp.get("title", "Untitled")
    slug = title.lower().replace(" ", "-").replace("?", "")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    color_theme = sp.get("colorTheme", "ai-foundations")
    theme_grad = get_theme_gradient(color_theme)
    generated = []

    print(f"\n🎨 GRAPHICS ENGINE — {title}")
    print(f"   Theme: {color_theme} | Scenes: {len(sp['scenes'])}\n")

    for scene in sp["scenes"]:
        sid = scene["id"]
        if scene_filter and sid != scene_filter:
            continue

        accent = get_accent_for_scene(scene, color_theme)
        out_path = GFX_DIR / f"{slug}_{sid}.png"
        stype = scene.get("type", "broll")

        if stype == "title":
            # Title/outro scene
            motion = scene.get("motion_graphic", "")
            if "next" in motion.lower() or "outro" in sid.lower():
                # Extract next lesson hint
                next_hint = ""
                if "Next:" in motion:
                    next_hint = motion.split("Next:")[1].split("'")[0].strip()
                elif "'Next:" in motion:
                    parts = motion.split("'")
                    for i, p in enumerate(parts):
                        if "Next" in p and i + 1 < len(parts):
                            next_hint = parts[i + 1]
                            break
                if not next_hint:
                    next_hint = "How Neurons Learn"  # fallback
                img = render_outro_card(title, next_hint, "likeone.ai", accent)
            else:
                img = render_title_card(title, "", accent, theme_grad)
            img.save(str(out_path), "PNG")
            generated.append(str(out_path))
            print(f"  ✅ {sid}: title card → {out_path.name}")

        elif stype == "diagram":
            # Diagram placeholder
            img = render_diagram_placeholder(scene, accent)
            img.save(str(out_path), "PNG")
            generated.append(str(out_path))
            print(f"  ✅ {sid}: diagram placeholder → {out_path.name}")

        elif scene.get("text_overlay"):
            # Scene with text overlay
            overlay = scene["text_overlay"]
            text = overlay.get("text", "")
            style = overlay.get("style", "default")
            img = render_text_overlay(text, style, accent)
            overlay_path = GFX_DIR / f"{slug}_{sid}_overlay.png"
            img.save(str(overlay_path), "PNG")
            generated.append(str(overlay_path))
            print(f"  ✅ {sid}: text overlay ({style}) → {overlay_path.name}")

        else:
            # B-roll and presenter scenes don't need generated graphics
            # (they use real video or Ken Burns on photos)
            pass

    # Always generate a title card for the opening
    title_path = GFX_DIR / f"{slug}_title.png"
    if not title_path.exists() or not scene_filter:
        img = render_title_card(title, "", get_accent_for_scene(sp["scenes"][0], color_theme), theme_grad)
        img.save(str(title_path), "PNG")
        generated.append(str(title_path))
        print(f"  ✅ title: opening card → {title_path.name}")

    # Generate lower third for the persona
    persona = sp.get("persona", "faye")
    lt_path = GFX_DIR / f"{slug}_lower-third.png"
    if not lt_path.exists() or not scene_filter:
        persona_names = {"faye": ("Faye", "AI Educator")}
        name, role = persona_names.get(persona, (persona.title(), ""))
        img = render_lower_third(name, role, get_accent_for_scene(sp["scenes"][0], color_theme))
        img.save(str(lt_path), "PNG")
        generated.append(str(lt_path))
        print(f"  ✅ lower-third: {name} → {lt_path.name}")

    print(f"\n📦 Generated {len(generated)} graphics in {GFX_DIR}")
    return generated


# ── CLI ──
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 studio/graphics-engine.py <screenplay.json> [--scene <id>] [--all]")
        sys.exit(1)

    sp_path = sys.argv[1]
    scene_filter = None

    if "--scene" in sys.argv:
        idx = sys.argv.index("--scene")
        if idx + 1 < len(sys.argv):
            scene_filter = sys.argv[idx + 1]

    process_screenplay(sp_path, scene_filter)
