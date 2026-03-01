import React, { useState } from 'react';
import { Download, Figma } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToolbarProps {
  onSetPresetHues: (count: number) => void;
  onOpenExport: () => void;
  onCopyFigma: () => void;
  figmaCopyState: 'idle' | 'done';
  onClearAll?: () => void; // Optional: if we want to add a clear all button later
}

export function Toolbar({ onSetPresetHues, onOpenExport, onCopyFigma, figmaCopyState }: ToolbarProps) {
  const [activePreset, setActivePreset] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      
      {/* Left: Palette Generators */}
      <div className="flex items-center gap-4">
        <span className="text-[0.9rem] font-semibold tracking-tight text-slate-500">Auto-Generate:</span>
        <div className="flex rounded-xl border border-slate-200 bg-slate-100/90 p-0.5">
          {[8, 12, 24].map((count) => (
            <button
              key={count}
              onClick={() => {
                setActivePreset(count);
                onSetPresetHues(count);
              }}
              className={cn(
                'min-w-[6.9rem] rounded-[0.8rem] px-4 py-2 text-[0.9rem] font-semibold tracking-tight transition-all duration-200 focus:outline-none',
                activePreset === count
                  ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-800'
              )}
            >
              {count} Hues
            </button>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCopyFigma}
          className={cn(
            'flex min-w-[10.5rem] items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors shadow-sm',
            figmaCopyState === 'done'
              ? 'border-lime-300 bg-lime-50 text-lime-800 hover:bg-lime-100'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          <Figma className="h-4 w-4" />
          {figmaCopyState === 'done' ? 'Copied' : 'Copy SVG'}
        </button>
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
