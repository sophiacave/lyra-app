#!/usr/bin/env python3
"""
Like One Studio — Fish Speech S2 Pro TTS
Standalone inference script for M3 Max (MPS backend).

Usage:
  python studio/tts/fish-s2-pro.py --text "Hello world" --output output/audio/test.wav
  python studio/tts/fish-s2-pro.py --text "Hello world" --output test.wav --ref-audio ref.wav --ref-text "Reference text"
"""
import argparse
import os
import sys
import time
from pathlib import Path

import numpy as np
import pyrootutils
import soundfile as sf
import torch
from loguru import logger

# Fish Speech root
FISH_DIR = Path.home() / "likeone-workspace" / "code" / "fish-speech"
sys.path.insert(0, str(FISH_DIR))
os.chdir(FISH_DIR)
pyrootutils.setup_root(FISH_DIR, indicator=".project-root", pythonpath=True)
os.environ["EINX_FILTER_TRACEBACK"] = "false"

from fish_speech.inference_engine import TTSInferenceEngine
from fish_speech.models.dac.inference import load_model as load_decoder_model
from fish_speech.models.text2semantic.inference import launch_thread_safe_queue
from fish_speech.utils.schema import ServeTTSRequest, ServeReferenceAudio


def parse_args():
    p = argparse.ArgumentParser(description="Fish S2 Pro TTS")
    p.add_argument("--text", required=True, help="Text to synthesize")
    p.add_argument("--output", required=True, help="Output WAV path")
    p.add_argument("--ref-audio", help="Reference audio for voice cloning")
    p.add_argument("--ref-text", help="Transcript of reference audio")
    p.add_argument("--checkpoint", default="checkpoints/s2-pro", help="Model checkpoint dir")
    p.add_argument("--codec", default="checkpoints/s2-pro/codec.pth", help="Codec checkpoint")
    p.add_argument("--temperature", type=float, default=0.7)
    p.add_argument("--top-p", type=float, default=0.7)
    p.add_argument("--repetition-penalty", type=float, default=1.5)
    p.add_argument("--max-tokens", type=int, default=2048)
    p.add_argument("--chunk-length", type=int, default=200)
    p.add_argument("--seed", type=int, default=42)
    return p.parse_args()


def main():
    args = parse_args()
    
    # Device selection
    if torch.backends.mps.is_available():
        device = "mps"
    elif torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
    
    precision = torch.bfloat16
    logger.info(f"Device: {device}, Precision: {precision}")
    
    # Load models
    t0 = time.time()
    logger.info("Loading Llama model...")
    llama_queue = launch_thread_safe_queue(
        checkpoint_path=Path(args.checkpoint),
        device=device,
        precision=precision,
        compile=False,
    )
    
    logger.info("Loading codec model...")
    decoder_model = load_decoder_model(
        config_name="modded_dac_vq",
        checkpoint_path=Path(args.codec),
        device=device,
    )
    
    t_load = time.time() - t0
    logger.info(f"Models loaded in {t_load:.1f}s")
    
    # Create engine
    engine = TTSInferenceEngine(
        llama_queue=llama_queue,
        decoder_model=decoder_model,
        compile=False,
        precision=precision,
    )
    
    # Build references
    references = []
    if args.ref_audio and os.path.exists(args.ref_audio):
        ref_data = open(args.ref_audio, "rb").read()
        references.append(ServeReferenceAudio(
            audio=ref_data,
            text=args.ref_text or "",
        ))
        logger.info(f"Using reference voice: {args.ref_audio}")
    
    # Build request
    request = ServeTTSRequest(
        text=args.text,
        references=references,
        reference_id=None,
        max_new_tokens=args.max_tokens,
        chunk_length=args.chunk_length,
        top_p=args.top_p,
        repetition_penalty=args.repetition_penalty,
        temperature=args.temperature,
        format="wav",
        seed=args.seed,
    )
    
    # Generate
    logger.info(f"Generating speech ({len(args.text)} chars)...")
    t_gen = time.time()
    
    audio_chunks = []
    sample_rate = 44100
    
    for result in engine.inference(request):
        if result.code == "header" and isinstance(result.audio, tuple):
            sample_rate = result.audio[0]
        elif result.code == "segment" and isinstance(result.audio, tuple):
            audio_chunks.append(result.audio[1])
        elif result.code == "final" and isinstance(result.audio, tuple):
            audio_chunks.append(result.audio[1])
    
    if not audio_chunks:
        logger.error("No audio generated!")
        sys.exit(1)
    
    # Concatenate and save
    audio = np.concatenate(audio_chunks)
    
    # Ensure output dir exists
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    
    sf.write(str(out_path), audio, sample_rate)
    
    duration = len(audio) / sample_rate
    t_total = time.time() - t_gen
    rtf = t_total / duration if duration > 0 else 0
    
    logger.info(f"✅ Generated {duration:.1f}s audio in {t_total:.1f}s (RTF: {rtf:.2f}x)")
    logger.info(f"   Output: {out_path}")
    logger.info(f"   Sample rate: {sample_rate}Hz")


if __name__ == "__main__":
    main()
