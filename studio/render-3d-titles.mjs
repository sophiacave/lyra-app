#!/usr/bin/env node
/**
 * Render 3D Title Cards — Bridge between Remotion Three.js and compose-v4.js
 *
 * Reads a screenplay JSON, finds all 'title' type scenes, and renders each
 * as an MP4 segment using CinematicTitle3D. The output files are placed where
 * compose-v4.js expects them (output/gfx/), so the FFmpeg pipeline picks
 * them up automatically as video segments instead of static PNGs.
 *
 * Usage: node studio/render-3d-titles.mjs studio/screenplays/what-is-a-neuron-v5.json
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REMOTION_ENTRY = path.join(__dirname, "remotion", "src", "index.ts");
const ROOT = path.join(__dirname, "..");
const GFX_DIR = path.join(ROOT, "output", "graphics");

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

async function main() {
  const spPath = process.argv[2];
  if (!spPath) {
    console.error("Usage: node studio/render-3d-titles.mjs <screenplay.json>");
    process.exit(1);
  }

  const sp = JSON.parse(readFileSync(spPath, "utf-8"));
  const slug = slugify(sp.title);
  const titleScenes = sp.scenes.filter((s) => s.type === "title");

  if (titleScenes.length === 0) {
    console.log("No title scenes found in screenplay.");
    return;
  }

  console.log(
    `🎬 Found ${titleScenes.length} title scene(s) in "${sp.title}"`
  );

  // Ensure output dir
  if (!existsSync(GFX_DIR)) mkdirSync(GFX_DIR, { recursive: true });

  // Bundle once, render all titles
  console.log("📦 Bundling Remotion project...");
  const bundleLocation = await bundle({
    entryPoint: REMOTION_ENTRY,
    webpackOverride: (config) => config,
  });

  for (const scene of titleScenes) {
    const durationS = scene.duration_s || 5;
    const durationFrames = Math.round(durationS * 30);
    // Output as video (not PNG) — compose-v4.js checks for video before PNG
    const outFile = path.join(GFX_DIR, `${slug}_${scene.id}.mp4`);

    if (existsSync(outFile)) {
      console.log(`  ⏭️  ${scene.id}: cached at ${outFile}`);
      continue;
    }

    const inputProps = {
      title: scene.dialogue || scene.id,
      subtitle: scene.text_overlay?.text || undefined,
      beat: scene.beat || "hook",
      fps: 30,
    };

    console.log(
      `  🎥 Rendering ${scene.id} (${durationS}s) — "${inputProps.title}"`
    );

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "CinematicTitle",
      inputProps,
    });

    // Override duration to match screenplay scene duration
    await renderMedia({
      composition: { ...composition, durationInFrames: durationFrames },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outFile,
      inputProps,
      chromiumOptions: { gl: "angle" },
      concurrency: 1,
      // Match compose-v4 quality settings
      crf: 18,
    });

    console.log(`  ✅ ${scene.id} → ${outFile}`);
  }

  console.log(`\n🎉 All title cards rendered to ${GFX_DIR}/`);
  console.log(
    "   compose-v4.js will pick these up automatically as video segments."
  );
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
