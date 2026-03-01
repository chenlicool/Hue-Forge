# Hue Forge

[中文](./README.md) | [English](./README.en.md)

![Hue Forge Cover](docs/cover.svg)

Hue Forge is a color system generator for design systems and brand palette work. It uses HSB curve models and WCAG contrast rules to help you generate, tune, validate, and export production-ready color scales.

## Project Positioning

- Built for design and frontend workflows that need multi-hue, multi-step palette generation
- Brings color generation, readability checks, and code export into one local frontend tool
- Currently implemented as a pure frontend single-page app with no backend dependency

## Core Capabilities

- Generate multi-hue palette matrices with aligned step structures
- Adjust the `Base Scale` plus per-strip saturation and brightness curves
- Review black-on-color and white-on-color contrast with WCAG grades
- Export `CSS`, `Tailwind`, `Tailwind 4`, `Tokens`, and `SVG / Figma`
- Support `AI Export` for copying structured, AI-ready context text

## Quick Start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000`

## Common Commands

```bash
npm run dev
npm run build
npm run lint
npm run check:contrast
```

## GitHub Pages Deployment

This repository already includes a GitHub Pages workflow. You only need one repository setting:

1. Open `Settings -> Pages`
2. Set `Source` to `GitHub Actions`
3. Every push to `main` will then build and deploy automatically

Expected site URL:

```text
https://chenlicool.github.io/Hue-Forge/
```

## Open Source

- This project is currently released under the `MIT License`
- Repository: [chenlicool/Hue-Forge](https://github.com/chenlicool/Hue-Forge)
- License text: [LICENSE](https://github.com/chenlicool/Hue-Forge/blob/main/LICENSE)
- If you connect third-party APIs or external services, their terms and costs are not covered by this repository license

## Workflow

1. Choose or add a hue set from the top toolbar
2. Adjust the overall brightness baseline from the left `Base` rail
3. Select a strip or step and fine-tune saturation and brightness curves
4. Use the contrast feedback panel to verify readability
5. Copy the exported format for direct use in codebases or AI workflows

## Export Example

Hue Forge exports directly from the current palette view instead of maintaining a separate token state. A typical output looks like this:

```css
:root {
  --blue-10: #f3f8ff;
  --blue-20: #dbeafe;
  --blue-30: #bfdbfe;
  --blue-40: #93c5fd;
}
```

```js
export default {
  theme: {
    extend: {
      colors: {
        blue: {
          10: "#f3f8ff",
          20: "#dbeafe",
          30: "#bfdbfe",
          40: "#93c5fd"
        }
      }
    }
  }
}
```

## Repository Structure

- `src/`: frontend source code
- `scripts/`: helper scripts, currently including the contrast check script
- `archive/`: archived backups and legacy files
- `ARCHITECTURE.md`: technical architecture and core flow notes
- `CHANGELOG.md`: version change history

## Environment

- Node.js 18+ (compatibility with lower versions: pending/unknown)
- npm

## Current Status

- The repository has been cleaned up and pushed to GitHub
- GitHub Pages deployment is configured; `Pages -> Source` must be set to `GitHub Actions`
- The `MIT` license and in-app open-source entry points are already in place
- Internal collaboration and planning docs are kept locally and are no longer distributed in the public repository
- The current build passes, but the production bundle still has a size warning that can be optimized later
- Whether `archive/metadata.json` should be kept long-term is still pending/unknown
