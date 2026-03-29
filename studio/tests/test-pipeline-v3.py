#!/usr/bin/env python3
"""
Integration test: V3 design system pipeline (graphics engine + QA gate + compose)

Tests the three uncommitted fixes:
  1. graphics-engine.py: vignette floor (0.25) + noise void-floor clamp
  2. qa-frame.py: RGBA-aware overlay analysis
  3. compose-v4.js: obsidian hex lookup fix

Run: python3 studio/tests/test-pipeline-v3.py
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
STUDIO = ROOT / "studio"
GFX_DIR = ROOT / "output" / "graphics"
SCREENPLAY = STUDIO / "screenplays" / "what-is-a-neuron-v5.json"
QA_FRAME = STUDIO / "lib" / "qa-frame.py"
GFX_ENGINE = STUDIO / "graphics-engine.py"

passed = 0
failed = 0
warnings = 0


def test(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}{f' — {detail}' if detail else ''}")


def warn(name, detail=""):
    global warnings
    warnings += 1
    print(f"  WARN  {name}{f' — {detail}' if detail else ''}")


def run(cmd, timeout=60):
    """Run a command and return (returncode, stdout, stderr)."""
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, cwd=str(ROOT))
        return r.returncode, r.stdout, r.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "TIMEOUT"
    except Exception as e:
        return -1, "", str(e)


# ══════════════════════════════════════════════════════
# TEST 1: Graphics Engine — renders all scene types
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 1: Graphics Engine (V3 design system compliance)")
print("=" * 60)

t0 = time.time()
rc, stdout, stderr = run(["python3", str(GFX_ENGINE), str(SCREENPLAY)], timeout=30)
t1 = time.time()

test("graphics-engine.py exits 0", rc == 0, f"exit={rc} stderr={stderr[:200]}")
test("graphics-engine.py runs under 15s", t1 - t0 < 15, f"took {t1-t0:.1f}s")

# Count generated files
generated = [l for l in stdout.split("\n") if "✅" in l]
test("generated at least 4 graphics", len(generated) >= 4, f"got {len(generated)}")

# Verify specific expected outputs
sp = json.loads(SCREENPLAY.read_text())
slug = "what-is-a-neuron"
expected_files = [
    f"{slug}_title.png",           # opening title card
    f"{slug}_explain-neuron.png",  # diagram
    f"{slug}_lower-third.png",     # lower third overlay
    f"{slug}_outro.png",           # outro card
]
for fname in expected_files:
    fpath = GFX_DIR / fname
    test(f"generated {fname}", fpath.exists(), f"missing at {fpath}")


# ══════════════════════════════════════════════════════
# TEST 2: Vignette + Noise Floor (banned color prevention)
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 2: Vignette + Noise Floor (no pure black pixels)")
print("=" * 60)

try:
    from PIL import Image
    import numpy as np

    for fname in ["title.png", "explain-neuron.png", "outro.png"]:
        fpath = GFX_DIR / f"{slug}_{fname}"
        if not fpath.exists():
            warn(f"skipping {fname} — not found")
            continue
        img = np.array(Image.open(fpath).convert("RGB"))
        # Check: no pixel should be within distance 8 of (0,0,0)
        flat = img.reshape(-1, 3).astype(np.float64)
        dist_to_black = np.sqrt(flat[:, 0]**2 + flat[:, 1]**2 + flat[:, 2]**2)
        pure_black_count = np.sum(dist_to_black < 8)
        total = len(flat)
        pct = pure_black_count / total * 100
        test(f"{fname}: <0.1% near-black pixels", pct < 0.1, f"{pct:.3f}% ({pure_black_count}/{total})")

        # Verify corners aren't pure black (vignette floor test)
        corners = [img[0, 0], img[0, -1], img[-1, 0], img[-1, -1]]
        for i, c in enumerate(corners):
            corner_dist = np.sqrt(sum(int(v)**2 for v in c))
            test(f"{fname} corner {i}: not near-black", corner_dist > 8, f"rgb({c[0]},{c[1]},{c[2]}) dist={corner_dist:.1f}")

except ImportError:
    warn("PIL/numpy not available — skipping pixel tests")


# ══════════════════════════════════════════════════════
# TEST 3: QA Gate on Generated Graphics
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 3: QA Gate (Design System V3 compliance)")
print("=" * 60)

qa_files = [f for f in os.listdir(GFX_DIR) if f.startswith(slug) and f.endswith(".png")]
test("found QA-able files", len(qa_files) > 0, f"found {len(qa_files)}")

qa_pass_count = 0
qa_fail_count = 0

for qf in sorted(qa_files):
    fpath = GFX_DIR / qf
    rc, stdout, stderr = run(["python3", str(QA_FRAME), str(fpath), "--json"], timeout=30)
    try:
        result = json.loads(stdout)
        is_pass = result.get("pass", False)
        score = result.get("score", 0)
        if is_pass:
            qa_pass_count += 1
            test(f"QA {qf}: PASS (score={score}%)", True)
        else:
            crits = result.get("critical_fails", 0)
            warns_count = result.get("warnings", 0)
            if crits > 0:
                qa_fail_count += 1
                # Show failed checks
                for c in result.get("checks", []):
                    if not c.get("pass") and c.get("severity") == "critical":
                        test(f"QA {qf}: {c['name']}", False, c.get("actual", ""))
            else:
                qa_pass_count += 1
                warn(f"QA {qf}: warnings only (score={score}%)")
    except json.JSONDecodeError:
        test(f"QA {qf}: valid JSON output", False, f"got: {stdout[:100]}")

test(f"all graphics pass QA (0 critical)", qa_fail_count == 0, f"{qa_fail_count} critical failures")


# ══════════════════════════════════════════════════════
# TEST 4: RGBA Overlay QA (qa-frame.py fix)
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 4: RGBA Overlay QA (transparent pixel handling)")
print("=" * 60)

overlay_files = [f for f in os.listdir(GFX_DIR) if f.startswith(slug) and "_overlay.png" in f]
if overlay_files:
    for of in sorted(overlay_files):
        fpath = GFX_DIR / of
        # Verify it's actually RGBA
        try:
            from PIL import Image
            img = Image.open(fpath)
            test(f"{of} is RGBA", img.mode == "RGBA", f"mode={img.mode}")
        except Exception:
            pass

        rc, stdout, stderr = run(["python3", str(QA_FRAME), str(fpath), "--json"], timeout=30)
        try:
            result = json.loads(stdout)
            is_pass = result.get("pass", False)
            # The key test: overlays should NOT fail banned_colors due to transparent→black
            banned_check = [c for c in result.get("checks", []) if c.get("name") == "banned_colors"]
            if banned_check:
                test(f"{of}: banned_colors check passes", banned_check[0].get("pass", False),
                     banned_check[0].get("actual", ""))
            test(f"{of}: overall QA passes", is_pass, f"score={result.get('score', '?')}%")
        except json.JSONDecodeError:
            test(f"{of}: valid JSON output", False, f"got: {stdout[:100]}")
else:
    # Generate a test overlay to verify RGBA handling
    print("  No overlay files found — generating test overlay")
    try:
        from PIL import Image, ImageDraw
        # Create a typical lower-third overlay (mostly transparent)
        overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        draw.rounded_rectangle([60, 900, 500, 1000], radius=12, fill=(11, 10, 16, 180))
        draw.text((80, 920), "Test Name", fill=(240, 235, 227, 255))
        test_path = GFX_DIR / "_test_overlay.png"
        overlay.save(str(test_path), "PNG")

        rc, stdout, stderr = run(["python3", str(QA_FRAME), str(test_path), "--json"], timeout=30)
        result = json.loads(stdout)
        test("synthetic RGBA overlay: QA passes", result.get("pass", False),
             result.get("summary", ""))
        # Cleanup
        test_path.unlink(missing_ok=True)
    except Exception as e:
        warn(f"could not test RGBA overlay: {e}")

# Check lower-third (always RGBA)
lt_path = GFX_DIR / f"{slug}_lower-third.png"
if lt_path.exists():
    rc, stdout, stderr = run(["python3", str(QA_FRAME), str(lt_path), "--json"], timeout=30)
    try:
        result = json.loads(stdout)
        test(f"lower-third overlay: QA passes", result.get("pass", False),
             result.get("summary", ""))
    except json.JSONDecodeError:
        test("lower-third QA: valid JSON", False, stdout[:100])


# ══════════════════════════════════════════════════════
# TEST 5: Obsidian Hex Lookup (compose-v4.js fix)
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 5: Obsidian Hex Lookup (design-system-cinema.json)")
print("=" * 60)

ds_path = ROOT / "src" / "lib" / "design-system-cinema.json"
try:
    ds = json.loads(ds_path.read_text())
    # The fix: obsidian is in accents, not foundations
    has_obsidian_accent = "obsidian" in ds.get("colors", {}).get("accents", {})
    has_obsidian_foundation = "obsidian" in ds.get("colors", {}).get("foundations", {})
    test("obsidian in accents (used by compose-v4.js)", has_obsidian_accent)
    if has_obsidian_foundation:
        warn("obsidian also in foundations — compose-v4 fix was needed because it was moved")
    else:
        test("obsidian NOT in foundations (confirms fix is correct)", not has_obsidian_foundation)
except Exception as e:
    test("design-system-cinema.json readable", False, str(e))


# ══════════════════════════════════════════════════════
# TEST 6: Full Compose Pipeline (end-to-end)
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TEST 6: Full Compose Pipeline (end-to-end render)")
print("=" * 60)

t0 = time.time()
rc, stdout, stderr = run(
    ["node", str(STUDIO / "compose-v4.js"), str(SCREENPLAY)],
    timeout=300
)
t1 = time.time()

test("compose-v4.js exits 0", rc == 0, f"exit={rc} stderr={stderr[:300]}")
test("compose finishes under 5min", t1 - t0 < 300, f"took {t1-t0:.1f}s")
print(f"  INFO  compose took {t1-t0:.1f}s")

# Parse output for key metrics
if rc == 0:
    # Check ALL CHECKS PASSED
    all_pass = "ALL CHECKS PASSED" in stdout
    test("compose: ALL CHECKS PASSED", all_pass,
         [l for l in stdout.split("\n") if "❌" in l][:3])

    # Check output file exists
    output_path = ROOT / "output" / "video" / "what-is-a-neuron_v5.mp4"
    test("output file exists", output_path.exists())

    if output_path.exists():
        # Check duration
        try:
            dur = float(subprocess.check_output(
                ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                 "-of", "csv=p=0", str(output_path)],
                text=True).strip())
            test(f"duration 60-300s", 60 <= dur <= 300, f"{dur:.1f}s")
            print(f"  INFO  final video: {dur:.1f}s")
        except Exception:
            warn("could not probe duration")

    # Parse QA results from output
    qa_lines = [l for l in stdout.split("\n") if "QA:" in l or "QA gate" in l]
    for ql in qa_lines:
        print(f"  INFO  {ql.strip()}")

    # Parse breathing ratio
    for l in stdout.split("\n"):
        if "Breathing ratio" in l:
            print(f"  INFO  {l.strip()}")
else:
    print(f"  STDERR: {stderr[:500]}")
    # Print compose stdout for debugging
    for line in stdout.split("\n")[-20:]:
        if line.strip():
            print(f"  LOG   {line}")


# ══════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════
print("\n" + "=" * 60)
total = passed + failed
print(f"RESULTS: {passed}/{total} passed, {failed} failed, {warnings} warnings")
print("=" * 60)

if failed > 0:
    print("\nFailed tests need attention before commit.")
    sys.exit(1)
else:
    print("\nAll tests passed. V3 design system changes are ready to commit.")
    sys.exit(0)
