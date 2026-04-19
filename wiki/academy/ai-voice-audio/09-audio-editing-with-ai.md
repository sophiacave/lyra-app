# Audio Editing with AI

**Course:** AI Voice & Audio Engineering
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[← AI Voice & Audio](/academy/ai-voice-audio/)
  Lesson 9 of 10


  # Audio Editing with AI

  Bad audio used to mean starting over. Now it means pressing a button.


  ### What You'll Learn


    - AI-powered noise removal, voice isolation, and audio repair

    - Automated editing — filler word removal, silence trimming, leveling

    - Audio enhancement and mastering with AI tools

    - Building efficient editing workflows that save hours




  The Problem
  ## Most Audio Is Terrible

  Background noise. Echo from bare walls. Volume levels that bounce between whisper and shout. Mouth clicks. Air conditioning hum. The neighbor's dog. A siren passing outside. Most real-world audio is recorded in real-world conditions, and real-world conditions are acoustically hostile.
  Traditional audio editing required specialized knowledge — EQ curves, noise gates, de-essers, compressors, limiters. Each tool needed careful parameter tuning. Fixing a five-minute clip could take an hour. AI compressed that hour into seconds.


  Tools
  ## The AI Audio Editing Arsenal

  **Adobe Podcast (Enhance Speech):** The gold standard for voice cleanup. Upload any recording and get studio-quality speech back. It removes background noise, reduces echo, and normalizes levels. Free tier available. The results are genuinely shocking on bad audio.
  **Descript:** Text-based audio editing. Your recording becomes a transcript — delete a word from the text and it's deleted from the audio. Remove all filler words in one click. Studio Sound feature cleans audio on par with Adobe. The editing paradigm itself is the innovation.
  **Auphonic:** Automated mastering. Upload your audio and it handles leveling, noise reduction, loudness normalization, and encoding. Two hours free per month. Trusted by broadcasters and podcasters worldwide.
  **LALAL.AI:** Stem separation specialist. Split any audio into vocals, drums, bass, guitar, piano, and other instruments. Isolate a voice from a noisy recording. Extract the music bed from a video. Remarkably clean separation.
  **RX by iZotope:** The professional's choice. AI-assisted repair tools for click removal, de-hum, de-reverb, spectral editing. More control than the one-button tools. Worth learning if audio editing is a regular part of your work.


  Workflow
  ## The AI Editing Pipeline

  The order matters. Each step works best when the previous step has cleaned up its specific problem:
  **Step 1 — Noise Removal:** Strip background noise first. Adobe Podcast or RX. This gives every subsequent tool cleaner input to work with.
  **Step 2 — Content Editing:** Remove filler words, long pauses, false starts, and tangents. Descript makes this trivial. Cut the content down to what matters.
  **Step 3 — Enhancement:** Apply EQ to warm up thin recordings. Add subtle compression to even out volume. De-ess any harsh sibilance. AI tools handle this automatically in most cases.
  **Step 4 — Mastering:** Normalize loudness to platform standards (-16 LUFS for podcasts, -14 for YouTube, -14 to -11 for music). Auphonic handles this with platform presets. Add final limiting to prevent clipping.


  Code Example
  ## Automated Audio Processing Pipeline

  Here is a Python script that automates the most common audio editing tasks — noise profiling, normalization, and format conversion — using free, open-source tools:
  `from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range
import subprocess
import os

def process_audio(input_path, output_path):
    """Complete audio processing pipeline."""

    # Step 1: Load audio
    audio = AudioSegment.from_file(input_path)
    print(f"Loaded: {len(audio)/1000:.1f}s, {audio.frame_rate}Hz")

    # Step 2: Convert to mono if stereo (podcast standard)
    if audio.channels > 1:
        audio = audio.set_channels(1)

    # Step 3: Normalize volume
    audio = normalize(audio)

    # Step 4: Apply gentle compression (even out loud/quiet parts)
    audio = compress_dynamic_range(
        audio,
        threshold=-20.0,   # Start compressing above -20dB
        ratio=3.0,         # 3:1 compression ratio
        attack=5.0,        # 5ms attack
        release=50.0       # 50ms release
    )

    # Step 5: Target loudness normalization with ffmpeg
    # Export intermediate file
    temp_path = "temp_processed.wav"
    audio.export(temp_path, format="wav")

    # Use ffmpeg loudnorm filter for LUFS targeting
    subprocess.run([
        "ffmpeg", "-i", temp_path,
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",  # Podcast standard
        "-ar", "44100",     # Sample rate
        "-ab", "192k",      # Bit rate
        output_path
    ], capture_output=True)

    os.remove(temp_path)
    print(f"Processed: {output_path}")

# Process a single file
process_audio("raw_recording.mp3", "mastered_episode.mp3")

# Batch process a folder
import glob
for f in glob.glob("raw_episodes/*.mp3"):
    output = f.replace("raw_episodes", "mastered_episodes")
    process_audio(f, output)`
  This script handles 80% of what Auphonic does for free. The ffmpeg `loudnorm` filter is the same algorithm used by professional broadcast chains. For the remaining 20% — AI noise removal and voice enhancement — Adobe Podcast Enhance and Descript's Studio Sound are still the best options.


  Deep Dive
  ## AI Audio Editing Tools: Detailed Comparison

  Understanding what each tool does best prevents wasted time and subscription costs:
  **Adobe Podcast Enhance** — What it does: one-click voice cleanup — noise removal, echo reduction, level normalization. Cost: free tier available, included with Creative Cloud. Best for: quick cleanup of interviews, voice memos, field recordings. Limitation: voice-only — does not handle music or sound effects well. The AI is trained specifically on speech and can damage non-speech audio.
  **Descript** — What it does: text-based editing with Studio Sound enhancement. Cost: free tier, Creator at $24/month. Best for: podcast and video editing where you need to cut content and clean audio simultaneously. Limitation: the text-editing paradigm has a learning curve, and export options are limited on lower tiers.
  **Auphonic** — What it does: automated mastering — loudness normalization, noise reduction, EQ, encoding to platform specs. Cost: 2 hours free/month, then $11/month for 9 hours. Best for: final mastering step before publishing. Limitation: it is a mastering tool, not an editor — it does not cut or rearrange content.
  **LALAL.AI** — What it does: stem separation — isolates vocals, drums, bass, guitar, piano, and other instruments. Cost: 10 minutes free, packages from $15. Best for: isolating a voice from background music, extracting music beds from video, remixing. Limitation: extreme separation (very quiet instruments) can introduce artifacts.
  **iZotope RX** — What it does: professional-grade AI repair — spectral editing, de-click, de-hum, de-reverb, dialogue isolation. Cost: $129-$1,199 depending on edition. Best for: forensic-level audio repair, broadcast post-production, film audio. Limitation: steep learning curve, expensive, overkill for casual use.


  Production Tips
  ## Common Audio Problems and AI Solutions

  Here is a troubleshooting guide for the most frequent audio problems and exactly which tool fixes each one:
  **Background noise (fan, AC, traffic):** Adobe Podcast Enhance or iZotope RX Voice De-noise. Both use AI to profile the noise and remove it while preserving speech clarity. For severe noise, run Adobe Enhance first, then apply a gentle noise gate in Audacity to catch residual hum.
  **Room echo / reverb:** iZotope RX De-reverb is the gold standard. Adobe Podcast Enhance handles moderate echo well. Prevention is better than cure — record in a small, furnished room. A closet full of clothes is acoustically excellent.
  **Volume inconsistency (quiet then loud):** Auphonic's adaptive leveler handles this automatically. Manually, apply compression (ratio 3:1, threshold -18dB) followed by normalization to your target LUFS. This evens out the dynamic range without making everything sound flat.
  **Mouth clicks and pops:** iZotope RX De-click with "mouth de-click" mode. For a free alternative, use Audacity's Click Removal effect with sensitivity set to 200 and minimum click width at 20. Multiple passes at low sensitivity work better than one aggressive pass.
  **Sibilance (harsh S and T sounds):** Apply a de-esser targeting 4-8kHz. iZotope RX has a dedicated De-ess module. In Audacity, use the Equalizer to gently reduce frequencies around 6-7kHz by 3-5dB. Over-de-essing makes speech sound lispy — use a light touch.
  **Clipping (audio too loud, distorted):** iZotope RX De-clip can repair moderate clipping by reconstructing the waveform peaks. Severe clipping is not recoverable — the original signal is permanently destroyed. Prevention: always record with input levels peaking around -12dB, giving you headroom for louder moments.


  ### Platform Loudness Standards

  **Podcasts (Apple/Spotify):** -16 LUFS, -1dB true peak
  **YouTube:** -14 LUFS, -1dB true peak
  **Broadcast (TV/Radio):** -24 LUFS (EBU R128)
  **Streaming Music:** -14 LUFS (Spotify), -16 LUFS (Apple Music)


  Advanced
  ## Batch Processing: Editing at Scale

  When you have dozens or hundreds of audio files to process, manual editing is not viable. Here is how to build batch processing workflows:
  **Folder watching:** Set up a script that monitors an input folder. When a new audio file appears, it automatically runs through your processing pipeline — noise removal, normalization, loudness targeting — and drops the finished file in an output folder. This is the backbone of production-scale audio operations.
  **Template-based processing:** Create processing presets for different content types. A "podcast" preset applies noise reduction, compression, and -16 LUFS normalization. A "music" preset applies lighter compression and -14 LUFS. A "voice memo" preset applies aggressive noise removal and normalization. Apply the right template to each batch.
  **Quality gatekeeping:** Automated processing catches 90% of issues. The remaining 10% requires human ears. Build a review step into your batch pipeline — flag files where the loudness range exceeds your threshold or where noise reduction had to work unusually hard. These flagged files get manual review while the rest pass through automatically.
  **Cloud scaling:** For truly large batches (hundreds of hours), use cloud processing. Upload files to a cloud storage bucket. Trigger serverless functions that process each file in parallel. Store results back in cloud storage. What takes hours locally finishes in minutes when parallelized across cloud compute.


  Prevention
  ## Recording Better Audio in the First Place

  The best audio editing is the editing you never have to do. Here are recording practices that dramatically reduce post-production work:
  **Room treatment on a budget:** Hang moving blankets on the walls behind and beside you. Place a thick rug under your desk. Close curtains over windows. These soft surfaces absorb reflections that cause echo. A $50 investment in blankets saves hours of de-reverb processing.
  **Microphone technique:** Position your mic 4-8 inches from your mouth, slightly off-axis (pointed at your chin, not directly at your lips). This reduces plosives (the "p" and "b" pops) and sibilance without needing post-processing. A $20 pop filter eliminates the rest.
  **Gain staging:** Set your input level so your normal speaking voice peaks around -12dB on the meter. This gives you headroom for louder moments without clipping. It is always better to record slightly too quiet (you can boost later) than slightly too loud (clipping destroys information permanently).
  **Environment control:** Turn off fans, AC, and any appliances with motors before recording. Close windows. Put your phone on silent. Record a 10-second room tone sample before you start — this gives noise removal tools a clean reference of your room's ambient sound.


  ### Try It: Rescue Bad Audio

  Record yourself talking for 30 seconds in the worst conditions you can find — near a fan, with the TV on, in a room with echo. Then run it through this rescue pipeline:
  `1. Upload to Adobe Podcast Enhance (podcast.adobe.com) → download cleaned version
2. Upload cleaned version to Auphonic (auphonic.com) → apply "Podcast" preset
3. Compare: original → Adobe cleaned → Auphonic mastered

Listen to all three back to back. The difference between step 1 and step 3 is the difference between amateur and professional.`
  This pipeline takes under two minutes and costs nothing. Every piece of audio you publish should go through it.


  Quick Review
  ## Audio Editing Tools


  Quick Review
  ## Audio Editing Pipeline Steps


  Key Terms
  ## Audio Editing Vocabulary


### Audio Editing Key Concepts

**Card 1:**
Front: De-essing
Back: Removing harsh sibilance — the sharp hissing sounds on S and T consonants that can be painful at high volumes

**Card 2:**
Front: LUFS normalization
Back: Adjusting audio loudness to platform standards — minus 16 LUFS for podcasts, minus 14 for YouTube — so your content sounds consistent with everything else

**Card 3:**
Front: Stem separation
Back: Using AI to split any audio into individual components — vocals, drums, bass, guitar, piano — for isolation, remixing, or noise removal

**Card 4:**
Front: True peak
Back: The absolute maximum level of an audio signal — platforms require minus 1dB true peak to prevent clipping and distortion on playback

**Card 5:**
Front: Text-based editing
Back: Descript\u0027s approach where audio and transcript are linked — editing words in the text automatically edits the corresponding audio


  Check Your Understanding
  ## Lesson 9 Quiz


### Quiz

**Q1: What makes Descript's editing approach uniquely powerful?**
    A. It has the best noise removal algorithm
  ✓ B. It edits audio by editing the transcript — delete text and the audio is automatically removed
    C. It supports the most file formats
    D. It automatically publishes to all platforms
  *Descript links the transcript directly to the audio. Edit the text — remove a word, cut a sentence — and that exact audio is removed. This makes editing as fast and intuitive as editing a word document.*

**Q2: What is the correct loudness standard for podcasts on Apple and Spotify?**
    A. -8 LUFS
    B. -14 LUFS
  ✓ C. -16 LUFS
    D. -24 LUFS
  *-16 LUFS with -1dB true peak is the standard for podcasts on Apple Podcasts and Spotify. This ensures your podcast sounds consistent in volume with other shows in any player.*

**Q3: What does LALAL.AI specialize in?**
    A. Podcast transcription
    B. Automatic podcast distribution
  ✓ C. Stem separation — isolating vocals, drums, bass, and instruments from any audio
    D. Real-time voice effects
  *LALAL.AI specializes in stem separation — splitting any audio into individual components like vocals, drums, bass, guitar, and piano. Useful for isolating a voice from a noisy recording or extracting a music bed from video.*


  [← Voice Interfaces](/academy/ai-voice-audio/voice-interfaces/)
  [Next: Your Audio Studio →](/academy/ai-voice-audio/your-audio-studio/)
