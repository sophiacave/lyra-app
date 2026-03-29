#!/usr/bin/env node
/**
 * Like One Studio — Kling Cinema MCP Server v2
 * HOLLYWOOD EDITION — Oscar-worthy cinematography from a chat window.
 *
 * Uses the kling-api npm package for battle-tested API interaction.
 *
 * Tools:
 *   text_to_video       — Cinematic B-roll from text prompt
 *   image_to_video      — Animate a still image into motion
 *   generate_image      — AI image generation (any setting/pose/angle)
 *   create_avatar       — Image + audio → talking head (lip-synced!)
 *   lip_sync            — Apply lip-sync to an existing video + audio
 *   direct_scene        — FULL PIPELINE: generate image → animate → final clip
 *   check_task          — Poll/download any Kling task
 *   shot_library        — View available Hollywood shots per beat
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { KlingAPI } from 'kling-api';
import { generateShotList, buildImagePrompt, buildAnimationPrompt, FAYE_IDENTITY, SHOT_LIBRARY } from './lib/director.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
dotenv.config({ path: path.join(ROOT, '.env') });

const OUTPUT = path.join(ROOT, 'output');
const BROLL_DIR = path.join(OUTPUT, 'broll');
const AVATAR_DIR = path.join(OUTPUT, 'avatar');
const IMAGE_DIR = path.join(OUTPUT, 'images');
const AUDIO_DIR = path.join(OUTPUT, 'audio');
const STUDIO = path.join(ROOT, 'studio');
const AVATARS = path.join(STUDIO, 'avatars');

[BROLL_DIR, AVATAR_DIR, IMAGE_DIR].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

const api = new KlingAPI({
  accessKey: process.env.KLING_ACCESS_KEY,
  secretKey: process.env.KLING_SECRET_KEY,
});

const server = new McpServer({ name: 'likeone-kling', version: '2.0.0' });

// ── Helpers ──
function getDuration(f) {
  try { return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${f}"`, { encoding: 'utf-8' }).trim()) || 0; } catch { return 0; }
}

function download(url, out) {
  const dir = path.dirname(out);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  execSync(`curl -sL "${url}" -o "${out}"`, { timeout: 120000 });
}

async function pollVideo(taskId, queryFn) {
  return api.waitForVideoResult(taskId, queryFn.bind(api), { interval: 10000, timeout: 900000 });
}

async function pollImage(taskId) {
  return api.waitForImageResult(taskId, api.queryImageGenTask.bind(api), { interval: 5000, timeout: 120000 });
}

function extractVideoUrl(result) {
  return result?.data?.task_result?.videos?.[0]?.url;
}

function extractImageUrls(result) {
  return (result?.data?.task_result?.images || []).map(i => i?.url).filter(Boolean);
}

// ═══════════════════════════════════════════════════
// TOOL: text_to_video
// ═══════════════════════════════════════════════════
server.tool(
  'text_to_video',
  'Generate cinematic B-roll video from a text prompt. Be specific: camera, lighting, motion, mood, color.',
  {
    prompt: z.string().describe('Cinematic visual description'),
    duration: z.enum(['5', '10']).default('10'),
    aspect_ratio: z.enum(['16:9', '9:16', '1:1']).default('16:9'),
    mode: z.enum(['std', 'pro']).default('pro'),
    model: z.string().default('kling-v2-6'),
    negative_prompt: z.string().default('blurry, low quality, distorted, text, watermark, UI, abstract particles, cheap effects, cartoon, anime'),
    save_as: z.string().optional().describe('Filename in output/broll/'),
    wait: z.boolean().default(false),
  },
  async ({ prompt, duration, aspect_ratio, mode, model, negative_prompt, save_as, wait }) => {
    try {
      const result = await api.textToVideo({ prompt, negative_prompt, duration, aspect_ratio, mode, model_name: model });
      const taskId = result?.data?.task_id;
      if (!taskId) return { content: [{ type: 'text', text: `❌ No task_id: ${JSON.stringify(result).slice(0, 500)}` }] };
      if (!wait) return { content: [{ type: 'text', text: `✅ Task: ${taskId} | ${duration}s ${mode}\nPoll with check_task type=text2video.` }] };

      const completed = await pollVideo(taskId, api.queryTextToVideoTask);
      const url = extractVideoUrl(completed);
      if (!url) return { content: [{ type: 'text', text: `❌ No video URL` }] };

      const outPath = path.join(BROLL_DIR, save_as || `kling-${taskId}.mp4`);
      download(url, outPath);
      return { content: [{ type: 'text', text: `🎬 ${getDuration(outPath).toFixed(1)}s cinema\nSaved: ${outPath}` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: generate_image
// ═══════════════════════════════════════════════════
server.tool(
  'generate_image',
  'Generate a photorealistic AI image. Use for creating presenter keyframes, concept art, thumbnails.',
  {
    prompt: z.string().describe('Full image description — subject, pose, setting, camera, lighting'),
    negative_prompt: z.string().default('cartoon, anime, illustration, blurry, distorted, uncanny valley'),
    aspect_ratio: z.enum(['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3']).default('16:9'),
    n: z.number().default(1).describe('Variations (1-4)'),
    model: z.string().default('kling-v1'),
    save_as: z.string().optional().describe('Filename in output/images/'),
    wait: z.boolean().default(true),
  },
  async ({ prompt, negative_prompt, aspect_ratio, n, model, save_as, wait }) => {
    try {
      const result = await api.generateImage({ prompt, negative_prompt, aspect_ratio, n, model_name: model });
      const taskId = result?.data?.task_id;
      if (!taskId) return { content: [{ type: 'text', text: `❌ No task_id: ${JSON.stringify(result).slice(0, 500)}` }] };
      if (!wait) return { content: [{ type: 'text', text: `✅ Image task: ${taskId}` }] };

      const completed = await pollImage(taskId);
      const urls = extractImageUrls(completed);
      const saved = [];
      for (let i = 0; i < urls.length; i++) {
        const fn = save_as ? (urls.length > 1 ? save_as.replace('.', `_${i+1}.`) : save_as) : `kling-img-${taskId}_${i+1}.png`;
        const out = path.join(IMAGE_DIR, fn);
        download(urls[i], out);
        saved.push(out);
      }
      return { content: [{ type: 'text', text: `🖼️ ${saved.length} image(s):\n${saved.join('\n')}` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: image_to_video
// ═══════════════════════════════════════════════════
server.tool(
  'image_to_video',
  'Animate a still image into a moving video. Natural motion, camera movement, gestures.',
  {
    image_path: z.string().describe('Path to source image'),
    prompt: z.string().describe('Motion description — camera, subject movement, atmosphere'),
    duration: z.enum(['5', '10']).default('5'),
    mode: z.enum(['std', 'pro']).default('pro'),
    model: z.string().default('kling-v2-master'),
    save_as: z.string().optional(),
    save_dir: z.enum(['avatar', 'broll']).default('avatar'),
    wait: z.boolean().default(false),
  },
  async ({ image_path, prompt, duration, mode, model, save_as, save_dir, wait }) => {
    try {
      if (!existsSync(image_path)) return { content: [{ type: 'text', text: `❌ Not found: ${image_path}` }] };

      const result = await api.imageToVideo({ image: image_path, prompt, duration, mode, model_name: model, aspect_ratio: '16:9' });
      const taskId = result?.data?.task_id;
      if (!taskId) return { content: [{ type: 'text', text: `❌ No task_id: ${JSON.stringify(result).slice(0, 500)}` }] };
      if (!wait) return { content: [{ type: 'text', text: `✅ Animate task: ${taskId}\nPoll with check_task type=image2video.` }] };

      const completed = await pollVideo(taskId, api.queryImageToVideoTask);
      const url = extractVideoUrl(completed);
      if (!url) return { content: [{ type: 'text', text: `❌ No video URL` }] };

      const outDir = save_dir === 'broll' ? BROLL_DIR : AVATAR_DIR;
      const outPath = path.join(outDir, save_as || `animated-${taskId}.mp4`);
      download(url, outPath);
      return { content: [{ type: 'text', text: `🎬 Animated! ${getDuration(outPath).toFixed(1)}s\nSaved: ${outPath}` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: create_avatar — Image + audio → lip-synced talking head
// ═══════════════════════════════════════════════════
server.tool(
  'create_avatar',
  'Generate a lip-synced talking head from a face image + audio. Uses Kling avatar API (image2video with audio). Accepts persona shorthand (faye/lyra/sage/atlas) or image path.',
  {
    face_image: z.string().default('faye').describe('Image path or persona name'),
    audio_path: z.string().describe('Audio file path (WAV/MP3)'),
    save_as: z.string().optional().describe('Filename in output/avatar/'),
    wait: z.boolean().default(true),
  },
  async ({ face_image, audio_path, save_as, wait }) => {
    try {
      let imgPath = face_image;
      if (['faye', 'lyra', 'sage', 'atlas'].includes(face_image)) {
        imgPath = path.join(AVATARS, face_image, 'headshot-neutral.png');
      }
      if (!existsSync(imgPath)) return { content: [{ type: 'text', text: `❌ Image not found: ${imgPath}` }] };
      if (!existsSync(audio_path)) return { content: [{ type: 'text', text: `❌ Audio not found: ${audio_path}` }] };

      const result = await api.createAvatar({ image: imgPath, sound_file: audio_path });
      const taskId = result?.data?.task_id;
      if (!taskId) return { content: [{ type: 'text', text: `❌ No task_id: ${JSON.stringify(result).slice(0, 500)}` }] };
      if (!wait) return { content: [{ type: 'text', text: `✅ Avatar task: ${taskId}\nPoll with check_task type=avatar.` }] };

      const completed = await pollVideo(taskId, api.queryAvatarTask);
      const url = extractVideoUrl(completed);
      if (!url) return { content: [{ type: 'text', text: `❌ No video URL. Debug: ${JSON.stringify(completed?.data).slice(0, 500)}` }] };

      const outPath = path.join(AVATAR_DIR, save_as || `avatar-${taskId}.mp4`);
      download(url, outPath);
      return { content: [{ type: 'text', text: `🎭 Avatar! ${getDuration(outPath).toFixed(1)}s\nSaved: ${outPath}` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: lip_sync — Apply lip-sync to existing video
// ═══════════════════════════════════════════════════
server.tool(
  'lip_sync',
  'Apply lip-sync to an existing video using audio. Video: 2-10s, mp4/mov, 720-1080p. Audio: mp3/wav/m4a/aac, max 5MB.',
  {
    video_url: z.string().optional().describe('URL to video'),
    video_id: z.string().optional().describe('Kling task_id of a previous video'),
    audio_path: z.string().describe('Path to audio file'),
    save_as: z.string().optional(),
    wait: z.boolean().default(true),
  },
  async ({ video_url, video_id, audio_path, save_as, wait }) => {
    try {
      if (!existsSync(audio_path)) return { content: [{ type: 'text', text: `❌ Audio not found: ${audio_path}` }] };

      const audioBuffer = readFileSync(audio_path);
      const audioBase64 = audioBuffer.toString('base64');

      // Build request manually since kling-api may not have lip-sync wrapper
      const input = { mode: 'audio2video', audio_type: 'file', audio_file: audioBase64 };
      if (video_id) input.video_id = video_id;
      else if (video_url) input.video_url = video_url;

      const result = await api.client.request('POST', '/v1/videos/lip-sync', { input });
      const taskId = result?.data?.task_id;
      if (!taskId) return { content: [{ type: 'text', text: `❌ No task_id: ${JSON.stringify(result).slice(0, 500)}` }] };
      if (!wait) return { content: [{ type: 'text', text: `✅ Lip-sync task: ${taskId}` }] };

      // Poll lip-sync
      const start = Date.now();
      while (Date.now() - start < 900000) {
        const r = await api.client.request('GET', `/v1/videos/lip-sync/${taskId}`);
        if (r?.data?.task_status === 'succeed') {
          const url = r?.data?.task_result?.videos?.[0]?.url;
          if (url) {
            const outPath = path.join(AVATAR_DIR, save_as || `lipsync-${taskId}.mp4`);
            download(url, outPath);
            return { content: [{ type: 'text', text: `🎭 Lip-synced! ${getDuration(outPath).toFixed(1)}s\nSaved: ${outPath}` }] };
          }
        }
        if (r?.data?.task_status === 'failed') return { content: [{ type: 'text', text: `❌ Failed: ${JSON.stringify(r?.data).slice(0, 300)}` }] };
        await new Promise(r => setTimeout(r, 15000));
      }
      return { content: [{ type: 'text', text: `❌ Timed out` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: direct_scene — THE HOLLYWOOD PIPELINE
// Generate image → Animate → Create avatar (lip-sync)
// ═══════════════════════════════════════════════════
server.tool(
  'direct_scene',
  `FULL HOLLYWOOD PIPELINE for a presenter scene:
Step 1: Generate AI image of presenter in cinematic setting/pose/angle
Step 2: Create lip-synced talking head avatar from image + audio
Returns the final cinema-quality presenter clip with natural movement.`,
  {
    scene_id: z.string().describe('Scene identifier'),
    beat: z.enum(['intrigue', 'teach', 'concept', 'awe', 'revelation', 'build', 'energy', 'close']).default('teach'),
    audio_path: z.string().describe('Path to audio WAV'),
    custom_image_prompt: z.string().optional().describe('Override auto-generated image prompt'),
    custom_setting: z.string().optional().describe('Override setting'),
    custom_pose: z.string().optional().describe('Override pose'),
    slug: z.string().default('scene').describe('Video slug for naming'),
    reference_image: z.string().optional().describe('Use existing image instead of generating'),
    skip_avatar: z.boolean().default(false).describe('If true, only generate image + animate (no lip-sync)'),
  },
  async ({ scene_id, beat, audio_path, custom_image_prompt, custom_setting, custom_pose, slug, reference_image, skip_avatar }) => {
    try {
      if (!existsSync(audio_path)) return { content: [{ type: 'text', text: `❌ Audio not found: ${audio_path}` }] };
      const audioDur = getDuration(audio_path);
      const log = [`🎬 DIRECTING: ${scene_id} (${beat}) — ${audioDur.toFixed(1)}s`];

      // ── STEP 1: Get or generate keyframe image ──
      let imagePath = reference_image && existsSync(reference_image) ? reference_image : null;

      if (!imagePath) {
        const shots = SHOT_LIBRARY[beat] || SHOT_LIBRARY.teach;
        const shot = { ...shots[0] };
        if (custom_setting) shot.setting = custom_setting;
        if (custom_pose) shot.pose = custom_pose;

        const imgPrompt = custom_image_prompt || buildImagePrompt(shot).prompt;
        log.push(`📸 Step 1: Generating keyframe...`);

        const imgResult = await api.generateImage({ prompt: imgPrompt, negative_prompt: FAYE_IDENTITY.negative, aspect_ratio: '16:9', n: 1, model_name: 'kling-v1' });
        const imgTaskId = imgResult?.data?.task_id;
        if (!imgTaskId) return { content: [{ type: 'text', text: log.join('\n') + `\n❌ Image gen failed` }] };

        const imgCompleted = await pollImage(imgTaskId);
        const imgUrls = extractImageUrls(imgCompleted);
        if (!imgUrls[0]) return { content: [{ type: 'text', text: log.join('\n') + `\n❌ No image URL` }] };

        imagePath = path.join(IMAGE_DIR, `${slug}_${scene_id}_keyframe.png`);
        download(imgUrls[0], imagePath);
        log.push(`✅ Keyframe: ${imagePath}`);
      } else {
        log.push(`📸 Step 1: Using reference: ${imagePath}`);
      }

      if (skip_avatar) {
        // Just animate the image (no lip-sync)
        const shots = SHOT_LIBRARY[beat] || SHOT_LIBRARY.teach;
        const animPrompt = buildAnimationPrompt(shots[0]);
        const duration = audioDur > 7 ? '10' : '5';
        log.push(`🎥 Step 2: Animating (${duration}s)...`);

        const animResult = await api.imageToVideo({ image: imagePath, prompt: animPrompt, duration, mode: 'pro', model_name: 'kling-v2-master', aspect_ratio: '16:9' });
        const animTaskId = animResult?.data?.task_id;
        if (!animTaskId) return { content: [{ type: 'text', text: log.join('\n') + `\n❌ Animation failed` }] };

        const animCompleted = await pollVideo(animTaskId, api.queryImageToVideoTask);
        const animUrl = extractVideoUrl(animCompleted);
        if (!animUrl) return { content: [{ type: 'text', text: log.join('\n') + `\n❌ No animation URL` }] };

        const outPath = path.join(AVATAR_DIR, `${slug}_${scene_id}.mp4`);
        download(animUrl, outPath);
        log.push(`✅ Animated: ${getDuration(outPath).toFixed(1)}s → ${outPath}`);
        return { content: [{ type: 'text', text: log.join('\n') }] };
      }

      // ── STEP 2: Create avatar (image + audio → lip-synced talking head) ──
      log.push(`🎭 Step 2: Creating lip-synced avatar...`);

      const avatarResult = await api.createAvatar({ image: imagePath, sound_file: audio_path });
      const avatarTaskId = avatarResult?.data?.task_id;
      if (!avatarTaskId) {
        log.push(`⚠️ Avatar API failed — falling back to image-to-video animation`);
        // Fallback: animate without lip-sync
        const shots = SHOT_LIBRARY[beat] || SHOT_LIBRARY.teach;
        const animPrompt = buildAnimationPrompt(shots[0]);
        const duration = audioDur > 7 ? '10' : '5';
        const animResult = await api.imageToVideo({ image: imagePath, prompt: animPrompt, duration, mode: 'pro', model_name: 'kling-v2-master', aspect_ratio: '16:9' });
        const animTaskId = animResult?.data?.task_id;
        if (animTaskId) {
          const animCompleted = await pollVideo(animTaskId, api.queryImageToVideoTask);
          const animUrl = extractVideoUrl(animCompleted);
          if (animUrl) {
            const outPath = path.join(AVATAR_DIR, `${slug}_${scene_id}.mp4`);
            download(animUrl, outPath);
            log.push(`✅ Animated (no lip-sync): ${getDuration(outPath).toFixed(1)}s → ${outPath}`);
          }
        }
        return { content: [{ type: 'text', text: log.join('\n') }] };
      }

      const avatarCompleted = await pollVideo(avatarTaskId, api.queryAvatarTask);
      const avatarUrl = extractVideoUrl(avatarCompleted);
      if (!avatarUrl) {
        log.push(`❌ Avatar completed but no URL`);
        return { content: [{ type: 'text', text: log.join('\n') }] };
      }

      const finalPath = path.join(AVATAR_DIR, `${slug}_${scene_id}.mp4`);
      download(avatarUrl, finalPath);
      const finalDur = getDuration(finalPath);
      log.push(`✅ Avatar: ${finalDur.toFixed(1)}s → ${finalPath}`);
      log.push(`🏆 FINAL: ${finalPath}`);

      return { content: [{ type: 'text', text: log.join('\n') }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: check_task
// ═══════════════════════════════════════════════════
server.tool(
  'check_task',
  'Poll/download any Kling task.',
  {
    task_id: z.string(),
    task_type: z.enum(['text2video', 'image2video', 'avatar', 'lip-sync', 'image']).default('text2video'),
    save_as: z.string().optional(),
    wait: z.boolean().default(false),
  },
  async ({ task_id, task_type, save_as, wait }) => {
    try {
      const queryFns = {
        'text2video': api.queryTextToVideoTask,
        'image2video': api.queryImageToVideoTask,
        'avatar': api.queryAvatarTask,
        'lip-sync': async (id) => api.client.request('GET', `/v1/videos/lip-sync/${id}`),
        'image': api.queryImageGenTask,
      };
      const fn = queryFns[task_type];

      let result;
      if (wait && task_type !== 'image') {
        result = await pollVideo(task_id, fn);
      } else if (wait && task_type === 'image') {
        result = await pollImage(task_id);
      } else {
        result = await fn.call(api, task_id);
      }

      const status = result?.data?.task_status;
      const videos = result?.data?.task_result?.videos;
      const images = result?.data?.task_result?.images;

      if (status === 'succeed' && videos?.[0]?.url) {
        if (save_as) {
          const dir = ['avatar', 'lip-sync'].includes(task_type) ? AVATAR_DIR : BROLL_DIR;
          const outPath = path.join(dir, save_as);
          download(videos[0].url, outPath);
          return { content: [{ type: 'text', text: `✅ ${getDuration(outPath).toFixed(1)}s → ${outPath}` }] };
        }
        return { content: [{ type: 'text', text: `✅ URL: ${videos[0].url}` }] };
      }

      if (status === 'succeed' && images?.[0]?.url) {
        if (save_as) {
          const outPath = path.join(IMAGE_DIR, save_as);
          download(images[0].url, outPath);
          return { content: [{ type: 'text', text: `✅ Image: ${outPath}` }] };
        }
        return { content: [{ type: 'text', text: `✅ Image URL: ${images[0].url}` }] };
      }

      return { content: [{ type: 'text', text: `⏳ ${status}\n${JSON.stringify(result?.data).slice(0, 500)}` }] };
    } catch (e) { return { content: [{ type: 'text', text: `❌ ${e.message}` }] }; }
  }
);

// ═══════════════════════════════════════════════════
// TOOL: shot_library
// ═══════════════════════════════════════════════════
server.tool(
  'shot_library',
  'View the Hollywood shot library — camera angles, settings, poses for each beat.',
  { beat: z.enum(['intrigue', 'teach', 'concept', 'awe', 'revelation', 'build', 'energy', 'close', 'all']).default('all') },
  async ({ beat }) => {
    const beats = beat === 'all' ? Object.keys(SHOT_LIBRARY) : [beat];
    const lines = ['🎬 HOLLYWOOD SHOT LIBRARY\n'];
    for (const b of beats) {
      const shots = SHOT_LIBRARY[b] || [];
      lines.push(`━━ ${b.toUpperCase()} ━━`);
      for (let i = 0; i < shots.length; i++) {
        const s = shots[i];
        lines.push(`  ${i+1}. ${s.angle} | ${s.setting.slice(0, 60)}...`);
        lines.push(`     Motion: ${s.motion} | Pose: ${s.pose.slice(0, 50)}...`);
      }
      lines.push('');
    }
    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);

// ── START ──
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
