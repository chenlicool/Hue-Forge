import type { ColorStep, HueConfig } from '@/utils/types';

export type ExportFormat = 'css' | 'tailwind' | 'tailwind4' | 'tokens';

export interface ExportBundle {
  css: string;
  tailwind: string;
  tailwind4: string;
  tokens: string;
}

type Palette = HueConfig & { colors: ColorStep[] };

export function buildExportBundle(palettes: Palette[], baseScale: number[]): ExportBundle {
  return {
    css: buildCssExport(palettes, baseScale),
    tailwind: buildTailwindExport(palettes, baseScale),
    tailwind4: buildTailwind4Export(palettes, baseScale),
    tokens: buildTokensExport(palettes, baseScale),
  };
}

export function buildAiExportContent(
  format: ExportFormat,
  rawContent: string,
  palettes: Palette[],
  baseScale: number[],
): string {
  const paletteSummary = palettes
    .map((palette) => `${toKebabCase(palette.name)}(${palette.colors.length} steps)`)
    .join(', ');

  const fence = getCodeFence(format);
  const formatLabel = getFormatLabel(format);

  return [
    'Use the following Hue Forge export as the source of truth for adding colors to the project.',
    '',
    `Export format: ${formatLabel}`,
    `Palette count: ${palettes.length}`,
    `Step count: ${baseScale.length}`,
    `Palettes: ${paletteSummary}`,
    `Base scale: [${baseScale.join(', ')}]`,
    '',
    'Requirements:',
    '1. Preserve palette names, step keys, and hex values exactly.',
    '2. Do not invent missing colors or rename token groups unless explicitly requested.',
    '3. If the target project uses tokens, map each palette group directly into its color token namespace.',
    '4. Treat the data below as authoritative over inferred values.',
    '',
    'Data:',
    `\`\`\`${fence}`,
    rawContent,
    '```',
  ].join('\n');
}

function buildCssExport(palettes: Palette[], baseScale: number[]): string {
  const lines = [
    `/* Hue Forge CSS export */`,
    `/* palettes: ${palettes.length}, steps: ${baseScale.length} */`,
    ':root {',
  ];

  for (const palette of palettes) {
    for (const color of palette.colors) {
      lines.push(`  --color-${toKebabCase(palette.name)}-${color.step}: ${color.hex};`);
    }
  }

  lines.push('}');
  lines.push('');
  lines.push('/* base scale */');
  lines.push(':root {');

  baseScale.forEach((value, index) => {
    lines.push(`  --brightness-${(index + 1) * 10}: ${value}%;`);
  });

  lines.push('}');
  return lines.join('\n');
}

function buildTailwindExport(palettes: Palette[], baseScale: number[]): string {
  const colorsBlock = palettes
    .map((palette) => {
      const steps = palette.colors
        .map((color) => `        "${color.step}": "${color.hex}"`)
        .join(',\n');

      return `      "${toKebabCase(palette.name)}": {\n${steps}\n      }`;
    })
    .join(',\n');

  return [
    `// Hue Forge Tailwind export`,
    `// palettes: ${palettes.length}, steps: ${baseScale.length}`,
    'export default {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
    colorsBlock,
    '      }',
    '    }',
    '  }',
    '};',
  ].join('\n');
}

function buildTailwind4Export(palettes: Palette[], baseScale: number[]): string {
  const lines = [
    `/* Hue Forge Tailwind 4 export */`,
    `/* palettes: ${palettes.length}, steps: ${baseScale.length} */`,
    '@theme {',
  ];

  for (const palette of palettes) {
    for (const color of palette.colors) {
      lines.push(`  --color-${toKebabCase(palette.name)}-${color.step}: ${color.hex};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function buildTokensExport(palettes: Palette[], baseScale: number[]): string {
  const tokenDocument = {
    meta: {
      source: 'Hue Forge',
      paletteCount: palettes.length,
      stepCount: baseScale.length,
      baseScale,
    },
    color: Object.fromEntries(
      palettes.map((palette) => [
        toKebabCase(palette.name),
        Object.fromEntries(
          palette.colors.map((color) => [
            String(color.step),
            {
              $type: 'color',
              $value: color.hex,
              extensions: {
                hueForge: {
                  hue: color.h,
                  saturation: color.s,
                  brightness: color.b,
                  contrastBlack: roundMetric(color.contrastBlack),
                  contrastWhite: roundMetric(color.contrastWhite),
                  wcagBlack: color.wcagBlack,
                  wcagWhite: color.wcagWhite,
                },
              },
            },
          ]),
        ),
      ]),
    ),
  };

  return JSON.stringify(tokenDocument, null, 2);
}

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function roundMetric(value: number): number {
  return Number(value.toFixed(2));
}

function getCodeFence(format: ExportFormat): string {
  switch (format) {
    case 'css':
      return 'css';
    case 'tailwind':
    case 'tailwind4':
      return 'ts';
    case 'tokens':
      return 'json';
  }
}

function getFormatLabel(format: ExportFormat): string {
  switch (format) {
    case 'css':
      return 'CSS';
    case 'tailwind':
      return 'Tailwind';
    case 'tailwind4':
      return 'Tailwind 4';
    case 'tokens':
      return 'Tokens';
  }
}
