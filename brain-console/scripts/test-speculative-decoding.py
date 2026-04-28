#!/usr/bin/env python3
"""
DFlash-MLX Speculative Decoding Test
=====================================
Uses mlx-lm's built-in draft_model support.
Main: Qwen3 14B (MLX format) — target model
Draft: Qwen3 0.6B or Qwen2.5 0.5B (MLX format) — fast draft

Setup (run when RAM is free — unload Ollama models first):
  pip3 install mlx-lm huggingface_hub
  # Draft model (~400MB):
  mlx_lm.convert --hf-path Qwen/Qwen2.5-0.5B-Instruct -q --upload-repo mlx-community/Qwen2.5-0.5B-Instruct-4bit
  # Or download pre-converted:
  # Main: mlx-community/Qwen3-14B-4bit (~9GB)
  # Draft: mlx-community/Qwen2.5-0.5B-Instruct-4bit (~400MB)

RAM requirement: ~10GB for main + ~500MB for draft = ~10.5GB
Must unload Ollama 32B model first: ollama stop qwen2.5:32b
"""

import time
import sys

def run_benchmark():
    from mlx_lm import load, stream_generate

    print("[1/4] Loading draft model (small, fast)...")
    t0 = time.time()
    draft_model, draft_tokenizer = load("mlx-community/Qwen2.5-0.5B-Instruct-4bit")
    print(f"  Draft loaded in {time.time()-t0:.1f}s")

    print("[2/4] Loading main model (Qwen3 14B)...")
    t0 = time.time()
    model, tokenizer = load("mlx-community/Qwen3-14B-4bit")
    print(f"  Main loaded in {time.time()-t0:.1f}s")

    prompt = "Explain quantum entanglement in 3 sentences."

    # Baseline: no speculative decoding
    print("\n[3/4] Baseline (no draft)...")
    t0 = time.time()
    tokens_base = 0
    text_base = ""
    for resp in stream_generate(model, tokenizer, prompt, max_tokens=200):
        text_base += resp.text
        tokens_base += 1
    base_time = time.time() - t0
    base_tps = tokens_base / base_time
    print(f"  {tokens_base} tokens in {base_time:.1f}s = {base_tps:.1f} tok/s")

    # Speculative decoding: with draft model
    print("\n[4/4] Speculative decoding (with draft)...")
    t0 = time.time()
    tokens_spec = 0
    text_spec = ""
    for resp in stream_generate(model, tokenizer, prompt, max_tokens=200, draft_model=draft_model):
        text_spec += resp.text
        tokens_spec += 1
    spec_time = time.time() - t0
    spec_tps = tokens_spec / spec_time
    print(f"  {tokens_spec} tokens in {spec_time:.1f}s = {spec_tps:.1f} tok/s")

    # Results
    speedup = spec_tps / base_tps if base_tps > 0 else 0
    print(f"\n{'='*50}")
    print(f"RESULTS:")
    print(f"  Baseline:     {base_tps:.1f} tok/s")
    print(f"  Speculative:  {spec_tps:.1f} tok/s")
    print(f"  Speedup:      {speedup:.2f}x")
    print(f"{'='*50}")

    return {
        "baseline_tps": round(base_tps, 1),
        "speculative_tps": round(spec_tps, 1),
        "speedup": round(speedup, 2),
        "tokens": tokens_spec,
    }


if __name__ == "__main__":
    try:
        results = run_benchmark()
        print(f"\nJSON: {results}")
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Install: pip3 install mlx-lm huggingface_hub")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
