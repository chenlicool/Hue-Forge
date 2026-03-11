import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { ColorStep, HueConfig } from '@/utils/types';
import { Trash2, Check, Copy } from 'lucide-react';

const BASE_TRACK_PADDING = 14;

interface BaseScaleRailProps {
  values: number[];
  onAddStep: (value: number) => void;
  onRemoveStep: (index: number) => void;
  onUpdateStepValue: (index: number, value: number) => void;
}

function BaseScaleRail({ values, onAddStep, onRemoveStep, onUpdateStepValue }: BaseScaleRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (trackRef.current?.contains(event.target as Node)) {
        return;
      }
      setSelectedIndex(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (draggingIndex === null || !trackRef.current) {
        return;
      }

      const brightness = getBrightnessFromClientY(trackRef.current, event.clientY);
      const constrained = clampBrightnessForIndex(values, draggingIndex, brightness);
      onUpdateStepValue(draggingIndex, constrained);
    };

    const handleMouseUp = () => {
      setDraggingIndex(null);
    };

    if (draggingIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex, onUpdateStepValue, values]);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= values.length) {
      setSelectedIndex(null);
    }
  }, [selectedIndex, values.length]);

  return (
    <div className="flex flex-1 flex-col bg-surface-base py-4 pr-3" style={{ paddingLeft: BASE_TRACK_PADDING }}>
      <div className="flex h-full flex-1 items-stretch justify-start">
        <div
          ref={trackRef}
          className="relative h-full w-[66px] cursor-crosshair rounded-2xl ring-[3px] ring-white bg-[linear-gradient(180deg,#f5f5f5_0%,#e8e8e8_16%,#d3d3d3_34%,#b3b3b3_52%,#8f8f8f_70%,#5f5f5f_87%,#262626_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.78)]"
          onClick={(event) => {
            if (!trackRef.current || draggingIndex !== null) {
              return;
            }
            const brightness = getBrightnessFromClientY(trackRef.current, event.clientY);
            onAddStep(brightness);
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/45" />

          {values.map((brightness, index) => {
            const isActive = selectedIndex === index || draggingIndex === index;

            return (
              <div
                key={`base-point-${index}`}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: `calc(${BASE_TRACK_PADDING}px + (100% - ${BASE_TRACK_PADDING * 2}px) * ${(100 - brightness) / 100} - 10px)`,
                }}
              >
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    setSelectedIndex(index);
                    setDraggingIndex(index);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={cn(
                    'relative flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                    isActive
                      ? 'border-text-main bg-white shadow-sm shadow-border-focus/50'
                      : 'border-white/80 bg-white/95 shadow-sm shadow-border-default/50 hover:scale-105',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: `hsl(0 0% ${brightness}%)` }}
                  />
                </button>

                {/* Right Tooltip showing current value */}
                {isActive && (
                  <div className="absolute left-8 top-1/2 min-w-[4.6rem] -translate-y-1/2 rounded-2xl border-none bg-white/96 px-3 py-2 text-left shadow-sm shadow-border-default/50 backdrop-blur-sm">
                    <div className="text-lg font-semibold leading-none text-text-main">{brightness}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                      Brightness
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStep(index);
                        setSelectedIndex((current) => (current === index ? null : current));
                      }}
                      className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-base text-text-secondary transition-colors hover:bg-error-main/20 hover:text-error-main"
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface MatrixBoardProps {
  palettes: (HueConfig & { colors: ColorStep[] })[];
  selectedHueId: string | null;
  onSelectHue: (id: string) => void;
  onColorClick: (hueId: string, stepIndex: number) => void;
  activeStepIndex: number | null;
  onRemoveHue: (id: string) => void;
  
  // Base Scale Props
  baseScale: number[];
  onAddStep: (value: number) => void;
  onRemoveStep: (index: number) => void;
  onUpdateStepValue: (index: number, value: number) => void;
  onUpdateHueName: (id: string, name: string) => void;
}

export function MatrixBoard({ 
  palettes, 
  selectedHueId, 
  onSelectHue, 
  onColorClick, 
  activeStepIndex, 
  onRemoveHue,
  baseScale,
  onAddStep,
  onRemoveStep,
  onUpdateStepValue,
  onUpdateHueName
}: MatrixBoardProps) {

  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedColRef = React.useRef<HTMLDivElement>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  useEffect(() => {
    if (selectedColRef.current && containerRef.current) {
      const container = containerRef.current;
      const col = selectedColRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const colRect = col.getBoundingClientRect();
      
      // Check if column is out of view
      if (colRect.left < containerRect.left + 96 || colRect.right > containerRect.right) {
        // Scroll to center the column
        const scrollLeft = col.offsetLeft - containerRect.width / 2 + colRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedHueId]);

  return (
    <div className="flex flex-1 overflow-hidden bg-surface-base relative">
      {/* Module 1: Base Scale (Fixed Left) */}
      <div className="w-24 shrink-0 bg-surface-panel/60 backdrop-blur-3xl border-r border-border-subtle/50 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center justify-center border-b border-border-subtle/50 relative z-40">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.18em] text-center leading-tight">Base</span>
        </div>
        <BaseScaleRail
          values={baseScale}
          onAddStep={onAddStep}
          onRemoveStep={onRemoveStep}
          onUpdateStepValue={onUpdateStepValue}
        />
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto">
        <div className="flex min-w-max min-h-full">
        
          {/* Module 2 & 3: Palettes */}
          {palettes.filter(p => p.id === 'gray' || p.id === 'accent-gray').map((palette, idx, arr) => {
            const isLastGray = idx === arr.length - 1;
            return (
              <div 
                key={palette.id} 
                ref={selectedHueId === palette.id ? selectedColRef : null}
                className={cn(
                  "flex flex-col w-32 shrink-0 transition-colors bg-white relative",
                  selectedHueId === palette.id ? "bg-accent-subtle/30" : "bg-white",
                  isLastGray ? "border-r-4 border-border-default" : "border-border-subtle"
                )}
                onClick={() => onSelectHue(palette.id)}
              >
                {/* Column Header */}
                <div className="h-16 flex items-center justify-center border-b border-border-subtle/50 relative group/header bg-transparent sticky top-0 z-20">
                  <input
                    type="text"
                    value={palette.name}
                    onChange={(e) => onUpdateHueName(palette.id, e.target.value)}
                    className={cn(
                      "text-sm font-bold bg-transparent text-center w-full focus:outline-none px-2 transition-colors",
                      selectedHueId === palette.id ? "text-text-main" : "text-text-muted"
                    )}
                  />
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHue(palette.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 text-text-muted hover:bg-surface-panel hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,1)] hover:text-error-main rounded-xl opacity-0 group-hover/header:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color Blocks */}
                <div className="flex-1 flex flex-col py-4 gap-4 px-4">
                  {palette.colors.map((color, index) => {
                    const isActive = selectedHueId === palette.id && activeStepIndex === index;
                    
                    // Determine best text color based on contrast
                    const textColor = color.contrastBlack >= color.contrastWhite ? 'black' : 'white';
                    const contrast = color.contrastBlack >= color.contrastWhite ? color.contrastBlack : color.contrastWhite;
                    const wcag = color.contrastBlack >= color.contrastWhite ? color.wcagBlack : color.wcagWhite;

                    return (
                      <div
                        key={color.step}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHue(palette.id);
                          onColorClick(palette.id, index);
                          handleCopy(color.hex);
                        }}
                        className={cn(
                          "flex-1 w-full rounded-2xl cursor-pointer transition-all duration-300 relative group min-h-[3rem]",
                          isActive 
                            ? "ring-[3px] ring-white scale-105 z-10 shadow-[0_12px_32px_-8px_var(--color-accent-main),inset_0_2px_2px_rgba(255,255,255,0.4)]" 
                            : "shadow-[inset_0_2px_2px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.4)]"
                        )}
                        style={{ backgroundColor: color.hex, color: textColor }}
                      >
                        <div className="flex flex-col justify-between h-full p-2 text-[10px] font-medium leading-tight">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs opacity-90">{color.step}</span>
                            <div className="relative font-bold opacity-90 flex items-center justify-end h-[14px] min-w-[20px]">
                              {copiedHex === color.hex ? (
                                <Check className="w-[14px] h-[14px]" />
                              ) : (
                                <>
                                  <span className="block group-hover:opacity-0 transition-opacity duration-200">{wcag}</span>
                                  <Copy className="w-[14px] h-[14px] absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-end opacity-75">
                            <span>B:{Math.round(color.b)}</span>
                            <span>{contrast.toFixed(2)}:1</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Spacer to align with Base Scale's Add Button */}
                  <div className="h-8 shrink-0" />
                </div>
              </div>
            );
          })}

          {palettes
            .filter(p => p.id !== 'gray' && p.id !== 'accent-gray')
            .sort((a, b) => a.hue - b.hue)
            .map((palette) => (
            <div 
              key={palette.id} 
              ref={selectedHueId === palette.id ? selectedColRef : null}
              className={cn(
                "flex flex-col w-32 shrink-0 border-r border-border-subtle transition-colors bg-white",
                selectedHueId === palette.id ? "bg-accent-subtle/30" : "bg-white"
              )}
              onClick={() => onSelectHue(palette.id)}
            >
              {/* Column Header */}
              <div className="h-16 flex items-center justify-center border-b border-border-subtle/50 relative group/header bg-transparent sticky top-0 z-20">
                <input
                  type="text"
                  value={palette.name}
                  onChange={(e) => onUpdateHueName(palette.id, e.target.value)}
                  className={cn(
                    "text-sm font-bold bg-transparent text-center w-full focus:outline-none px-2 transition-colors",
                    selectedHueId === palette.id ? "text-text-main" : "text-text-muted"
                  )}
                />
                
                {/* Delete Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHue(palette.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 text-text-muted hover:bg-surface-panel hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,1)] hover:text-error-main rounded-xl opacity-0 group-hover/header:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color Blocks */}
              <div className="flex-1 flex flex-col py-4 gap-4 px-4">
                {palette.colors.map((color, index) => {
                  const isActive = selectedHueId === palette.id && activeStepIndex === index;
                  
                  // Determine best text color based on contrast
                  const textColor = color.contrastBlack >= color.contrastWhite ? 'black' : 'white';
                  const contrast = color.contrastBlack >= color.contrastWhite ? color.contrastBlack : color.contrastWhite;
                  const wcag = color.contrastBlack >= color.contrastWhite ? color.wcagBlack : color.wcagWhite;

                  return (
                    <div
                      key={color.step}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHue(palette.id);
                        onColorClick(palette.id, index);
                        handleCopy(color.hex);
                      }}
                      className={cn(
                        "flex-1 w-full rounded-2xl cursor-pointer transition-all duration-300 relative group min-h-[3rem]",
                        isActive 
                          ? "ring-[3px] ring-white scale-105 z-10 shadow-[0_12px_32px_-8px_var(--color-accent-main),inset_0_2px_2px_rgba(255,255,255,0.4)]" 
                          : "shadow-[inset_0_2px_2px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.4)]"
                      )}
                      style={{ backgroundColor: color.hex, color: textColor }}
                    >
                      <div className="flex flex-col justify-between h-full p-2 text-[10px] font-medium leading-tight">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs opacity-90">{color.step}</span>
                          <div className="relative font-bold opacity-90 flex items-center justify-end h-[14px] min-w-[20px]">
                            {copiedHex === color.hex ? (
                              <Check className="w-[14px] h-[14px]" />
                            ) : (
                              <>
                                <span className="block group-hover:opacity-0 transition-opacity duration-200">{wcag}</span>
                                <Copy className="w-[14px] h-[14px] absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-end opacity-75">
                          <span>B:{Math.round(color.b)}</span>
                          <span>{contrast.toFixed(2)}:1</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Spacer to align with Base Scale's Add Button */}
                <div className="h-8 shrink-0" />
              </div>
            </div>
          ))}

          {/* Empty State / Add Placeholder */}
          {palettes.length === 0 && (
              <div className="w-64 flex items-center justify-center text-text-muted text-sm font-bold">
                  Add colors from the spectrum above
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getBrightnessFromClientY(track: HTMLDivElement, clientY: number): number {
  const rect = track.getBoundingClientRect();
  const innerHeight = Math.max(1, rect.height - BASE_TRACK_PADDING * 2);
  const y = clampValue(clientY - rect.top, BASE_TRACK_PADDING, rect.height - BASE_TRACK_PADDING);
  const ratio = (y - BASE_TRACK_PADDING) / innerHeight;
  return clampValue(Math.round(100 - ratio * 100), 0, 100);
}

function clampBrightnessForIndex(values: number[], index: number, value: number): number {
  const upperBound = index === 0 ? 100 : values[index - 1] - 1;
  const lowerBound = index === values.length - 1 ? 0 : values[index + 1] + 1;
  return clampValue(value, lowerBound, upperBound);
}

function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
