import type { ColorStep, HueConfig } from '@/utils/types';

export type ExportFormat = 'css' | 'tailwind' | 'tailwind4' | 'tokens' | 'svg';

export interface ExportBundle {
  css: string;
  tailwind: string;
  tailwind4: string;
  tokens: string;
  svg: string;
}

type Palette = HueConfig & { colors: ColorStep[] };

export function buildExportBundle(palettes: Palette[], baseScale: number[]): ExportBundle {
  return {
    css: buildCssExport(palettes, baseScale),
    tailwind: buildTailwindExport(palettes, baseScale),
    tailwind4: buildTailwind4Export(palettes, baseScale),
    tokens: buildTokensExport(palettes, baseScale),
    svg: buildSvgExport(palettes, baseScale),
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

function buildSvgExport(palettes: Palette[], baseScale: number[]): string {
  const layout = {
    canvasPadding: 32,
    headerGap: 24,
    headerTitleSize: 28,
    headerMetaSize: 14,
    columnWidth: 136,
    columnGap: 16,
    columnTitleHeight: 28,
    columnInnerGap: 10,
    swatchGap: 8,
    swatchHeight: 72,
    swatchRadius: 10,
    swatchPaddingX: 10,
    swatchPaddingTop: 10,
    swatchFontSize: 11,
  };

  const columnsWidth =
    palettes.length * layout.columnWidth + Math.max(0, palettes.length - 1) * layout.columnGap;
  const headerHeight = 76;
  const columnHeight =
    layout.columnTitleHeight +
    layout.columnInnerGap +
    baseScale.length * layout.swatchHeight +
    Math.max(0, baseScale.length - 1) * layout.swatchGap;
  const width = layout.canvasPadding * 2 + columnsWidth;
  const height = layout.canvasPadding * 2 + headerHeight + layout.headerGap + columnHeight;

  const headerX = layout.canvasPadding;
  const headerY = layout.canvasPadding + layout.headerTitleSize;
  const columnsTop = layout.canvasPadding + headerHeight + layout.headerGap;
  const metaText = `${palettes.length} palettes · ${baseScale.length} steps · Base scale [${baseScale.join(', ')}]`;

  const columnSvg = palettes
    .map((palette, paletteIndex) => {
      const columnX = layout.canvasPadding + paletteIndex * (layout.columnWidth + layout.columnGap);
      const swatches = palette.colors
        .map((color, colorIndex) => {
          const y =
            columnsTop +
            layout.columnTitleHeight +
            layout.columnInnerGap +
            colorIndex * (layout.swatchHeight + layout.swatchGap);
          const textColor = color.contrastWhite >= color.contrastBlack ? '#FFFFFF' : '#111827';

          return [
            `<rect x="${columnX}" y="${y}" width="${layout.columnWidth}" height="${layout.swatchHeight}" rx="${layout.swatchRadius}" fill="${color.hex}" />`,
            `<text x="${columnX + layout.swatchPaddingX}" y="${y + layout.swatchPaddingTop + 11}" fill="${textColor}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${layout.swatchFontSize}" xml:space="preserve">${escapeXml(String(color.step))}</text>`,
            `<text x="${columnX + layout.swatchPaddingX}" y="${y + layout.swatchPaddingTop + 28}" fill="${textColor}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${layout.swatchFontSize}" xml:space="preserve">${escapeXml(color.hex.toUpperCase())}</text>`,
          ].join('');
        })
        .join('');

      return [
        `<text x="${columnX}" y="${columnsTop + 18}" fill="#111827" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14">${escapeXml(toKebabCase(palette.name).replace(/-/g, ' '))}</text>`,
        swatches,
      ].join('');
    })
    .join('');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">`,
    `<rect width="${width}" height="${height}" fill="#F5F5F5" />`,
    `<text x="${headerX}" y="${headerY}" fill="#111827" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${layout.headerTitleSize}" font-weight="500">Hue Forge Tokens Palette</text>`,
    `<text x="${headerX}" y="${headerY + 28}" fill="#6B7280" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${layout.headerMetaSize}">${escapeXml(metaText)}</text>`,
    columnSvg,
    `</svg>`,
  ].join('');
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
    case 'svg':
      return 'svg';
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
    case 'svg':
      return 'SVG / Figma';
  }
}
