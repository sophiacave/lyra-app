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

# ── Load Cinema Design System (single source of truth) ──
CINEMA_JSON = ROOT / "src" / "lib" / "design-system-cinema.json"
with open(CINEMA_JSON) as f:
    DS = json.load(f)

# ── Colors (from design-system-cinema.json) ──
def _build_colors():
    """Build flat color dict from cinema JSON color groups."""
    c = {}
    for group in ("foundations", "semantic", "accents"):
        for name, val in DS["colors"][group].items():
            c[name] = tuple(val["rgb"])
    return c

COLORS = _build_colors()

# ── Course accent colors (resolved from courseThemes → semantic/accent names) ──
def _build_course_accents():
    ca = {}
    for course, theme in DS["courseThemes"].items():
        accent_name = theme["accent"]
        ca[course] = COLORS.get(accent_name, COLORS["process"])
    return ca

COURSE_ACCENTS = _build_course_accents()

# ── Beat → accent mapping (from beats section) ──
BEAT_ACCENTS = {beat: info["accent"] for beat, info in DS["beats"].items()}

# ── Typography scale ──
TYPE = DS["typography"]["scale"]

# ── Grid & Layout ──
GRID = DS["grid"]
MARGINS = GRID["margins"]

# ── Cinema grade ──
CINEMA = DS["cinemaGrade"]

# ── Depth / Glow ──
GLOW = DS["depth"]["glow"]

# ── Video dimensions ──
W = DS["video"]["width"]
H = DS["video"]["height"]

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
    Typography: display scale (72pt/700) for title, body scale (22pt) for subtitle.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]
    bg_top = theme_bg[0] if theme_bg else COLORS["void"]
    bg_bot = theme_bg[1] if theme_bg else COLORS["obsidian"]

    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, CINEMA["vignette"]["titleCard"])
    img = noise_overlay(img, CINEMA["grainAmount"])
    draw = ImageDraw.Draw(img)

    # Title — display scale, centered
    t_display = TYPE["display"]
    t_body = TYPE["body"]
    f_title = font(t_display["size"])
    f_sub = font(t_body["size"])

    max_text_w = W - MARGINS["content"] * 2
    lines = wrap_text(title, f_title, max_text_w)
    line_gap = int(t_display["size"] * (t_display["leading"] - 1.0))
    total_h = sum(f_title.getbbox(l)[3] - f_title.getbbox(l)[1] + line_gap for l in lines)
    y = (H - total_h) // 2 - 40

    for line in lines:
        bbox = f_title.getbbox(line)
        lw = bbox[2] - bbox[0]
        x = (W - lw) // 2
        draw.text((x, y), line, fill=COLORS["chalk"], font=f_title)
        y += bbox[3] - bbox[1] + line_gap

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
    glow_cfg = GLOW["titleCard"]
    img = glow_circle(img, (W // 2, H // 2 - 30), glow_cfg["radius"], accent_rgb, glow_cfg["opacity"])

    return img.convert("RGB")


def render_lower_third(name, role="", accent_rgb=None):
    """
    Lower-third name card — transparent PNG overlay.
    Apple-style glass: subtle blur backing, thin border, restrained type.
    Typography: headline scale (28pt/600) for name, callout scale (18pt/500) for role.
    Returns RGBA image (overlay onto video frame).
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Glass backing rectangle — bottom-left, design system margins
    margin_left = MARGINS["outer"]
    margin_bottom = MARGINS["inner"] + 20
    pad_x, pad_y = 32, 20
    f_name = font(TYPE["headline"]["size"])
    f_role = font(TYPE["callout"]["size"])

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
    Typography mapped to design system scale per style.
    Returns RGBA image.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["chalk"]

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if style == "kinetic_reveal":
        # Big words stacked — title1 scale (56pt/600)
        t = TYPE["title1"]
        f_big = font(t["size"])
        line_h = int(t["size"] * t["leading"])
        parts = [p.strip() for p in text.replace("→", "\n").replace("->", "\n").split("\n") if p.strip()]
        total_h = len(parts) * line_h
        y = (H - total_h) // 2

        for i, part in enumerate(parts):
            bbox = f_big.getbbox(part)
            pw = bbox[2] - bbox[0]
            x = (W - pw) // 2
            color = accent_rgb if i % 2 == 0 else COLORS["chalk"]
            draw.text((x, y), part, fill=rgb_alpha(color, 0.9), font=f_big)
            y += line_h

    elif style == "quote":
        # Quote — title3 scale (34pt/600)
        t = TYPE["title3"]
        f_quote = font(t["size"])
        line_h = int(t["size"] * t["leading"])
        max_w = W - MARGINS["content"] * 2 - 100
        lines = wrap_text(f'"\u200b{text}"', f_quote, max_w)
        total_h = len(lines) * line_h
        y = (H - total_h) // 2

        # Subtle quote mark
        f_mark = font(120)
        draw.text((MARGINS["content"], y - 80), "\u201C", fill=rgb_alpha(accent_rgb, 0.15), font=f_mark)

        for line in lines:
            bbox = f_quote.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["chalk"], 0.9), font=f_quote)
            y += line_h

    elif style == "stat":
        # Large stat — hero scale (96pt/700) + body label (22pt/400)
        f_stat = font(TYPE["hero"]["size"])
        f_label = font(TYPE["body"]["size"])
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
        # Default: centered text block — title3 scale (34pt/600)
        t = TYPE["title3"]
        f_text = font(t["size"])
        line_h = int(t["size"] * t["leading"])
        max_w = W - MARGINS["content"] * 2
        lines = wrap_text(text, f_text, max_w)
        total_h = len(lines) * line_h
        y = (H - total_h) // 2

        for line in lines:
            bbox = f_text.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["chalk"], 0.85), font=f_text)
            y += line_h

    return img


def render_section_header(label, beat="core", accent_rgb=None):
    """
    Section header — full-frame with overline label.
    Typography: overline scale (13pt/600, +2.0 tracking).
    Used for beat transitions (e.g., "CORE CONCEPT", "THE REVEAL").
    """
    if accent_rgb is None:
        accent_rgb = COLORS.get(BEAT_ACCENTS.get(beat, "process"), COLORS["process"])

    bg_top = COLORS["void"]
    bg_bot = COLORS["obsidian"]
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, CINEMA["vignette"]["sectionHeader"])
    img = noise_overlay(img, CINEMA["grainAmount"] - 1)
    draw = ImageDraw.Draw(img)

    # Overline (small caps, tracked) — overline scale from design system
    f_over = font(TYPE["overline"]["size"])
    overline = label.upper()
    over_bbox = f_over.getbbox(overline)
    ow = over_bbox[2] - over_bbox[0]
    draw.text(((W - ow) // 2, H // 2 - 30), overline, fill=accent_rgb, font=f_over)

    # Accent line below overline
    line_y = H // 2 + 2
    accent_line(draw, line_y, accent_rgb, (W - 60) // 2, (W + 60) // 2, 2)

    # Soft glow
    glow_cfg = GLOW["sectionHeader"]
    img = glow_circle(img, (W // 2, H // 2), glow_cfg["radius"], accent_rgb, glow_cfg["opacity"])

    return img.convert("RGB")


def render_diagram_placeholder(scene, accent_rgb=None):
    """
    Diagram placeholder — structured background for scenes with type='diagram'.
    Typography: overline (13pt) for label, callout (18pt) for description.
    Grid: uses composition margins + corner marks at content boundary.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["process"]

    bg_top = COLORS["void"]
    bg_bot = (15, 13, 22)  # slightly lighter than obsidian
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, CINEMA["vignette"]["diagram"])
    draw = ImageDraw.Draw(img)

    # Grid dots (subtle structure hint) — spaced at 5xl (128px) intervals
    grid_step = DS["spacing"]["3xl"]  # 64px for tighter grid
    dot_color = rgb_alpha(COLORS["ash"], 0.3)
    for gx in range(0, W, grid_step):
        for gy in range(0, H, grid_step):
            draw.ellipse([gx - 1, gy - 1, gx + 1, gy + 1], fill=dot_color)

    # Scene ID label — top left, at outer margin
    f_label = font(TYPE["overline"]["size"])
    scene_id = scene.get("id", "diagram")
    draw.text((MARGINS["outer"], 60), scene_id.upper(), fill=COLORS["smoke"], font=f_label)
    accent_line(draw, 82, accent_rgb, MARGINS["outer"], MARGINS["outer"] + len(scene_id) * 9, 2)

    # Diagram description (motion_graphic field) — centered, wrapped
    motion_desc = scene.get("motion_graphic", scene.get("visual", ""))
    if motion_desc:
        f_desc = font(TYPE["callout"]["size"])
        line_h = int(TYPE["callout"]["size"] * TYPE["callout"]["leading"])
        max_w = W - MARGINS["content"] * 2
        lines = wrap_text(motion_desc, f_desc, max_w)
        lines = lines[:4]
        if len(lines) == 4:
            lines[-1] = lines[-1][:60] + "..."
        total_h = len(lines) * line_h
        y = H // 2 - total_h // 2

        for line in lines:
            bbox = f_desc.getbbox(line)
            lw = bbox[2] - bbox[0]
            draw.text(((W - lw) // 2, y), line, fill=rgb_alpha(COLORS["smoke"], 0.6), font=f_desc)
            y += line_h

    # Corner marks at content boundary (compositional grid hints)
    mark_color = rgb_alpha(accent_rgb, 0.15)
    mark_len = 30
    cm = MARGINS["content"]
    corners = [(cm, cm), (W - cm, cm), (cm, H - cm), (W - cm, H - cm)]
    for cx, cy in corners:
        draw.line([(cx - mark_len, cy), (cx + mark_len, cy)], fill=mark_color, width=1)
        draw.line([(cx, cy - mark_len), (cx, cy + mark_len)], fill=mark_color, width=1)

    img = noise_overlay(img, CINEMA["grainAmount"] - 1)

    # Soft central glow
    glow_cfg = GLOW["diagram"]
    img = glow_circle(img, (W // 2, H // 2), glow_cfg["radius"], accent_rgb, glow_cfg["opacity"])

    return img.convert("RGB")


def render_outro_card(title, next_lesson="", brand="likeone.ai", accent_rgb=None):
    """
    Outro card — warm dissolve-ready.
    Typography: caption (15pt) for "NEXT", title2 (44pt) for lesson name, callout (18pt) for brand.
    """
    if accent_rgb is None:
        accent_rgb = COLORS["gold"]

    bg_top = COLORS["void"]
    bg_bot = COLORS["obsidian"]
    img = gradient_bg(bg_top, bg_bot)
    img = vignette(img, CINEMA["vignette"]["titleCard"])
    img = noise_overlay(img, CINEMA["grainAmount"])
    draw = ImageDraw.Draw(img)

    y_center = H // 2

    if next_lesson:
        # "Next:" — caption scale for overline
        f_over = font(TYPE["caption"]["size"])
        f_next = font(TYPE["title2"]["size"])
        f_brand = font(TYPE["callout"]["size"])

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
        # Just brand — headline scale
        f_brand = font(TYPE["headline"]["size"])
        bbox_b = f_brand.getbbox(brand)
        bw = bbox_b[2] - bbox_b[0]
        draw.text(((W - bw) // 2, y_center), brand, fill=COLORS["smoke"], font=f_brand)

    glow_cfg = GLOW["titleCard"]
    img = glow_circle(img, (W // 2, H // 2), 250, accent_rgb, glow_cfg["opacity"])

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
    """Get background gradient for course theme from cinema design system."""
    if color_theme and color_theme in DS["courseThemes"]:
        grad = DS["courseThemes"][color_theme]["gradient"]
        return (hex_to_rgb(grad[0]), hex_to_rgb(grad[1]))
    return (COLORS["void"], COLORS["obsidian"])


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
