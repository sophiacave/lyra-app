#!/usr/bin/env node
/**
 * Like One Studio — Upgrade All (V3)
 * One command to re-render all videos with latest style.
 *
 * Usage:
 *   node studio/upgrade-all.js                      # Render all configs
 *   node studio/upgrade-all.js --filter neuron      # Only configs matching "neuron"
 *   node studio/upgrade-all.js --dry-run             # Show what would be rendered
 *   node studio/upgrade-all.js --upload              # Upload to Bunny after render
 *   node studio/upgrade-all.js --force               # Re-render even if up to date
 */
import { execSync } from 'child_process';
import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const CONFIG_DIR = path.join(STUDIO_DIR, '..', 'content', 'configs');
const VIDEO_DIR = path.join(STUDIO_DIR, '..', 'output', 'video');
const RENDER_SCRIPT = path.join(STUDIO_DIR, 'render-lesson-v2.js');
const UPLOAD_SCRIPT = path.join(STUDIO_DIR, 'bunny-upload.js');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const upload = args.includes('--upload');
const force = args.includes('--force');
const filterIdx = args.indexOf('--filter');
const filter = filterIdx >= 0 ? args[filterIdx + 1] : null;

async function main() {
  console.log('\n🎬 LIKE ONE STUDIO — Upgrade All');
  console.log('═'.repeat(50));

  // Find all config files
  const configs = readdirSync(CONFIG_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !filter || f.includes(filter))
    .sort();

  console.log(`📁 Found ${configs.length} configs${filter ? ` (filter: "${filter}")` : ''}`);

  if (dryRun) {
    configs.forEach(c => console.log(`  📄 ${c}`));
    console.log('\n🏁 Dry run — no renders executed.');
    return;
  }

  const results = { success: [], failed: [], skipped: [] };

  for (let i = 0; i < configs.length; i++) {
    const configFile = configs[i];
    const configPath = path.join(CONFIG_DIR, configFile);
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const slug = config.slug || configFile.replace('.json', '');
    const videoPath = path.join(VIDEO_DIR, `${slug}.mp4`);

    console.log(`\n[${i + 1}/${configs.length}] ${config.title || slug}`);

    // Skip if video exists and not forced
    if (!force && existsSync(videoPath)) {
      console.log(`  ⏭️ Video exists — skipping (use --force to re-render)`);
      results.skipped.push(slug);
      continue;
    }

    try {
      const t0 = Date.now();
      execSync(`node "${RENDER_SCRIPT}" "${configPath}"`, {
        stdio: 'inherit',
        timeout: 600000,
        cwd: path.join(STUDIO_DIR, '..'),
      });
      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`  ✅ Rendered in ${elapsed}s`);
      results.success.push(slug);

      // Upload to Bunny if requested
      if (upload && existsSync(videoPath) && existsSync(UPLOAD_SCRIPT)) {
        try {
          console.log(`  ☁️ Uploading to Bunny...`);
          execSync(`node "${UPLOAD_SCRIPT}" "${videoPath}" --title "${config.title}"`, {
            stdio: 'inherit',
            timeout: 120000,
          });
          console.log(`  ☁️ Uploaded`);
        } catch (e) {
          console.error(`  ⚠️ Upload failed: ${e.message?.slice(-100)}`);
        }
      }
    } catch (e) {
      console.error(`  ❌ Render failed: ${e.message?.slice(-200)}`);
      results.failed.push(slug);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 UPGRADE SUMMARY');
  console.log(`  ✅ Success: ${results.success.length}`);
  console.log(`  ❌ Failed:  ${results.failed.length}`);
  console.log(`  ⏭️ Skipped: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log(`\n  Failed configs:`);
    results.failed.forEach(s => console.log(`    - ${s}`));
  }

  console.log('');
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
