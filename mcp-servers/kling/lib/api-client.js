/**
 * Kling API Client — JWT auth, request/poll/download
 * Handles the full lifecycle: submit → poll → download → save
 */
import jwt from 'jsonwebtoken';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const BASE_URL = 'https://api.klingai.com';

export class KlingClient {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this._token = null;
    this._tokenExpiry = 0;
  }

  getToken() {
    const now = Math.floor(Date.now() / 1000);
    if (this._token && now < this._tokenExpiry - 60) return this._token;

    const payload = {
      iss: this.accessKey,
      exp: now + 1800,
      nbf: now - 5,
      iat: now,
    };
    this._token = jwt.sign(payload, this.secretKey, {
      algorithm: 'HS256',
      header: { alg: 'HS256', typ: 'JWT' },
    });
    this._tokenExpiry = now + 1800;
    return this._token;
  }

  async request(method, endpoint, body = null) {
    const url = `${BASE_URL}${endpoint}`;
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Kling API ${resp.status}: ${text.slice(0, 500)}`);
    }
    return resp.json();
  }

  // ── Text to Video ──
  async textToVideo({ prompt, duration = '5', aspectRatio = '16:9', mode = 'pro', model = 'kling-v2-master', negativePrompt = '' }) {
    return this.request('POST', '/v1/videos/text2video', {
      prompt,
      negative_prompt: negativePrompt || 'blurry, low quality, distorted faces, text, watermark, UI elements',
      model_name: model,
      duration,
      aspect_ratio: aspectRatio,
      mode,
    });
  }

  // ── Image to Video ──
  async imageToVideo({ imageUrl, prompt, duration = '5', mode = 'pro', model = 'kling-v2-master' }) {
    return this.request('POST', '/v1/videos/image2video', {
      model_name: model,
      image: imageUrl,
      prompt,
      duration,
      mode,
    });
  }

  // ── Generate Image ──
  async generateImage({ prompt, negativePrompt = '', aspectRatio = '16:9', n = 1, model = 'kling-v1' }) {
    return this.request('POST', '/v1/images/generations', {
      prompt,
      negative_prompt: negativePrompt,
      model_name: model,
      aspect_ratio: aspectRatio,
      n,
    });
  }

  // ── Create Avatar (lip-sync from video + audio) ──
  // Requires an existing video (video_url or video_id) — NOT a still image
  // Step 1: Generate a short video from avatar image (image-to-video)
  // Step 2: Lip-sync that video with audio
  async createLipSync({ videoUrl, videoId, audioFile, audioUrl, mode = 'audio2video' }) {
    const input = { mode };
    if (videoId) input.video_id = videoId;
    else if (videoUrl) input.video_url = videoUrl;
    if (mode === 'audio2video') {
      if (audioFile) {
        input.audio_type = 'file';
        input.audio_file = audioFile; // base64 encoded
      } else if (audioUrl) {
        input.audio_type = 'url';
        input.audio_url = audioUrl;
      }
    }
    return this.request('POST', '/v1/videos/lip-sync', { input });
  }

  // ── Query Tasks ──
  async queryTextToVideo(taskId) {
    return this.request('GET', `/v1/videos/text2video/${taskId}`);
  }

  async queryImageToVideo(taskId) {
    return this.request('GET', `/v1/videos/image2video/${taskId}`);
  }

  async queryImage(taskId) {
    return this.request('GET', `/v1/images/generations/${taskId}`);
  }

  async queryLipSync(taskId) {
    return this.request('GET', `/v1/videos/lip-sync/${taskId}`);
  }

  // ── Poll until complete ──
  async pollTask(taskId, queryFn, { interval = 15000, timeout = 900000 } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = await queryFn.call(this, taskId);
      const status = result?.data?.task_status;

      if (status === 'succeed') return result;
      if (status === 'failed') throw new Error(`Task ${taskId} failed: ${JSON.stringify(result?.data?.task_status_msg || result).slice(0, 300)}`);

      await new Promise(r => setTimeout(r, interval));
    }
    throw new Error(`Task ${taskId} timed out after ${timeout / 1000}s`);
  }

  // ── Download video/image to local path ──
  download(url, outPath) {
    const dir = path.dirname(outPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    execSync(`curl -sL "${url}" -o "${outPath}"`, { timeout: 120000 });
    return outPath;
  }

  // ── Get duration of a video file ──
  getDuration(filePath) {
    try {
      return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`, { encoding: 'utf-8' }).trim()) || 0;
    } catch { return 0; }
  }
}
