#!/usr/bin/env python3
"""
Like One Studio v3 — AI Model Smoketest
Tests each AI model in the v3 stack: TTS, Music, SFX generation.
Run: python studio/test-studio-v3.py
"""
import os, sys, time

STUDIO_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(STUDIO_DIR, '..', 'output', 'studio-v3-test')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_kokoro():
    """Test Kokoro 82M — fast TTS preview."""
    print("\n🎤 Testing Kokoro TTS (82M)...")
    try:
        from kokoro import KPipeline
        pipeline = KPipeline(lang_code='a')  # American English
        text = "Welcome to Like One Academy. Today you will learn how AI can transform your creative workflow."
        generator = pipeline(text, voice='af_heart', speed=0.95)
        import soundfile as sf
        all_audio = []
        for i, (gs, ps, audio) in enumerate(generator):
            all_audio.append(audio)
        import numpy as np
        combined = np.concatenate(all_audio)
        out_path = os.path.join(OUTPUT_DIR, 'kokoro_test.wav')
        sf.write(out_path, combined, 24000)
        duration = len(combined) / 24000
        print(f"  ✅ Kokoro: {duration:.1f}s audio → {out_path}")
        return True
    except Exception as e:
        print(f"  ❌ Kokoro failed: {e}")
        return False

def test_f5tts():
    """Test F5-TTS — zero-shot voice cloning."""
    print("\n🎤 Testing F5-TTS (voice cloning)...")
    try:
        from f5_tts.api import F5TTS
        tts = F5TTS()
        # Use Kokoro output as reference if available, else skip
        ref_path = os.path.join(OUTPUT_DIR, 'kokoro_test.wav')
        if not os.path.exists(ref_path):
            print("  ⏭️ Skipping F5-TTS — needs reference audio (run Kokoro first)")
            return False
        out_path = os.path.join(OUTPUT_DIR, 'f5tts_test.wav')
        wav, sr, _ = tts.infer(
            ref_file=ref_path,
            ref_text="Welcome to Like One Academy.",
            gen_text="This is the voice of Like One Academy, speaking with clarity and warmth about the future of artificial intelligence.",
            file_wave=out_path,
        )
        print(f"  ✅ F5-TTS: cloned voice → {out_path}")
        return True
    except Exception as e:
        print(f"  ❌ F5-TTS failed: {e}")
        return False

def test_audioldm2():
    """Test AudioLDM2 — AI sound effects generation."""
    print("\n🔊 Testing AudioLDM2 (SFX generation)...")
    try:
        from diffusers import AudioLDM2Pipeline
        import torch, scipy
        pipe = AudioLDM2Pipeline.from_pretrained("cvssp/audioldm2", torch_dtype=torch.float32)
        # Use MPS on Apple Silicon
        if torch.backends.mps.is_available():
            pipe = pipe.to("mps")
            print("  📱 Using Apple MPS acceleration")
        prompt = "A soft futuristic whoosh sound effect, clean and cinematic"
        audio = pipe(prompt, num_inference_steps=50, audio_length_in_s=2.0).audios[0]
        out_path = os.path.join(OUTPUT_DIR, 'audioldm2_sfx_test.wav')
        scipy.io.wavfile.write(out_path, rate=16000, data=audio)
        print(f"  ✅ AudioLDM2 SFX: {len(audio)/16000:.1f}s → {out_path}")
        return True
    except Exception as e:
        print(f"  ❌ AudioLDM2 failed: {e}")
        return False

def test_musicgen():
    """Test MusicGen — AI music generation (via transformers)."""
    print("\n🎵 Testing MusicGen (music generation)...")
    try:
        from transformers import AutoProcessor, MusicgenForConditionalGeneration
        import torch, scipy
        processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
        model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
        if torch.backends.mps.is_available():
            model = model.to("mps")
            print("  📱 Using Apple MPS acceleration")
        inputs = processor(
            text=["Calm ambient electronic music, warm pads, slow tempo, educational documentary underscore"],
            padding=True, return_tensors="pt",
        )
        if torch.backends.mps.is_available():
            inputs = {k: v.to("mps") for k, v in inputs.items()}
        audio_values = model.generate(**inputs, max_new_tokens=512)  # ~10s at 32kHz
        out_path = os.path.join(OUTPUT_DIR, 'musicgen_ambient_test.wav')
        sampling_rate = model.config.audio_encoder.sampling_rate
        scipy.io.wavfile.write(out_path, rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())
        duration = audio_values.shape[-1] / sampling_rate
        print(f"  ✅ MusicGen: {duration:.1f}s ambient → {out_path}")
        return True
    except Exception as e:
        print(f"  ❌ MusicGen failed: {e}")
        return False

if __name__ == '__main__':
    print("🎬 LIKE ONE STUDIO v3 — AI Model Smoketest")
    print("=" * 50)
    start = time.time()
    results = {}

    # Test in order: fast → slow
    results['kokoro'] = test_kokoro()
    results['f5tts'] = test_f5tts()
    results['musicgen'] = test_musicgen()
    results['audioldm2'] = test_audioldm2()

    elapsed = time.time() - start
    print(f"\n{'=' * 50}")
    print(f"Results ({elapsed:.0f}s):")
    for name, ok in results.items():
        print(f"  {'✅' if ok else '❌'} {name}")

    passed = sum(1 for v in results.values() if v)
    print(f"\n{passed}/{len(results)} models working")
