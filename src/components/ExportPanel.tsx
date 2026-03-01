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

const EXPORT_TABS: Array<{ id: ExportFormat; label: string }> = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'tailwind4', label: 'Tailwind 4' },
  { id: 'tokens', label: 'Tokens' },
];

export function ExportPanel({ palettes, baseScale, onClose }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('css');
  const [aiMode, setAiMode] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');

  const exports = useMemo(() => buildExportBundle(palettes, baseScale), [palettes, baseScale]);
  const rawContent = exports[activeFormat];
  const content = aiMode
    ? buildAiExportContent(activeFormat, rawContent, palettes, baseScale)
    : rawContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopyState('done');
    window.setTimeout(() => setCopyState('idle'), 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px] px-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Export</h2>
            <p className="mt-1 text-sm text-slate-500">
              Copy structured palette output for code or direct AI input.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-500"
            >
              <Copy className="h-4 w-4" />
              {copyState === 'done' ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close export panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-8 overflow-x-auto py-4">
            {EXPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormat(tab.id)}
                className={cn(
                  'relative whitespace-nowrap pb-2 text-[2rem] font-semibold tracking-tight transition-colors',
                  activeFormat === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {tab.label}
                {activeFormat === tab.id && (
                  <span className="absolute inset-x-0 bottom-0 border-b-2 border-dotted border-slate-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="border-r border-slate-200 bg-slate-50/70 px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Usage</h3>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">AI Export</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Wrap the current export in AI-friendly instructions.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={aiMode}
                  onClick={() => setAiMode((value) => !value)}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors',
                    aiMode ? 'bg-lime-500' : 'bg-slate-300',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                      aiMode ? 'translate-x-6' : 'translate-x-1',
                    )}
                  />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Paste the current tab directly into your codebase or into your AI workflow.</p>
              <p>
                <span className="font-medium text-slate-800">CSS</span> and <span className="font-medium text-slate-800">Tailwind</span> are implementation-first.
              </p>
              <p>
                <span className="font-medium text-slate-800">Tokens</span> includes structured metadata for AI parsing, including HSB and contrast data.
              </p>
              {aiMode && (
                <p className="rounded-xl bg-lime-50 px-3 py-2 text-xs leading-5 text-lime-800">
                  AI Export is on. Copy now includes usage instructions plus the raw export payload.
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0 bg-[#F8FAFC] p-6">
            <pre className="h-[32rem] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-sm leading-6 text-slate-100">
              <code>{content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
