# Transcription & Analysis

**Course:** AI Voice & Audio Engineering
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[← AI Voice & Audio](/academy/ai-voice-audio/)
  Lesson 7 of 10


  # Transcription & Analysis

  Speech-to-text is solved. The real power is what you do with the words after.


  ### What You'll Learn


    - State-of-the-art transcription tools and when to use each

    - Speaker diarization — who said what and when

    - Extracting insights from conversations at scale

    - Building searchable audio archives and knowledge bases




  Foundation
  ## Transcription Is a Solved Problem

  OpenAI's Whisper changed everything. Released as open-source in 2022, it achieved near-human accuracy across 99 languages. Suddenly, transcription that used to cost dollars per minute became essentially free. Every tool in this space either uses Whisper directly or competes with it.
  Accuracy on clean audio in major languages is 95-99%. The remaining challenges are accents, overlapping speakers, domain-specific jargon, and noisy environments. Knowing which tool handles which edge case is the real skill.


  Tools
  ## The Transcription Stack

  **Whisper (local):** Free. Run it on your machine. No data leaves your computer. Best for privacy-sensitive content. Slower than cloud options but you control everything.
  **Deepgram:** Fastest cloud transcription. Real-time streaming support. Excellent speaker diarization. Their Nova-2 model rivals Whisper's accuracy at 10x the speed. Pay-per-minute pricing.
  **AssemblyAI:** Best for analysis features beyond raw transcription. Sentiment analysis, topic detection, content moderation, PII redaction — all built in. Their Universal model handles challenging audio well.
  **Descript:** Transcription plus editing in one interface. Edit audio by editing text. Remove filler words with a click. Best for content creators who need transcripts and polished audio simultaneously.


  Beyond Text
  ## Audio Intelligence

  Transcription is step one. The real value comes from what you extract:
  **Speaker Diarization:** Identifying who spoke when. Critical for meetings, interviews, and multi-person recordings. Deepgram and AssemblyAI both handle this well. The output tags each segment with a speaker label.
  **Sentiment Analysis:** Detecting emotional tone throughout a conversation. When did the mood shift? Where did frustration appear? Invaluable for customer call analysis, therapy research, and UX interviews.
  **Topic Extraction:** Automatically identifying what was discussed and when. Turn a two-hour meeting into a structured summary with action items. Feed the transcript to Claude for deeper analysis — "What decisions were made? What questions went unanswered?"
  **Searchable Archives:** Transcribe your entire audio library. Index it. Now you can search across hundreds of hours of recordings by keyword. Your meeting notes, podcast episodes, voice memos — all searchable in seconds.


  Code Example
  ## Building a Transcription Pipeline in Python

  Here is a complete pipeline that transcribes audio, identifies speakers, and generates a structured summary — all automated:
  `import whisper
from openai import OpenAI

# Step 1: Transcribe with Whisper (local, free, private)
model = whisper.load_model("base")  # Options: tiny, base, small, medium, large
result = model.transcribe("meeting_recording.mp3")
transcript = result["text"]

# Step 2: Get timestamped segments
segments = result["segments"]
for seg in segments[:5]:  # Preview first 5 segments
    start = f"{seg['start']:.1f}s"
    end = f"{seg['end']:.1f}s"
    print(f"[{start} - {end}] {seg['text']}")

# Step 3: Analyze with Claude/GPT
client = OpenAI()
analysis = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": f"""Analyze this meeting transcript:

{transcript}

Provide:
1. Executive summary (3 sentences)
2. Key decisions made
3. Action items with owners (if identifiable)
4. Unresolved questions
5. Suggested follow-up topics"""
    }]
)
print(analysis.choices[0].message.content)

# Step 4: Save structured output
with open("meeting_analysis.md", "w") as f:
    f.write("# Meeting Analysis\n\n")
    f.write(f"## Transcript\n{transcript}\n\n")
    f.write(f"## Analysis\n{analysis.choices[0].message.content}")`
  This pipeline runs entirely on your local machine (Whisper) plus one API call for analysis. For a 30-minute meeting, Whisper base model takes about 2-3 minutes on a modern laptop. The large model takes longer but handles accents and technical jargon significantly better.


  Deep Dive
  ## Choosing the Right Transcription Tool

  Each transcription tool has a specific sweet spot. The wrong choice wastes time or money:
  **Whisper (local)** — Best when: privacy matters, budget is zero, you have time. Speed: 1-5x slower than real-time depending on model size. Accuracy: 95-99% on clean audio in major languages. Run the "large-v3" model for best accuracy or "tiny" for fast drafts. No internet required.
  **Deepgram Nova-2** — Best when: speed is critical, real-time streaming needed, production applications. Speed: faster than real-time. Accuracy: matches Whisper large model. Cost: $0.0043/minute. Unique: WebSocket streaming API, custom vocabulary for domain-specific terms.
  **AssemblyAI Universal** — Best when: you need analysis beyond raw transcription. Speed: near real-time. Accuracy: competitive with Whisper large. Cost: $0.00025/second ($0.015/minute). Unique: built-in sentiment analysis, topic detection, PII redaction, content moderation — all in one API call.
  **Descript** — Best when: you are editing audio/video content. Speed: fast. Accuracy: excellent. Cost: $24/month for Creator plan. Unique: transcript and audio are linked — edit text to edit audio. Not an API — it is an editing application.
  **Decision framework:** If privacy matters most, use Whisper locally. If speed matters most, use Deepgram. If you need analysis on top of transcription, use AssemblyAI. If you are editing content, use Descript. If budget is zero and you need decent quality, use Whisper tiny or base model.


  Advanced
  ## Building Searchable Audio Knowledge Bases

  The real power of transcription is not individual files — it is what happens when you transcribe everything and make it searchable. Here is how to build an audio knowledge base:
  **Batch transcription:** Write a script that watches a folder for new audio files and automatically transcribes them. Whisper handles this well locally. Deepgram's batch API handles it at scale in the cloud. Either way, every recording in your archive becomes searchable text.
  **Semantic indexing:** Raw keyword search misses context. Use embeddings (OpenAI, HuggingFace BGE-small, or Cohere) to convert each transcript segment into a vector. Store these in a vector database (Supabase pgvector, Pinecone, or Chroma). Now you can search by meaning — "discussions about pricing strategy" finds relevant segments even if the word "pricing" was never spoken.
  **RAG over audio:** Combine your searchable archive with an LLM. Ask questions like "What did we decide about the Q3 launch timeline across all meetings in March?" The system retrieves relevant transcript segments and synthesizes an answer. This turns hours of recordings into an answerable knowledge base.
  **Practical applications:** Legal firms search depositions. Journalists search interview archives. Product teams search user research recordings. Sales teams search call recordings for objection patterns. Medical researchers search patient interviews. The use cases are everywhere once the infrastructure exists.


  Workflow
  ## Content Repurposing Pipeline

  One of the highest-value applications of transcription is turning audio into multiple content formats. Here is the repurposing pipeline:
  **Audio to blog post:** Transcribe your recording. Feed the transcript to Claude: "Convert this transcript into a structured blog post with headers, key points, and a conclusion. Remove verbal filler and conversational tangents. Keep the author's voice." One 30-minute recording becomes a 2,000-word article.
  **Audio to social posts:** Ask Claude to extract the five most quotable statements from your transcript. Each becomes a social media post. Pair with the corresponding audio clip (timestamp from the transcript) for an audio-visual social post.
  **Audio to newsletter:** Summarize the transcript into a 3-paragraph newsletter section with a key insight, a memorable quote, and a link to the full recording. This cross-pollinates your audio audience with your email list.
  **Audio to training data:** Transcripts of expert interviews become training material for custom AI models. Your domain expertise, captured in conversation, can inform RAG systems and fine-tuned models that answer questions in your area of specialization.


  Privacy
  ## Privacy and Security in Transcription

  Audio recordings often contain sensitive information. Here is how to handle transcription responsibly:
  **Local processing:** When audio contains confidential information — legal proceedings, medical consultations, financial discussions — use Whisper locally. No data leaves your machine. No third-party server ever sees your content. This is the only option for truly sensitive material.
  **PII redaction:** AssemblyAI offers automatic PII (Personally Identifiable Information) redaction — names, addresses, phone numbers, and social security numbers are automatically detected and replaced with placeholders in the transcript. This is essential for compliance with HIPAA, GDPR, and similar regulations.
  **Data retention policies:** Check each platform's data retention policy. Deepgram deletes audio after processing by default. Some platforms retain data for model training unless you opt out. For sensitive content, always read the privacy policy before uploading.


  ### Transcription Use Cases

  **Content Repurposing:** Record once → transcribe → blog post, social clips, newsletter
  **Meeting Intelligence:** Auto-transcribe → extract action items → assign tasks
  **Research:** Interview recordings → searchable database → pattern analysis
  **Accessibility:** All audio content → captions and transcripts → inclusive by default


  Advanced
  ## Speaker Diarization: Who Said What

  Transcription tells you what was said. Diarization tells you who said it. This is critical for meetings, interviews, depositions, and any multi-speaker recording:
  **How it works:** Diarization models analyze voice characteristics — pitch, timbre, speaking rhythm — to identify distinct speakers in a recording. Each segment of the transcript is then tagged with a speaker label (Speaker 1, Speaker 2, etc.).
  **Best tools:** Deepgram includes diarization in its standard API — add `"diarize": true` to your request. AssemblyAI offers it with automatic speaker count detection. For local processing, pyannote-audio is the leading open-source option. WhisperX combines Whisper transcription with pyannote diarization for the best free pipeline.
  **Accuracy factors:** Diarization works best with clear speaker separation — different voice types, minimal overlapping speech, and clean audio. Two speakers with similar voices in a noisy environment will challenge any model. Pre-processing with noise removal significantly improves diarization accuracy.
  **Post-processing:** Automated diarization occasionally mis-labels speakers. Build a quick review step into your pipeline — scan the first few attributions for each speaker, then search-and-replace any consistent errors. Five minutes of cleanup after diarization saves hours of manual attribution.


  Production Tips
  ## Optimizing Transcription Accuracy

  Even the best transcription models make mistakes. Here is how to maximize accuracy across different scenarios:
  **Clean audio first:** Run your recording through Adobe Podcast Enhance or a noise removal tool before transcribing. Whisper's accuracy on clean audio is 98-99%. On noisy audio, it can drop to 85-90%. That cleanup step is worth the extra minute.
  **Choose the right model size:** Whisper offers tiny, base, small, medium, and large models. For English content in clean conditions, base or small is usually sufficient and 5-10x faster than large. For accented speech, technical jargon, or multiple languages, use large-v3 — the accuracy difference justifies the extra processing time.
  **Custom vocabulary:** Deepgram and AssemblyAI support custom vocabulary — a list of domain-specific terms the model should prioritize. Add your product names, technical terms, and proper nouns. This simple step fixes the most common transcription errors in specialized content.
  **Language detection:** If your audio contains multiple languages, specify the primary language in your API call rather than relying on auto-detection. Auto-detection works well for monolingual content but can produce erratic results when languages are mixed within a single recording.


  ### Try It: Transcribe and Analyze

  Record a 2-minute voice memo about your current project. Then run it through this pipeline:
  `1. Transcribe with Whisper (huggingface.co/spaces has free Whisper demos)
2. Feed the transcript to Claude: "Analyze this transcript. What are the key ideas? What questions does the speaker leave unanswered? Suggest 3 follow-up topics."
3. Ask Claude to rewrite it as a structured blog post outline.`
  You just turned a rambling voice memo into a content plan. This is the audio-to-insight pipeline. Once you build it, you'll use it for everything.


  Quick Review
  ## Transcription Tools


  Key Terms
  ## Transcription Vocabulary


### Transcription and Analysis Concepts

**Card 1:**
Front: Speaker diarization
Back: Identifying who spoke when in a multi-person recording — each audio segment is tagged with a speaker label, critical for meetings and interviews

**Card 2:**
Front: Sentiment analysis
Back: Detecting emotional tone throughout a conversation — when the mood shifted, where frustration appeared — invaluable for customer call analysis and UX research

**Card 3:**
Front: Topic extraction
Back: Automatically identifying what was discussed and when — turns a two-hour meeting into a structured summary with action items

**Card 4:**
Front: Searchable audio archive
Back: Transcribing your entire audio library and indexing it so you can search across hundreds of hours of recordings by keyword in seconds

**Card 5:**
Front: OpenAI Whisper
Back: Open-source transcription model achieving near-human accuracy across 99 languages — made transcription essentially free and set the standard for the industry


  Check Your Understanding
  ## Lesson 7 Quiz


### Quiz

**Q1: What made OpenAI Whisper significant for the transcription industry?**
    A. It was the first transcription software ever
  ✓ B. It achieved near-human accuracy across 99 languages as open-source, making transcription essentially free
    C. It can only transcribe English
    D. It requires expensive hardware to run
  *Whisper's open-source release achieved near-human accuracy across 99 languages. Transcription that used to cost dollars per minute became essentially free. Every tool in the space now either uses Whisper or competes with it.*

**Q2: What is speaker diarization?**
    A. A method for improving audio quality
  ✓ B. Identifying who spoke when in a multi-person recording
    C. Translating speech to another language
    D. Removing background noise from recordings
  *Speaker diarization tags each audio segment with a speaker label — identifying who said what and when. This is critical for meetings, interviews, and any multi-person recording where you need to attribute statements.*

**Q3: What is the most valuable outcome of building a searchable audio archive?**
    A. You can play recordings at faster speeds
  ✓ B. You can search across hundreds of hours of recordings by keyword in seconds
    C. The files take up less storage space
    D. Recordings automatically delete after a set period
  *Once your audio library is transcribed and indexed, you can search across all of it instantly. Meeting recordings, podcast episodes, voice memos — all become searchable text rather than locked audio files.*


  [← Music & Sound Design](/academy/ai-voice-audio/music-and-sound-design/)
  [Next: Voice Interfaces →](/academy/ai-voice-audio/voice-interfaces/)
