# CLAUDE.md - Agent Context for JSAppContainer

## Project Overview
**OpenJSCAD Renderer** — an Obsidian plugin that renders 3D JSCAD models inside notes using fenced code blocks (` ```jscad ` or ` ```openjscad `). Mobile-friendly.

## Tech Stack
- **Language**: TypeScript
- **Build**: esbuild (`node esbuild.config.mjs production`)
- **Runtime deps (CDN-loaded in iframe)**:
  - Three.js v0.149.0 (must stay ≤0.149.0 — `examples/js/` was removed in v0.150+)
  - @jscad/modeling v2.12.2
- **Dev deps**: esbuild, TypeScript, obsidian API types

## Project Structure
```
src/main.ts       — Plugin entry point, registers markdown code block processors
src/renderer.ts   — Generates self-contained HTML for the 3D rendering iframe
main.js           — Built output (committed, required for Obsidian plugin loading)
manifest.json     — Obsidian plugin manifest
styles.css        — Obsidian theme integration styles
esbuild.config.mjs — Build configuration
```

## Build & Dev Commands
- `npm run build` — Production build → outputs `main.js`
- `npm run dev` — Dev/watch mode

## Key Architecture Decisions
- **CDN-based loading**: Three.js and JSCAD are loaded from jsDelivr CDN at runtime inside a sandboxed iframe (no bundled heavy deps)
- **Three.js pinned to v0.149.0**: This is the last version that ships `examples/js/controls/OrbitControls.js`. Do NOT upgrade past 0.149.0 without switching to ES module imports
- **Sandboxed iframes**: Rendering happens inside iframes with `allow-scripts` only, for security isolation
- **No plugin settings**: Works out of the box, no configuration UI

## How It Works
1. Plugin registers processors for `jscad` and `openjscad` code blocks
2. `buildRendererHtml()` generates a complete HTML page with inline JS
3. The HTML is loaded into a sandboxed iframe
4. Inside the iframe: CDN scripts load → user JSCAD code evaluates → geometry converts to triangles → Three.js renders

## Common Pitfalls
- Upgrading Three.js past v0.149.0 breaks OrbitControls loading (no `examples/js/` path)
- `main.js` must be committed — Obsidian loads it directly as the plugin entry point
- The 3 release assets needed for BRAT/Obsidian: `main.js`, `manifest.json`, `styles.css`
