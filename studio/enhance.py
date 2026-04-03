#!/usr/bin/env python3
"""
Like One Studio — Video Enhancement Pipeline
Upscale (Real-ESRGAN 4x) + Frame Interpolation (RIFE 2x) + Cinema Grade

Usage:
    python studio/enhance.py input.mp4 output.mp4
    python studio/enhance.py input.mp4 output.mp4 --scale 2 --no-interpolate
    python studio/enhance.py input.mp4 output.mp4 --scale 4 --fps 60 --grade arri
    python studio/enhance.py --batch input_dir/ output_dir/

Requires: ~/venvs/video-ai (torch, spandrel, opencv-python)
          ~/bin/rife-ncnn-vulkan (frame interpolation)
"""

import argparse
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

VENV_PYTHON = Path.home() / "venvs" / "video-ai" / "bin" / "python"
RIFE_BIN = Path.home() / "bin" / "rife-ncnn-vulkan"
RIFE_MODEL = Path.home() / "bin" / "models" / "rife-v4.6"
ESRGAN_MODEL = Path.home() / "bin" / "models" / "RealESRGAN_x4plus.pth"

CINEMA_PRESETS = {
    "arri": "eq=contrast=1.05:brightness=0.02:saturation=0.92,colorbalance=rs=0.03:gs=-0.01:bs=-0.02:rm=0.02:gm=0.0:bm=-0.01:rh=0.01:gh=0.0:bh=-0.02,curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95',noise=c0s=5:c1s=4:allf=t+u,vignette=PI/5",
    "red": "eq=contrast=1.12:brightness=-0.01:saturation=1.05,colorbalance=rs=0.02:gs=-0.02:bs=0.0:rm=0.01:gm=-0.01:bm=0.01,curves=m='0/0.02 0.15/0.12 0.5/0.5 0.85/0.88 1/0.97',noise=c0s=4:c1s=3:allf=t+u,vignette=PI/5",
    "kodak": "eq=contrast=1.04:brightness=0.01:saturation=0.88,colorbalance=rs=0.05:gs=0.02:bs=-0.03:rm=0.04:gm=0.01:bm=-0.02:rh=0.03:gh=0.01:bh=-0.01,curves=m='0/0.08 0.25/0.28 0.5/0.53 0.75/0.78 1/0.94',noise=c0s=8:c1s=6:allf=t+u,vignette=PI/5",
    "cool": "eq=contrast=1.08:brightness=-0.02:saturation=0.85,colorbalance=rs=-0.03:gs=-0.01:bs=0.04:rm=-0.02:gm=0.0:bm=0.03:rh=-0.01:gh=0.0:bh=0.02,curves=m='0/0.03 0.2/0.18 0.5/0.48 0.8/0.82 1/0.96',noise=c0s=5:c1s=4:allf=t+u,vignette=PI/5",
}


def get_video_info(path):
    """Get fps, width, height, frame count of a video."""
    def probe(entry):
        cmd = f"ffprobe -v quiet -select_streams v:0 -show_entries stream={entry} -of csv=p=0 {path}"
        return subprocess.check_output(cmd, shell=True).decode().strip()

    fps_raw = probe("r_frame_rate")
    fps_parts = fps_raw.split("/")
    fps = float(fps_parts[0]) / float(fps_parts[1]) if len(fps_parts) == 2 else float(fps_parts[0])

    w = int(probe("width"))
    h = int(probe("height"))

    nb = probe("nb_frames")
    frames = int(nb) if nb and nb != "N/A" else None
    return fps, w, h, frames


def extract_frames(video_path, output_dir):
    """Extract all frames as PNG."""
    os.makedirs(output_dir, exist_ok=True)
    subprocess.run(
        f"ffmpeg -y -i {video_path} -qscale:v 1 -qmin 1 {output_dir}/frame_%06d.png",
        shell=True, capture_output=True, check=True,
    )
    return sorted(Path(output_dir).glob("*.png"))


def upscale_frames(input_dir, output_dir, scale=4):
    """Upscale all frames using Real-ESRGAN via spandrel (MPS-accelerated)."""
    os.makedirs(output_dir, exist_ok=True)

    script = f"""
import torch, cv2, os, time, sys
from pathlib import Path
from spandrel import ModelLoader

device = 'mps' if torch.backends.mps.is_available() else 'cpu'
model = ModelLoader().load_from_file('{ESRGAN_MODEL}').to(device).eval()

input_dir = Path('{input_dir}')
output_dir = Path('{output_dir}')
frames = sorted(input_dir.glob('*.png'))
total = len(frames)
t0 = time.time()

for i, frame_path in enumerate(frames):
    img = cv2.imread(str(frame_path), cv2.IMREAD_COLOR)
    tensor = torch.from_numpy(img[:,:,::-1].copy()).permute(2,0,1).float().div(255.0).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tensor)
    result = output.squeeze(0).permute(1,2,0).mul(255.0).clamp(0,255).byte().cpu().numpy()
    cv2.imwrite(str(output_dir / frame_path.name), result[:,:,::-1].copy())
    if (i+1) % 10 == 0 or i == total-1:
        elapsed = time.time() - t0
        fps = (i+1) / elapsed
        eta = (total - i - 1) / fps if fps > 0 else 0
        print(f'  {{i+1}}/{{total}} frames | {{fps:.1f}} fps | ETA {{eta:.0f}}s', flush=True)

print(f'Upscaled {{total}} frames in {{time.time()-t0:.1f}}s')
"""
    subprocess.run(
        [str(VENV_PYTHON), "-c", script],
        check=True,
    )


def interpolate_frames(input_dir, output_dir):
    """Double frame rate using RIFE ncnn-vulkan."""
    if not RIFE_BIN.exists():
        print("⚠️ RIFE not found, skipping interpolation")
        shutil.copytree(input_dir, output_dir, dirs_exist_ok=True)
        return

    os.makedirs(output_dir, exist_ok=True)
    subprocess.run(
        [str(RIFE_BIN), "-i", str(input_dir), "-o", str(output_dir),
         "-m", str(RIFE_MODEL), "-j", "4:4:4"],
        check=True, capture_output=True,
    )


def reassemble(frame_dir, output_path, fps, audio_source=None, grade=None):
    """Reassemble frames into video with optional cinema grade and audio."""
    vf = "format=yuv420p"
    if grade and grade in CINEMA_PRESETS:
        vf = f"{CINEMA_PRESETS[grade]},{vf}"

    cmd = [
        "ffmpeg", "-y", "-framerate", str(fps),
        "-i", f"{frame_dir}/frame_%06d.png",
    ]

    if audio_source:
        cmd.extend(["-i", str(audio_source), "-map", "0:v", "-map", "1:a?", "-shortest"])

    cmd.extend([
        "-vf", vf,
        "-c:v", "libx264", "-crf", "16", "-preset", "slow",
        "-c:a", "aac", "-b:a", "192k",
        str(output_path),
    ])
    subprocess.run(cmd, capture_output=True, check=True)


def enhance_video(input_path, output_path, scale=4, interpolate=True, grade=None):
    """Full enhancement pipeline: upscale → interpolate → grade → output."""
    input_path = Path(input_path)
    output_path = Path(output_path)

    print(f"🎬 Enhancing: {input_path.name}")
    fps, w, h, n_frames = get_video_info(input_path)
    print(f"   Source: {w}x{h} @ {fps}fps")

    tmp = Path(f"/tmp/enhance_{input_path.stem}_{int(time.time())}")
    raw_dir = tmp / "raw"
    up_dir = tmp / "upscaled"
    interp_dir = tmp / "interpolated"

    t0 = time.time()

    # Step 1: Extract frames
    print(f"   [1/4] Extracting frames...")
    frames = extract_frames(input_path, raw_dir)
    n = len(frames)
    print(f"   → {n} frames extracted")

    # Step 2: Upscale
    if scale > 1:
        print(f"   [2/4] Upscaling {scale}x ({w}x{h} → {w*scale}x{h*scale})...")
        upscale_frames(raw_dir, up_dir, scale)
        current_dir = up_dir
    else:
        current_dir = raw_dir

    # Step 3: Interpolate (double fps)
    final_fps = fps
    if interpolate and RIFE_BIN.exists():
        print(f"   [3/4] Interpolating {fps}fps → {fps*2}fps...")
        interpolate_frames(current_dir, interp_dir)
        current_dir = interp_dir
        final_fps = fps * 2
        # RIFE outputs numbered files — need to check naming
        rife_frames = sorted(current_dir.glob("*.png"))
        if rife_frames:
            # Rename to sequential for ffmpeg
            for i, f in enumerate(rife_frames):
                f.rename(current_dir / f"frame_{i+1:06d}.png")
    else:
        print(f"   [3/4] Skipping interpolation")

    # Step 4: Reassemble
    grade_label = f" + {grade} grade" if grade else ""
    print(f"   [4/4] Assembling {w*scale}x{h*scale} @ {final_fps}fps{grade_label}...")
    reassemble(current_dir, output_path, final_fps, audio_source=input_path, grade=grade)

    elapsed = time.time() - t0
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"   ✅ {output_path.name} ({size_mb:.1f}MB, {elapsed:.0f}s)")

    # Cleanup
    shutil.rmtree(tmp, ignore_errors=True)
    return output_path


def batch_enhance(input_dir, output_dir, **kwargs):
    """Enhance all videos in a directory."""
    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    videos = sorted(input_dir.glob("*.mp4"))
    print(f"🎬 Batch enhancing {len(videos)} videos")

    for i, vid in enumerate(videos):
        out = output_dir / f"{vid.stem}-enhanced.mp4"
        print(f"\n[{i+1}/{len(videos)}]")
        enhance_video(vid, out, **kwargs)

    print(f"\n🏁 All {len(videos)} videos enhanced → {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Like One Studio — Video Enhancement Pipeline")
    parser.add_argument("input", help="Input video or directory (with --batch)")
    parser.add_argument("output", help="Output video or directory")
    parser.add_argument("--scale", type=int, default=4, choices=[1, 2, 4], help="Upscale factor (default: 4)")
    parser.add_argument("--no-interpolate", action="store_true", help="Skip frame interpolation")
    parser.add_argument("--grade", choices=list(CINEMA_PRESETS.keys()), help="Apply cinema grade preset")
    parser.add_argument("--batch", action="store_true", help="Process entire directory")
    args = parser.parse_args()

    if args.batch:
        batch_enhance(args.input, args.output, scale=args.scale, interpolate=not args.no_interpolate, grade=args.grade)
    else:
        enhance_video(args.input, args.output, scale=args.scale, interpolate=not args.no_interpolate, grade=args.grade)
