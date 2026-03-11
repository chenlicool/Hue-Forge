import React, { useState } from 'react';
import { Download, Figma, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToolbarProps {
  onSetPresetHues: (count: number) => void;
  onOpenExport: () => void;
  onCopyFigma: () => void;
  figmaCopyState: 'idle' | 'done';
  onClearAll?: () => void; // Optional: if we want to add a clear all button later
}

export function Toolbar({ onSetPresetHues, onOpenExport, onCopyFigma, figmaCopyState }: ToolbarProps) {
  const [activePreset, setActivePreset] = useState<number | null>(12);

  const presets = [8, 12, 24];
  const activeIndex = activePreset ? presets.indexOf(activePreset) : -1;

  return (
    <div className="flex items-center justify-between px-8 h-[80px] bg-transparent border-b border-border-default/80 relative z-20">
      
      {/* Left: Palette Generators */}
      <div className="flex items-center gap-5">
        <span className="text-[0.95rem] font-bold tracking-tight text-text-muted">Auto-Generate:</span>
        {/* Soft UI Track */}
        <div className="relative flex items-center rounded-full bg-surface-base/80 p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.7)] border border-border-default/60 backdrop-blur-md">
          {/* Sliding Glossy Thumb */}
          {activeIndex !== -1 && (
            <div 
              className="absolute left-[5px] top-[5px] h-[calc(100%-10px)] w-[6.9rem] rounded-full bg-surface-panel shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] border border-border-default/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
          )}

          {presets.map((count) => (
            <button
              key={count}
              onClick={() => {
                setActivePreset(count);
                onSetPresetHues(count);
              }}
              className={cn(
                'relative z-10 flex items-center justify-center w-[6.9rem] h-[2.2rem] rounded-full text-[0.95rem] font-bold tracking-tight transition-all duration-300 focus:outline-none',
                activePreset === count
                  ? 'text-text-main'
                  : 'text-text-muted hover:text-text-secondary hover:bg-black/[0.03]'
              )}
            >
              {count} Hues
            </button>
          ))}
        </div>
      </div>

      {/* Right: Soft UI Actions */}
      <div className="flex items-center gap-4">
        {/* Copy SVG Pill */}
        <button
          onClick={onCopyFigma}
          className="group relative flex items-center gap-3 h-[2.8rem] pr-6 pl-2 rounded-full bg-surface-panel/90 backdrop-blur-md transition-all duration-300 transform active:scale-[0.97] focus:outline-none outline-none ring-1 ring-border-default/50 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,1)]"
        >
          {/* Inner Icon Circle Container */}
          <div className={cn(
            "flex items-center justify-center w-[2.1rem] h-[2.1rem] rounded-full transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)] border border-black/5",
            figmaCopyState === 'done' 
              ? 'bg-brand-50 text-brand-100'
              : 'bg-brand-subtle text-brand-main group-hover:bg-brand-muted/50'
          )}>
            {figmaCopyState === 'done' ? <Check className="w-5 h-5 stroke-[2.5px]" /> : <Figma className="w-5 h-5 stroke-[2px]" />}
          </div>
          <span className={cn(
            "text-[1rem] font-bold tracking-tight transition-colors duration-300",
            figmaCopyState === 'done' ? 'text-brand-active' : 'text-text-main'
          )}>
            {figmaCopyState === 'done' ? 'Copied' : 'Copy SVG'}
          </span>
        </button>

        {/* Export Pill */}
        <button
          onClick={onOpenExport}
          className="group relative flex items-center gap-3 h-[2.8rem] pr-6 pl-2 rounded-full bg-surface-panel/90 backdrop-blur-md transition-all duration-300 transform active:scale-[0.97] focus:outline-none outline-none ring-1 ring-border-default/50 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,1)]"
        >
          {/* Inner Icon Circle Container */}
          <div className="flex items-center justify-center w-[2.1rem] h-[2.1rem] rounded-full bg-surface-base text-text-muted group-hover:text-text-main group-hover:bg-surface-sunken transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] border border-black/5">
            <Download className="w-[1.2rem] h-[1.2rem] stroke-[2px]" />
          </div>
          <span className="text-[1rem] font-bold tracking-tight text-text-main">
            Export
          </span>
        </button>
      </div>
    </div>
  );
}
