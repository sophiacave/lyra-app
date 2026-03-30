#!/usr/bin/env python3
"""
Like One Studio — Unified Generation Pipeline V2
One command → keyframes + motion + music + narration + cinema-grade output

Usage:
    python studio/generate.py --screenplay screenplays/lesson.json
    python studio/generate.py --screenplay screenplays/lesson.json --animate
    python studio/generate.py --prompt "cyberpunk cityscape at sunset" --animate --motion "slow dolly forward"
    python studio/generate.py --prompt "portrait of a teacher" --narration "Welcome to Like One Academy"
    python studio/generate.py --phase keyframe --prompt "golden hour forest"
    python studio/generate.py --phase animate --image output/keyframes/test.png --motion "camera push in"
    python studio/generate.py --phase music --music "ambient piano, reflective, 70 bpm"
    python studio/generate.py --phase narrate --narration "This is a test of the narration system"

Pipelines:
    Visual:  mflux Z-Image Turbo (MLX-native, M3 optimized)
    Music:   ACE-Step 1.5 (3.5B diffusion, MPS accelerated)
    Voice:   edge-tts (free, 400+ voices) → Fish Speech S2 Pro (upgrade path)
    Grade:   FFmpeg cinema-grade (ARRI/RED/Kodak presets)
    python studio/generate.py --phase animate --prompt "slow camera push in" --image output/keyframes/test.png
    python studio/generate.py --prompt "cyberpunk city" --animate --motion "slow dolly forward, neon lights flicker"

Pipelines:
    Visual:  mflux Z-Image Turbo (MLX-native, M3 optimized)
    Motion:  Kling V2 Master I2V (dual-keyframe interpolation)
    Music:   ACE-Step 1.5 (3.5B diffusion, MPS accelerated)
    Voice:   edge-tts (free, 400+ voices) → Fish Speech S2 Pro (upgrade path)
    Grade:   FFmpeg cinema-grade (ARRI/RED/Kodak presets)
"""

import argparse
import asyncio
import base64
import json
import os
import subprocess
import sys
import time
from pathlib import Path

STUDIO_DIR = Path(__file__).parent
ROOT_DIR = STUDIO_DIR.parent
OUTPUT_DIR = ROOT_DIR / "output"
RENDER_DIR = OUTPUT_DIR / "renders"
AUDIO_DIR = OUTPUT_DIR / "audio"
MUSIC_DIR = OUTPUT_DIR / "music"
VOICE_DIR = OUTPUT_DIR / "voice"
KEYFRAME_DIR = OUTPUT_DIR / "keyframes"
MOTION_DIR = OUTPUT_DIR / "motion"

# Venv paths
IMAGEGEN_VENV = STUDIO_DIR / "venvs" / "imagegen"
ACESTEP_VENV = STUDIO_DIR / "venvs" / "ace-step"
AUDIOGEN_VENV = STUDIO_DIR / "venvs" / "audiogen"
ACESTEP_REPO = STUDIO_DIR / "venvs" / "ace-step-repo"

# Ensure output dirs
for d in [OUTPUT_DIR, RENDER_DIR, AUDIO_DIR, MUSIC_DIR, VOICE_DIR, KEYFRAME_DIR, MOTION_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# ── KLING API CONFIG ──
KLING_BASE_URL = "https://api-singapore.klingai.com"
KLING_ACCESS_KEY = os.environ.get("KLING_ACCESS_KEY", "")
KLING_SECRET_KEY = os.environ.get("KLING_SECRET_KEY", "")

# ── VOICE CONFIG ──
VOICES = {
    "aria": "en-US-AriaNeural",        # warm, expressive female
    "jenny": "en-US-JennyNeural",      # natural female
    "guy": "en-US-GuyNeural",          # confident male
    "davis": "en-US-DavisNeural",      # deep male
    "sara": "en-US-SaraNeural",        # young female
    "andrew": "en-US-AndrewNeural",    # warm male narrator
}
DEFAULT_VOICE = "aria"

# ── CINEMA PRESETS ──
CINEMA_PRESETS = {
    "arri": {
        "grade": "eq=contrast=1.05:brightness=0.02:saturation=0.92,colorbalance=rs=0.03:gs=-0.01:bs=-0.02:rm=0.02:gm=0.0:bm=-0.01:rh=0.01:gh=0.0:bh=-0.02,curves=m='0/0.06 0.25/0.27 0.5/0.52 0.75/0.77 1/0.95'",
        "grain": "noise=c0s=5:c1s=4:allf=t+u",
    },
    "red": {
        "grade": "eq=contrast=1.12:brightness=-0.01:saturation=1.05,colorbalance=rs=0.02:gs=-0.02:bs=0.0:rm=0.01:gm=-0.01:bm=0.01,curves=m='0/0.02 0.15/0.12 0.5/0.5 0.85/0.88 1/0.97'",
        "grain": "noise=c0s=4:c1s=3:allf=t+u",
    },
    "kodak": {
        "grade": "eq=contrast=1.04:brightness=0.01:saturation=0.88,colorbalance=rs=0.05:gs=0.02:bs=-0.03:rm=0.04:gm=0.01:bm=-0.02:rh=0.03:gh=0.01:bh=-0.01,curves=m='0/0.08 0.25/0.28 0.5/0.53 0.75/0.78 1/0.94'",
        "grain": "noise=c0s=8:c1s=6:allf=t+u",
    },
}


def slug(text: str) -> str:
    """Create a filesystem-safe slug from text."""
    import re
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')[:60]


def run_in_venv(venv_path: Path, python_code: str, timeout: int = 300) -> str:
    """Run Python code inside a specific venv."""
    python_bin = venv_path / "bin" / "python"
    result = subprocess.run(
        [str(python_bin), "-c", python_code],
        capture_output=True, text=True, timeout=timeout,
        cwd=str(STUDIO_DIR),
    )
    if result.returncode != 0:
        raise RuntimeError(f"Venv execution failed:\n{result.stderr}")
    return result.stdout


# ═══════════════════════════════════════════════
# PHASE 1: KEYFRAME GENERATION (Z-Image Turbo)
# ═══════════════════════════════════════════════

def generate_keyframe(
    prompt: str,
    output_path: Path = None,
    width: int = 1024,
    height: int = 1024,
    steps: int = 4,
    seed: int = None,
) -> Path:
    """Generate a cinema-grade keyframe with Z-Image Turbo via mflux."""
    if seed is None:
        seed = int(time.time()) % 100000
    if output_path is None:
        output_path = KEYFRAME_DIR / f"keyframe-{slug(prompt)}-{seed}.png"

    print(f"🎨 Generating keyframe: {prompt[:50]}...")
    t0 = time.time()

    mflux_bin = IMAGEGEN_VENV / "bin" / "mflux-generate-z-image-turbo"
    result = subprocess.run([
        str(mflux_bin),
        "--prompt", prompt,
        "--width", str(width),
        "--height", str(height),
        "--steps", str(steps),
        "--seed", str(seed),
        "--output", str(output_path),
    ], capture_output=True, text=True, timeout=120)

    if result.returncode != 0:
        raise RuntimeError(f"Keyframe generation failed:\n{result.stderr}")

    elapsed = time.time() - t0
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ Keyframe: {output_path.name} ({size_mb:.1f}MB, {elapsed:.1f}s)")
    return output_path


# ═══════════════════════════════════════════════
# PHASE 1.5: MOTION (Kling I2V — image to video)
# ═══════════════════════════════════════════════

def _kling_jwt() -> str:
    """Generate a Kling API JWT token."""
    import jwt
    now = int(time.time())
    payload = {
        "iss": KLING_ACCESS_KEY,
        "exp": now + 1800,
        "nbf": now - 5,
        "iat": now,
    }
    return jwt.encode(payload, KLING_SECRET_KEY, algorithm="HS256",
                      headers={"typ": "JWT", "alg": "HS256"})


def _image_to_base64(image_path: Path) -> str:
    """Read an image and return base64-encoded string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _kling_request(method: str, endpoint: str, payload: dict = None) -> dict:
    """Make an authenticated request to Kling API."""
    import urllib.request
    import urllib.error

    url = f"{KLING_BASE_URL}{endpoint}"
    token = _kling_jwt()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Kling API {e.code}: {body}")


def generate_motion(
    image_path: Path,
    prompt: str = "",
    image_tail_path: Path = None,
    output_path: Path = None,
    duration: str = "5",
    mode: str = "pro",
    model: str = "kling-v2-master",
    poll_interval: int = 10,
    poll_timeout: int = 600,
) -> Path:
    """Animate a keyframe into a motion video via Kling I2V API.

    Args:
        image_path: Start frame image
        prompt: Motion description (camera movement, subject motion, atmosphere)
        image_tail_path: Optional end frame for dual-keyframe interpolation
        duration: "5" or "10" seconds
        mode: "std" or "pro"
        model: Kling model name
    """
    if not KLING_ACCESS_KEY or not KLING_SECRET_KEY:
        raise RuntimeError("KLING_ACCESS_KEY and KLING_SECRET_KEY must be set in .env")

    if output_path is None:
        output_path = MOTION_DIR / f"motion-{image_path.stem}-{int(time.time())}.mp4"

    print(f"🎥 Animating keyframe: {image_path.name} ({duration}s, {mode})...")
    if prompt:
        print(f"   Motion: {prompt[:80]}")
    if image_tail_path:
        print(f"   End frame: {image_tail_path.name} (dual-keyframe interpolation)")
    t0 = time.time()

    # Build payload
    payload = {
        "model_name": model,
        "image": _image_to_base64(image_path),
        "mode": mode,
        "duration": duration,
    }
    if prompt:
        payload["prompt"] = prompt
    if image_tail_path and image_tail_path.exists():
        payload["image_tail"] = _image_to_base64(image_tail_path)

    # Submit task
    resp = _kling_request("POST", "/v1/videos/image2video", payload)
    if resp.get("code") != 0:
        raise RuntimeError(f"Kling I2V submit failed: {resp}")

    task_id = resp["data"]["task_id"]
    print(f"   Task: {task_id}")

    # Poll for completion
    deadline = time.time() + poll_timeout
    while time.time() < deadline:
        time.sleep(poll_interval)
        status_resp = _kling_request("GET", f"/v1/videos/image2video/{task_id}")
        if status_resp.get("code") != 0:
            raise RuntimeError(f"Kling I2V poll failed: {status_resp}")

        task_data = status_resp["data"]
        task_status = task_data.get("task_status", "")

        if task_status == "succeed":
            video_url = task_data["task_result"]["videos"][0]["url"]
            print(f"   Downloading motion video...")

            # Download
            import urllib.request
            urllib.request.urlretrieve(video_url, str(output_path))

            elapsed = time.time() - t0
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"✅ Motion: {output_path.name} ({size_mb:.1f}MB, {elapsed:.0f}s)")
            return output_path

        elif task_status == "failed":
            msg = task_data.get("task_status_msg", "unknown error")
            raise RuntimeError(f"Kling I2V failed: {msg}")

        elapsed = int(time.time() - t0)
        print(f"   ⏳ {task_status} ({elapsed}s)...", end="\r")

    raise RuntimeError(f"Kling I2V timed out after {poll_timeout}s")


# ═══════════════════════════════════════════════
# PHASE 2: MUSIC GENERATION (ACE-Step 1.5)
# ═══════════════════════════════════════════════

def generate_music(
    prompt: str,
    duration: int = 30,
    output_path: Path = None,
    seed: int = 42,
    steps: int = 30,
    guidance: float = 10.0,
    lyrics: str = "[instrumental]",
) -> Path:
    """Generate music with ACE-Step 1.5."""
    if output_path is None:
        output_path = MUSIC_DIR / f"music-{slug(prompt)}-{seed}.wav"

    print(f"🎵 Generating music: {prompt[:50]}... ({duration}s)")
    t0 = time.time()

    code = f"""
import sys
sys.path.insert(0, '{ACESTEP_REPO}')
from acestep.pipeline_ace_step import ACEStepPipeline

pipe = ACEStepPipeline(dtype='float32', cpu_offload=True)
result = pipe(
    audio_duration={duration},
    prompt='''{prompt}''',
    lyrics='''{lyrics}''',
    infer_step={steps},
    guidance_scale={guidance},
    scheduler_type='euler',
    cfg_type='apg',
    omega_scale=10.0,
    manual_seeds=[{seed}],
    guidance_interval=0.5,
    guidance_interval_decay=0.0,
    min_guidance_scale=3.0,
    use_erg_tag=True,
    use_erg_lyric={'True' if lyrics != '[instrumental]' else 'False'},
    use_erg_diffusion=True,
    save_path='{output_path}',
)
print('OK')
"""
    run_in_venv(ACESTEP_VENV, code, timeout=300)

    elapsed = time.time() - t0
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ Music: {output_path.name} ({size_mb:.1f}MB, {elapsed:.1f}s)")
    return output_path


# ═══════════════════════════════════════════════
# PHASE 3: NARRATION (Fish Speech / Edge-TTS)
# ═══════════════════════════════════════════════

# Fish Speech models
FISH_MODELS = {
    "s1-mini": STUDIO_DIR / "models" / "openaudio-s1-mini",
    "s2-pro": STUDIO_DIR / "models" / "s2-pro",
}
FISH_VOICE_REFS = {
    "faye": {
        "audio": STUDIO_DIR / "voices" / "faye-reference.wav",
        "tokens": STUDIO_DIR / "voices" / "faye-reference.npy",
        "text": "Some call me nature, others call me mother nature.",
    },
}


def generate_narration(
    text: str,
    output_path: Path = None,
    voice: str = DEFAULT_VOICE,
    engine: str = "edge",  # "edge" or "fish"
    fish_model: str = "s1-mini",
) -> Path:
    """Generate narration with edge-tts or Fish Speech."""
    if engine == "fish":
        return _generate_narration_fish(text, output_path, voice, fish_model)
    return _generate_narration_edge(text, output_path, voice)


def _generate_narration_edge(
    text: str,
    output_path: Path = None,
    voice: str = DEFAULT_VOICE,
) -> Path:
    """Generate narration with edge-tts (free, instant)."""
    voice_id = VOICES.get(voice, voice)
    if output_path is None:
        output_path = VOICE_DIR / f"narration-{slug(text)}-{voice}.mp3"

    print(f"🗣️ Generating narration (edge-tts): {text[:50]}...")
    t0 = time.time()

    code = f"""
import asyncio, edge_tts

async def gen():
    comm = edge_tts.Communicate('''{text}''', '{voice_id}')
    await comm.save('{output_path}')

asyncio.run(gen())
print('OK')
"""
    run_in_venv(AUDIOGEN_VENV, code, timeout=60)

    elapsed = time.time() - t0
    size_kb = output_path.stat().st_size / 1024
    print(f"✅ Narration: {output_path.name} ({size_kb:.0f}KB, {elapsed:.1f}s)")
    return output_path


def _generate_narration_fish(
    text: str,
    output_path: Path = None,
    voice: str = "faye",
    fish_model: str = "s1-mini",
) -> Path:
    """Generate narration with Fish Speech (voice clone)."""
    model_path = FISH_MODELS.get(fish_model)
    if not model_path or not model_path.exists():
        print(f"⚠️ Fish Speech model '{fish_model}' not found, falling back to edge-tts")
        return _generate_narration_edge(text, output_path, voice)

    ref = FISH_VOICE_REFS.get(voice)
    if not ref or not ref["tokens"].exists():
        print(f"⚠️ Voice ref '{voice}' not found, falling back to edge-tts")
        return _generate_narration_edge(text, output_path, voice)

    if output_path is None:
        output_path = VOICE_DIR / f"narration-{slug(text)}-fish-{voice}.wav"

    codes_path = output_path.with_suffix('.codes.npy')

    print(f"🗣️ Generating narration (Fish Speech {fish_model}, voice: {voice}): {text[:50]}...")
    t0 = time.time()

    # Step 1: Generate VQ codes with the LLM
    step1_code = f"""
import sys
from fish_speech.models.text2semantic.inference import main
sys.argv = [
    'inference',
    '--text', '''{text}''',
    '--prompt-tokens', '{ref["tokens"]}',
    '--prompt-text', '''{ref["text"]}''',
    '--checkpoint-path', '{model_path}',
    '--device', 'mps',
    '--num-samples', '1',
    '--output-dir', '{output_path.parent}',
    '--seed', '42',
]
main(standalone_mode=False)

# Move codes_0.npy to expected path
import shutil
shutil.move('{output_path.parent}/codes_0.npy', '{codes_path}')
print('OK')
"""
    run_in_venv(AUDIOGEN_VENV, step1_code, timeout=120)

    # Step 2: Decode VQ codes to audio
    step2_code = f"""
from fish_speech.models.dac.inference import load_model
import torch, numpy as np, soundfile as sf

device = 'mps'
model = load_model('modded_dac_vq', '{model_path}/codec.pth', device=device)
indices = np.load('{codes_path}')
indices = torch.from_numpy(indices).to(device).long()
indices_lens = torch.tensor([indices.shape[1]], device=device, dtype=torch.long)
with torch.no_grad():
    fake_audios, audio_lengths = model.decode(indices, indices_lens)
audio = fake_audios[0, 0].float().detach().cpu().numpy()
sf.write('{output_path}', audio, model.sample_rate)
print('OK')
"""
    run_in_venv(AUDIOGEN_VENV, step2_code, timeout=60)

    # Clean up codes file
    if codes_path.exists():
        codes_path.unlink()

    elapsed = time.time() - t0
    size_kb = output_path.stat().st_size / 1024
    print(f"✅ Narration: {output_path.name} ({size_kb:.0f}KB, {elapsed:.1f}s)")
    return output_path


# ═══════════════════════════════════════════════
# PHASE 4: CINEMA GRADE (FFmpeg)
# ═══════════════════════════════════════════════

def cinema_grade(input_path: Path, output_path: Path = None, preset: str = "arri") -> Path:
    """Apply cinema-grade color grading to an image or video."""
    if preset not in CINEMA_PRESETS:
        raise ValueError(f"Unknown preset: {preset}. Available: {list(CINEMA_PRESETS.keys())}")

    if output_path is None:
        output_path = input_path.with_stem(f"{input_path.stem}-{preset}")

    p = CINEMA_PRESETS[preset]
    is_image = input_path.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')

    if is_image:
        vf = f"{p['grade']},{p['grain']},vignette=PI/5,unsharp=3:3:0.3"
        cmd = ["ffmpeg", "-y", "-i", str(input_path), "-vf", vf, str(output_path)]
    else:
        vf = f"crop=iw:round(iw/2.39/2)*2:0:(ih-round(iw/2.39/2)*2)/2,{p['grade']},{p['grain']},vignette=PI/5,unsharp=3:3:0.3,format=yuv420p"
        cmd = ["ffmpeg", "-y", "-i", str(input_path), "-vf", vf, "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-c:a", "copy", str(output_path)]

    print(f"🎬 Cinema grade ({preset}): {input_path.name}")
    subprocess.run(cmd, capture_output=True, timeout=120, check=True)
    print(f"✅ Graded: {output_path.name}")
    return output_path


# ═══════════════════════════════════════════════
# PHASE 4.5: SOUND DESIGN (SFX + ambient layers)
# ═══════════════════════════════════════════════

SFX_DIR = STUDIO_DIR / "assets" / "audio"

# Scene type → SFX mapping (auto-selected based on scene beat/type)
SFX_MAP = {
    "transition": "sfx-whoosh.wav",
    "reveal": "sfx-swell.wav",
    "title": "sfx-impact.wav",
    "chapter": "sfx-impact.wav",
    "step": "sfx-pop.wav",
    "question": "sfx-chime.wav",
    "close": "sfx-swell.wav",
    "awe": "sfx-swell.wav",
    "tick": "sfx-tick.wav",
    "default": "sfx-pop.wav",
}

def select_sfx(scene_type: str = "default") -> Path:
    """Select an SFX file based on scene type."""
    filename = SFX_MAP.get(scene_type, SFX_MAP["default"])
    sfx_path = SFX_DIR / filename
    if sfx_path.exists():
        return sfx_path
    return None

def build_sfx_track(scenes: list, total_duration: float, output_path: Path = None) -> Path:
    """Build an SFX track by placing sound effects at scene boundaries.

    scenes: list of dicts with 'type' and 'start_time' keys
    """
    if output_path is None:
        output_path = AUDIO_DIR / "sfx-track.wav"

    if not scenes:
        return None

    # Build FFmpeg filter to place SFX at timestamps
    inputs = []
    filter_parts = []
    valid_count = 0

    for i, scene in enumerate(scenes):
        sfx = select_sfx(scene.get("type", "default"))
        if sfx is None:
            continue
        start = scene.get("start_time", 0)
        inputs.extend(["-i", str(sfx)])
        # Delay each SFX to its start time, set volume to 40%
        delay_ms = int(start * 1000)
        filter_parts.append(f"[{valid_count}:a]adelay={delay_ms}|{delay_ms},volume=0.4[sfx{valid_count}]")
        valid_count += 1

    if valid_count == 0:
        return None

    # Mix all SFX into one track
    mix_inputs = "".join(f"[sfx{i}]" for i in range(valid_count))
    filter_parts.append(f"{mix_inputs}amix=inputs={valid_count}:duration=longest:normalize=0[sfxout]")
    filter_str = ";".join(filter_parts)

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", filter_str,
        "-map", "[sfxout]",
        "-t", str(total_duration),
        "-ar", "44100", "-ac", "2",
        str(output_path),
    ]

    try:
        subprocess.run(cmd, capture_output=True, timeout=60, check=True)
        print(f"🔊 SFX track: {valid_count} effects placed → {output_path.name}")
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"⚠️ SFX track generation failed: {e.stderr[:200] if e.stderr else 'unknown'}")
        return None


# ═══════════════════════════════════════════════
# PHASE 5: COMPOSE (stitch keyframe + audio)
# ═══════════════════════════════════════════════

def compose_video(
    keyframe: Path,
    music: Path = None,
    narration: Path = None,
    sfx: Path = None,
    duration: int = 30,
    output_path: Path = None,
    cinema_preset: str = "arri",
    motion_video: Path = None,
) -> Path:
    """Compose a video from keyframe/motion + audio layers using FFmpeg.

    Audio layers (all optional): narration, music (ducked), SFX (ambient).
    If motion_video is provided, uses the actual video instead of a static keyframe.
    """
    if output_path is None:
        output_path = RENDER_DIR / f"render-{keyframe.stem}.mp4"

    video_source = motion_video if motion_video and motion_video.exists() else keyframe
    is_static = video_source.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')

    print(f"🎞️ Composing video: {video_source.name} + audio...")

    # Collect audio inputs (track index starts at 1, video is 0)
    if is_static:
        inputs = ["-loop", "1", "-i", str(video_source)]
    else:
        inputs = ["-i", str(video_source)]

    audio_tracks = []  # (input_index, label, volume)
    idx = 1

    if narration and narration.exists():
        inputs.extend(["-i", str(narration)])
        audio_tracks.append((idx, "voice", 1.0))
        idx += 1

    if music and music.exists():
        inputs.extend(["-i", str(music)])
        has_voice = any(t[1] == "voice" for t in audio_tracks)
        audio_tracks.append((idx, "bg", 0.3 if has_voice else 0.8))
        idx += 1

    if sfx and sfx.exists():
        inputs.extend(["-i", str(sfx)])
        audio_tracks.append((idx, "sfx", 0.4))
        idx += 1

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-t", str(duration),
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium",
        "-shortest",
    ]

    if len(audio_tracks) >= 2:
        # Multi-track mix
        filter_parts = []
        labels = []
        for track_idx, label, vol in audio_tracks:
            filter_parts.append(f"[{track_idx}:a]volume={vol}[{label}]")
            labels.append(f"[{label}]")
        mix = "".join(labels) + f"amix=inputs={len(audio_tracks)}:duration=longest:normalize=0[out]"
        filter_parts.append(mix)
        cmd.extend([
            "-filter_complex", ";".join(filter_parts),
            "-map", "0:v", "-map", "[out]",
        ])
    elif len(audio_tracks) == 1:
        cmd.extend(["-map", "0:v", "-map", f"{audio_tracks[0][0]}:a"])
    else:
        cmd.extend(["-an"])  # no audio

    cmd.extend(["-c:a", "aac", "-b:a", "192k", str(output_path)])

    subprocess.run(cmd, capture_output=True, timeout=120, check=True)

    # Apply cinema grade
    graded_path = output_path.with_stem(f"{output_path.stem}-graded")
    cinema_grade(output_path, graded_path, cinema_preset)

    size_mb = graded_path.stat().st_size / (1024 * 1024)
    print(f"✅ Final render: {graded_path.name} ({size_mb:.1f}MB)")
    return graded_path


# ═══════════════════════════════════════════════
# PHASE 6: CONCATENATE SCENES
# ═══════════════════════════════════════════════

def concat_scenes(scene_paths: list[Path], title_slug: str) -> Path:
    """Concatenate multiple scene videos into one final video using FFmpeg."""
    output_path = RENDER_DIR / f"{title_slug}-final.mp4"
    concat_list = RENDER_DIR / f"{title_slug}-concat.txt"

    # Write FFmpeg concat list (absolute paths required)
    with open(concat_list, 'w') as f:
        for p in scene_paths:
            f.write(f"file '{p.resolve()}'\n")

    print(f"\n🎞️ Concatenating {len(scene_paths)} scenes...")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy", str(output_path),
    ]
    result = subprocess.run(cmd, capture_output=True, timeout=120)

    # If copy fails (codec mismatch), re-encode
    if result.returncode != 0:
        cmd = [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_list),
            "-c:v", "libx264", "-crf", "18", "-preset", "medium",
            "-c:a", "aac", "-b:a", "192k",
            str(output_path),
        ]
        subprocess.run(cmd, capture_output=True, timeout=300, check=True)

    # Clean up concat list
    concat_list.unlink(missing_ok=True)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ Final video: {output_path.name} ({size_mb:.1f}MB)")
    return output_path


# ═══════════════════════════════════════════════
# SCREENPLAY MODE
# ═══════════════════════════════════════════════

def process_screenplay(screenplay_path: Path, cinema_preset: str = "arri", animate: bool = False) -> list[Path]:
    """Process a full screenplay JSON into rendered scenes."""
    with open(screenplay_path) as f:
        screenplay = json.load(f)

    title = screenplay.get("title", "untitled")
    scenes = screenplay.get("scenes", [])
    outputs = []

    print(f"\n🎬 PROCESSING SCREENPLAY: {title} ({len(scenes)} scenes)")
    if animate:
        print("   🎥 Kling I2V animation ENABLED\n")

    for i, scene in enumerate(scenes):
        print(f"\n── Scene {i+1}/{len(scenes)}: {scene.get('id', f'scene-{i+1}')} ──")

        # Generate keyframe
        visual_prompt = scene.get("visual", scene.get("broll_prompt", ""))
        keyframe = None
        if visual_prompt:
            keyframe = generate_keyframe(
                visual_prompt,
                output_path=KEYFRAME_DIR / f"{slug(title)}-scene-{i+1}.png",
                seed=scene.get("seed", i * 1000 + 42),
            )

        # Animate keyframe with Kling I2V if enabled
        motion_video = None
        should_animate = animate or scene.get("animate", False)
        if keyframe and should_animate:
            motion_prompt = scene.get("motion", scene.get("camera", ""))
            # Optional end-frame for dual-keyframe interpolation
            end_frame_path = None
            if scene.get("visual_end"):
                end_frame_path = generate_keyframe(
                    scene["visual_end"],
                    output_path=KEYFRAME_DIR / f"{slug(title)}-scene-{i+1}-end.png",
                    seed=scene.get("seed", i * 1000 + 42) + 500,
                )
            motion_video = generate_motion(
                keyframe,
                prompt=motion_prompt,
                image_tail_path=end_frame_path,
                output_path=MOTION_DIR / f"{slug(title)}-scene-{i+1}.mp4",
                duration=scene.get("motion_duration", "5"),
                mode=scene.get("motion_mode", "pro"),
            )

        # Generate narration
        narration = None
        dialogue = scene.get("dialogue", scene.get("narration", ""))
        if dialogue:
            narration = generate_narration(
                dialogue,
                output_path=VOICE_DIR / f"{slug(title)}-scene-{i+1}.mp3",
                voice=scene.get("voice", DEFAULT_VOICE),
            )

        # Generate music (only for first scene or if specified)
        music = None
        music_prompt = scene.get("music", "")
        if music_prompt:
            music = generate_music(
                music_prompt,
                duration=scene.get("duration_s", 30),
                output_path=MUSIC_DIR / f"{slug(title)}-scene-{i+1}.wav",
            )

        # Compose if we have a keyframe
        if keyframe:
            render = compose_video(
                keyframe=keyframe,
                music=music,
                narration=narration,
                duration=scene.get("duration_s", 10),
                output_path=RENDER_DIR / f"{slug(title)}-scene-{i+1}.mp4",
                cinema_preset=cinema_preset,
                motion_video=motion_video,
            )
            outputs.append(render)

    # Concatenate all scenes into final video
    if len(outputs) > 1:
        final_path = concat_scenes(outputs, slug(title))
        print(f"\n🏁 DONE: {len(outputs)} scenes → {final_path.name}")
        return outputs + [final_path]
    elif outputs:
        print(f"\n🏁 DONE: 1 scene rendered for '{title}'")
    else:
        print(f"\n⚠️ No scenes rendered for '{title}'")
    return outputs


# ═══════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Like One Studio — Unified Generation Pipeline V2")
    parser.add_argument("--screenplay", type=Path, help="Path to screenplay JSON")
    parser.add_argument("--phase", choices=["keyframe", "animate", "music", "narrate", "compose", "all"], default="all")
    parser.add_argument("--prompt", type=str, help="Visual prompt for keyframe generation")
    parser.add_argument("--motion", type=str, default="", help="Motion prompt for Kling I2V animation")
    parser.add_argument("--image", type=Path, help="Existing image to animate (skip keyframe gen)")
    parser.add_argument("--image-tail", type=Path, help="End frame for dual-keyframe interpolation")
    parser.add_argument("--animate", action="store_true", help="Enable Kling I2V animation of keyframes")
    parser.add_argument("--motion-duration", type=str, default="5", choices=["5", "10"], help="I2V duration (seconds)")
    parser.add_argument("--motion-mode", type=str, default="pro", choices=["std", "pro"], help="I2V quality mode")
    parser.add_argument("--music", type=str, help="Music style/genre prompt")
    parser.add_argument("--lyrics", type=str, default="[instrumental]", help="Lyrics for music generation")
    parser.add_argument("--narration", type=str, help="Text to narrate")
    parser.add_argument("--voice", type=str, default=DEFAULT_VOICE, help=f"Voice: {', '.join(VOICES.keys())} (edge) or faye (fish)")
    parser.add_argument("--engine", type=str, default="edge", choices=["edge", "fish"], help="TTS engine: edge (free/instant) or fish (voice clone)")
    parser.add_argument("--fish-model", type=str, default="s1-mini", choices=list(FISH_MODELS.keys()), help="Fish Speech model")
    parser.add_argument("--duration", type=int, default=30, help="Duration in seconds")
    parser.add_argument("--width", type=int, default=1024, help="Keyframe width")
    parser.add_argument("--height", type=int, default=1024, help="Keyframe height")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument("--cinema", type=str, default="arri", choices=CINEMA_PRESETS.keys(), help="Cinema grade preset")
    parser.add_argument("--output", type=Path, default=None, help="Output path override")
    args = parser.parse_args()

    # Load .env for Kling keys
    env_path = ROOT_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())
        # Reload after .env
        global KLING_ACCESS_KEY, KLING_SECRET_KEY
        KLING_ACCESS_KEY = os.environ.get("KLING_ACCESS_KEY", "")
        KLING_SECRET_KEY = os.environ.get("KLING_SECRET_KEY", "")

    print("═" * 60)
    print("  🎬 LIKE ONE STUDIO — Generation Pipeline V2")
    print("═" * 60)

    # Screenplay mode
    if args.screenplay:
        process_screenplay(args.screenplay, cinema_preset=args.cinema, animate=args.animate)
        return

    # Single-phase mode
    keyframe_path = None
    motion_path = None
    music_path = None
    narration_path = None

    if args.phase in ("keyframe", "all") and args.prompt:
        keyframe_path = generate_keyframe(
            args.prompt, output_path=args.output if args.phase == "keyframe" else None,
            width=args.width, height=args.height, seed=args.seed,
        )

    # Animate phase: use --image or just-generated keyframe
    if args.phase in ("animate", "all") and (args.animate or args.phase == "animate"):
        source_image = args.image or keyframe_path
        if source_image and Path(source_image).exists():
            motion_path = generate_motion(
                Path(source_image),
                prompt=args.motion,
                image_tail_path=args.image_tail,
                output_path=args.output if args.phase == "animate" else None,
                duration=args.motion_duration,
                mode=args.motion_mode,
            )

    if args.phase in ("music", "all") and args.music:
        music_path = generate_music(
            args.music, duration=args.duration, seed=args.seed or 42, lyrics=args.lyrics,
        )

    if args.phase in ("narrate", "all") and args.narration:
        narration_path = generate_narration(args.narration, voice=args.voice, engine=args.engine, fish_model=args.fish_model)

    if args.phase in ("compose", "all") and (keyframe_path or args.image):
        compose_video(
            keyframe=keyframe_path or args.image,
            music=music_path,
            narration=narration_path,
            duration=args.duration,
            cinema_preset=args.cinema,
            motion_video=motion_path,
        )

    if not any([keyframe_path, motion_path, music_path, narration_path]):
        parser.print_help()
        print("\n⚠️  Provide at least --prompt, --music, --narration, or --image + --animate")


if __name__ == "__main__":
    main()
