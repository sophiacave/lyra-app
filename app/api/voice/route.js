import { NextResponse } from 'next/server';

// ElevenLabs Text-to-Speech API
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';

export async function POST(request) {
  const { text, pin } = await request.json();

  if (pin !== process.env.LYRA_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
  }

  if (!text || text.length > 1000) {
    return NextResponse.json({ error: 'Text required (max 1000 chars)' }, { status: 400 });
  }

  try {
    // Use the voice ID from env, or default to "Rachel" — a warm, professional female voice
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

    const response = await fetch(
      `${ELEVENLABS_API}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanTextForSpeech(text),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', response.status, errorText);
      return NextResponse.json(
        { error: `Voice synthesis failed: ${response.status}` },
        { status: response.status }
      );
    }

    // Stream the audio back as MP3
    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Clean text for natural speech — remove emojis, formatting, etc.
function cleanTextForSpeech(text) {
  return text
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/✦/g, '')
    // Clean markdown-style formatting
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,3}\s/g, '')
    // Clean bullet markers
    .replace(/^[•\-]\s/gm, '')
    // Collapse multiple newlines
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    // Clean up extra spaces and periods
    .replace(/\.\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
