#!/usr/bin/env python3
"""
Like One Studio — Fish Audio S2 Pro TTS Generator
Generates speech from text using S2 Pro on M3 Max MPS.

Usage:
  python studio/tts/generate-s2.py --text "Hello world" --output output/audio/hello.wav
  python studio/tts/generate-s2.py --text "Hello world" --output output/audio/hello.wav --prompt-audio ref.wav --prompt-text "Reference text"

Outputs:
  - WAV file at --output path
  - JSON timing file at --output.timing.json (for animation sync)
"""
import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

FISH_SPEECH_DIR = Path.home() / "likeone-workspace" / "code" / "fish-speech"
VENV_PYTHON = FISH_SPEECH_DIR / ".venv" / "bin" / "python"
CHECKPOINT_DIR = FISH_SPEECH_DIR / "checkpoints" / "s2-pro"
DEVICE = "mps"


def generate_semantic_tokens(text, output_dir, prompt_audio=None, prompt_text=None):
    """Step 1: Text → semantic tokens via S2 Pro Dual-AR."""
    cmd = [
        str(VENV_PYTHON),
        str(FISH_SPEECH_DIR / "fish_speech" / "models" / "text2semantic" / "inference.py"),
        "--text", text,
        "--checkpoint-path", str(CHECKPOINT_DIR),
        "--device", DEVICE,
        "--no-compile",
        "--output-dir", str(output_dir),
    ]

    if prompt_audio and prompt_text:
        cmd.extend(["--prompt-audio", str(prompt_audio), "--prompt-text", prompt_text])

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

    if result.returncode != 0:
        print(f"❌ Semantic generation failed:\n{result.stderr[-500:]}", file=sys.stderr)
        return None

    codes_path = output_dir / "codes_0.npy"
    if not codes_path.exists():
        print("❌ No codes file generated", file=sys.stderr)
        return None

    # Extract generation stats from logs
    stats = {}
    for line in result.stderr.split("\n"):
        if "Generated" in line and "tokens" in line:
            import re
            m = re.search(r"Generated (\d+) tokens in ([\d.]+) seconds", line)
            if m:
                stats["tokens"] = int(m.group(1))
                stats["generation_time_s"] = float(m.group(2))

    return codes_path, stats


def decode_audio(codes_path, output_wav):
    """Step 2: Semantic tokens → WAV via DAC codec."""
    cmd = [
        str(VENV_PYTHON),
        str(FISH_SPEECH_DIR / "fish_speech" / "models" / "dac" / "inference.py"),
        "-i", str(codes_path),
        "-o", str(output_wav),
        "--checkpoint-path", str(CHECKPOINT_DIR / "codec.pth"),
        "--device", DEVICE,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode != 0:
        print(f"❌ Audio decode failed:\n{result.stderr[-500:]}", file=sys.stderr)
        return None

    # Extract duration from logs
    duration_s = None
    for line in result.stderr.split("\n"):
        if "equivalent to" in line:
            import re
            m = re.search(r"equivalent to ([\d.]+) seconds", line)
            if m:
                duration_s = float(m.group(1))

    return duration_s


def generate_speech(text, output_path, prompt_audio=None, prompt_text=None):
    """Full pipeline: text → semantic tokens → WAV audio."""
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Temp dir for intermediate files
    tmp_dir = output_path.parent / "_tmp_s2"
    tmp_dir.mkdir(exist_ok=True)

    start = time.time()
    print(f"🎙️ Generating speech: \"{text[:60]}...\"" if len(text) > 60 else f"🎙️ Generating speech: \"{text}\"")

    # Step 1: Text → tokens
    result = generate_semantic_tokens(text, tmp_dir, prompt_audio, prompt_text)
    if result is None:
        return None

    codes_path, stats = result
    print(f"  ✅ Tokens: {stats.get('tokens', '?')} in {stats.get('generation_time_s', '?')}s")

    # Step 2: Tokens → audio
    duration_s = decode_audio(codes_path, output_path)
    if duration_s is None:
        return None

    total_time = time.time() - start
    print(f"  ✅ Audio: {duration_s:.1f}s WAV in {total_time:.1f}s total")

    # Write timing metadata
    timing = {
        "text": text,
        "audio_path": str(output_path),
        "duration_s": duration_s,
        "generation_time_s": total_time,
        "model": "fish-audio-s2-pro",
        "device": DEVICE,
        "tokens": stats.get("tokens"),
        # Estimate sentence timing by splitting proportionally
        "sentences": estimate_sentence_timing(text, duration_s),
    }

    timing_path = output_path.with_suffix(".timing.json")
    with open(timing_path, "w") as f:
        json.dump(timing, f, indent=2)

    # Cleanup temp files
    import shutil
    shutil.rmtree(tmp_dir, ignore_errors=True)

    return timing


def estimate_sentence_timing(text, total_duration_s):
    """Estimate per-sentence timing based on character count proportions."""
    import re
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s for s in sentences if s.strip()]

    if not sentences:
        return []

    total_chars = sum(len(s) for s in sentences)
    offset_ms = 0
    result = []

    for s in sentences:
        proportion = len(s) / total_chars if total_chars > 0 else 1 / len(sentences)
        duration_ms = int(total_duration_s * 1000 * proportion)
        result.append({
            "text": s,
            "offset_ms": offset_ms,
            "duration_ms": duration_ms,
        })
        offset_ms += duration_ms

    return result


def s2_pro_tts(narration, voice):
    # Placeholder for S2 Pro TTS implementation
    print(f'Generating narration with S2 Pro model using voice: {voice}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Like One Studio — S2 Pro TTS")
    parser.add_argument("--text", required=True, help="Text to synthesize")
    parser.add_argument("--output", required=True, help="Output WAV path")
    parser.add_argument("--prompt-audio", help="Reference audio for voice cloning")
    parser.add_argument("--prompt-text", help="Transcript of reference audio")
    args = parser.parse_args()

    result = generate_speech(args.text, args.output, args.prompt_audio, args.prompt_text)
    if result:
        print(f"\n✨ Done: {result['audio_path']} ({result['duration_s']:.1f}s)")
    else:
        print("\n❌ Generation failed")
        sys.exit(1)
