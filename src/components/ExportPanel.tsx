import React, { useMemo, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { buildAiExportContent, buildExportBundle, type ExportFormat } from '@/utils/exportFormats';
import type { ColorStep, HueConfig } from '@/utils/types';
import { cn } from '@/utils/cn';

interface ExportPanelProps {
  baseScale: number[];
  onClose: () => void;
  palettes: (HueConfig & { colors: ColorStep[] })[];
}

type ExportPanelFormat = Exclude<ExportFormat, 'svg'>;

const EXPORT_TABS: Array<{ id: ExportPanelFormat; label: string }> = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'tailwind4', label: 'Tailwind 4' },
  { id: 'tokens', label: 'Tokens' },
];

export function ExportPanel({ palettes, baseScale, onClose }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportPanelFormat>('css');
  const [aiMode, setAiMode] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');

  const exports = useMemo(() => buildExportBundle(palettes, baseScale), [palettes, baseScale]);
  const rawContent = exports[activeFormat];
  const effectiveAiMode = aiMode;
  const content = effectiveAiMode
    ? buildAiExportContent(activeFormat, rawContent, palettes, baseScale)
    : rawContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopyState('done');
    window.setTimeout(() => setCopyState('idle'), 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-main/20 backdrop-blur-[2px] px-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-main">Export</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Copy structured palette output for code or direct AI input.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="group relative flex items-center gap-2 h-[2.6rem] pr-5 pl-1.5 rounded-full bg-surface-panel/90 backdrop-blur-md transition-all duration-300 transform active:scale-[0.97] focus:outline-none ring-1 ring-border-default/50 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,1)]"
            >
              <div className={cn(
                "flex items-center justify-center w-[1.9rem] h-[1.9rem] rounded-full transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)] border border-black/5",
                copyState === 'done'
                  ? 'bg-brand-50 text-brand-100'
                  : 'bg-brand-subtle text-brand-main group-hover:bg-brand-muted/50'
              )}>
                <Copy className="w-[1.1rem] h-[1.1rem] stroke-[2px]" />
              </div>
              <span className={cn(
                "text-[0.9rem] font-bold tracking-tight transition-colors duration-300",
                copyState === 'done' ? 'text-brand-active' : 'text-text-main'
              )}>
                {copyState === 'done' ? 'Copied' : 'Copy'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="group relative flex items-center justify-center w-[2.6rem] h-[2.6rem] rounded-full bg-surface-panel/90 backdrop-blur-md transition-all duration-300 transform active:scale-[0.97] focus:outline-none ring-1 ring-border-default/50 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,1)]"
              aria-label="Close export panel"
            >
              <div className="flex items-center justify-center w-[1.9rem] h-[1.9rem] rounded-full bg-surface-base text-text-muted group-hover:text-text-main group-hover:bg-surface-sunken transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] border border-black/5">
                <X className="w-[1.2rem] h-[1.2rem] stroke-[2px]" />
              </div>
            </button>
          </div>
        </div>

        <div className="border-b border-border-subtle px-6">
          <div className="flex gap-8 overflow-x-auto py-4">
            {EXPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormat(tab.id)}
                className={cn(
                  'relative whitespace-nowrap pb-2 text-[2rem] font-semibold tracking-tight transition-colors',
                  activeFormat === tab.id ? 'text-text-main' : 'text-text-secondary hover:text-text-main',
                )}
              >
                {tab.label}
                {activeFormat === tab.id && (
                  <span className="absolute inset-x-0 bottom-0 border-b-2 border-dotted border-text-main" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="border-r border-border-subtle bg-surface-base/70 px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">Usage</h3>
            <div className="mt-4 rounded-2xl border border-border-default bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-text-main">AI Export</div>
                  <div className="mt-1 text-xs leading-5 text-text-secondary">
                    Wrap the current export in AI-friendly instructions.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={effectiveAiMode}
                  onClick={() => setAiMode((value) => !value)}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors border shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] hover:border-border-focus/40 focus:outline-none',
                    effectiveAiMode ? 'bg-brand-muted/80 border-brand-main/30' : 'bg-surface-sunken border-border-default/60',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-[1.3rem] w-[1.3rem] transform rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_6px_-1px_rgba(0,0,0,0.15),inset_0_2px_2px_rgba(255,255,255,1)] border border-black/5',
                      effectiveAiMode ? 'translate-x-[22px] bg-white' : 'translate-x-[3px] bg-surface-panel',
                    )}
                  />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-text-muted">
              <p>Paste the current tab directly into your codebase or into your AI workflow.</p>
              <p>
                <span className="font-medium text-text-main">CSS</span> and <span className="font-medium text-text-main">Tailwind</span> are implementation-first.
              </p>
              <p>
                <span className="font-medium text-text-main">Tokens</span> includes structured metadata for AI parsing, including HSB and contrast data.
              </p>
              <p>
                <span className="font-medium text-text-main">Figma</span> copy lives in the toolbar and writes the current palette board as SVG directly to your clipboard.
              </p>
              {effectiveAiMode && (
                <p className="rounded-xl bg-brand-subtle px-3 py-2 text-xs leading-5 text-brand-hover">
                  AI Export is on. Copy now includes usage instructions plus the raw export payload.
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0 bg-surface-base p-6">
            <pre className="h-[32rem] overflow-auto rounded-3xl border border-border-default bg-text-main px-5 py-4 text-sm leading-6 text-text-muted">
              <code>{content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
