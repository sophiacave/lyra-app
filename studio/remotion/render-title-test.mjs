#!/usr/bin/env node
/**
 * Test render: CinematicTitle3D composition
 * Renders a single 5-second title card to verify Three.js + Remotion pipeline.
 *
 * Usage: node studio/remotion/render-title-test.mjs
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.join(__dirname, "src", "index.ts");
const OUTPUT = path.join(__dirname, "..", "..", "output", "test-cinematic-title.mp4");

async function main() {
  console.log("📦 Bundling Remotion project...");
  const bundleLocation = await bundle({
    entryPoint: ENTRY,
    webpackOverride: (config) => config,
  });

  const inputProps = {
    title: "What Is a Neuron?",
    subtitle: "Like One • Season 1",
    beat: "hook",
    fps: 30,
  };

  console.log("🎬 Selecting CinematicTitle composition...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "CinematicTitle",
    inputProps,
  });

  console.log(`📐 Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`);

  console.log("🎥 Rendering (gl=angle, concurrency=1 for WebGL stability)...");
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: OUTPUT,
    inputProps,
    // Three.js needs WebGL — angle backend + single tab avoids context exhaustion
    chromiumOptions: {
      gl: "angle",
    },
    concurrency: 1,
  });

  console.log(`✅ Rendered to ${OUTPUT}`);
}

main().catch((err) => {
  console.error("❌ Render failed:", err.message);
  process.exit(1);
});
