import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { HueConfig, ColorStep } from '@/utils/types';
import { getBrightnessThreshold } from '@/utils/color';

interface InsightPanelProps {
  palettes: (HueConfig & { colors: ColorStep[] })[];
  selectedPalette: (HueConfig & { colors: ColorStep[] }) | undefined;
  activeStepIndex: number | null;
  onUpdateCurve: (type: 'saturation' | 'brightness', index: number, value: number) => void;
}

export function InsightPanel({ palettes, selectedPalette, activeStepIndex, onUpdateCurve }: InsightPanelProps) {
  if (!selectedPalette) {
    return (
      <div className="w-80 border-none bg-white/60 backdrop-blur-3xl p-6 flex items-center justify-center text-text-muted text-sm font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
        Select a hue to view insights
      </div>
    );
  }

  const data = selectedPalette.colors.map((c, i) => {
    // Calculate safe zones for this step
    const isLight = c.step <= 40;
    const isDark = c.step >= 70;
    
    let safeMin = 0;
    let safeMax = 100;

    if (isLight) {
        // Must be light enough for black text (AAA = 7)
        safeMin = getBrightnessThreshold(c.h, c.s, 7, 'black');
        safeMax = 100;
    } else if (isDark) {
        // Must be dark enough for white text (AAA = 7)
        safeMin = 0;
        safeMax = getBrightnessThreshold(c.h, c.s, 7, 'white');
    } else {
        // Mid tones (50-60). 
        const maxForWhiteAA = getBrightnessThreshold(c.h, c.s, 4.5, 'white');
        safeMin = 0;
        safeMax = maxForWhiteAA;
    }

    const point: any = {
        step: c.step,
        index: i,
        safeMin,
        safeMax,
        safeRange: [safeMin, safeMax]
    };

    // Add data for all palettes
    palettes.forEach(p => {
      point[`s_${p.id}`] = p.colors[i].s;
      point[`b_${p.id}`] = p.colors[i].b;
    });

    return point;
  });

  const activeColor = activeStepIndex !== null ? selectedPalette.colors[activeStepIndex] : null;
  const tooltipProps = {
    allowEscapeViewBox: { x: true, y: false },
    reverseDirection: { x: false, y: true },
    wrapperStyle: {
      zIndex: 40,
      outline: 'none',
      pointerEvents: 'none',
    },
    contentStyle: {
      backgroundColor: 'rgba(255,255,255,0.98)',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      boxShadow: '0 16px 40px rgba(15,23,42,0.14)',
      fontSize: '12px',
      padding: '10px 12px',
    },
    itemStyle: {
      color: '#4B5563',
      paddingTop: '2px',
      paddingBottom: '2px',
    },
    labelStyle: {
      color: '#111827',
      fontWeight: 600,
      marginBottom: '6px',
    },
    cursor: {
      stroke: '#CBD5E1',
      strokeWidth: 1,
    },
  } as const;

  return (
    <aside className="w-96 bg-white/60 backdrop-blur-3xl flex flex-col h-full overflow-y-auto z-20 shadow-[-12px_0_48px_-12px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] border-l border-white/50">
      <div className="p-6 border-b border-border-subtle/50">
        <h3 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-1">
          {selectedPalette.name} ({selectedPalette.hue}°)
        </h3>
        <p className="text-text-muted text-xs font-semibold">Curve Analysis & Adjustment</p>
      </div>

      {/* Editor Controls */}
      {activeColor && activeStepIndex !== null && (
        <div className="p-6 border-b border-border-subtle/50 bg-white/40">
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-10 h-10 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white"
              style={{ backgroundColor: activeColor.hex }}
            />
            <div>
              <div className="text-[15px] font-mono font-bold text-text-main">{activeColor.hex}</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">Step {activeColor.step}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[13px] font-bold text-text-main">Saturation</label>
                <span className="text-[11px] font-mono font-bold text-text-main bg-surface-panel px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] border border-border-default/40">
                  {Math.round(activeColor.s)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={activeColor.s}
                onChange={(e) => onUpdateCurve('saturation', activeStepIndex, Number(e.target.value))}
                className="range-input-soft"
                style={{ '--range-progress': `${activeColor.s}%` } as React.CSSProperties}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[13px] font-bold text-text-main">Brightness</label>
                <span className="text-[11px] font-mono font-bold text-text-main bg-surface-panel px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] border border-border-default/40">
                  {Math.round(activeColor.b)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={activeColor.b}
                onChange={(e) => onUpdateCurve('brightness', activeStepIndex, Number(e.target.value))}
                className="range-input-soft"
                style={{ '--range-progress': `${activeColor.b}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="flex-1 p-6 space-y-8">
        
        {/* Saturation Curve */}
        <div className="relative h-48 bg-white/50 rounded-[24px] p-4 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white hover:z-20 transition-all">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-4">Saturation Curve</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="step" stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#999" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip {...tooltipProps} />
              {palettes.map(p => {
                const isSelected = p.id === selectedPalette.id;
                return (
                  <Line 
                    key={p.id}
                    type="monotone" 
                    dataKey={`s_${p.id}`} 
                    name={p.name}
                    stroke={isSelected ? '#5E912A' : '#E5E7EB'} 
                    strokeWidth={isSelected ? 2 : 1} 
                    dot={isSelected ? { r: 3, fill: '#5E912A', strokeWidth: 0 } : false} 
                    activeDot={isSelected ? { r: 5, strokeWidth: 0 } : false}
                    isAnimationActive={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Brightness Curve */}
        <div className="relative h-48 bg-white/50 rounded-[24px] p-4 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white hover:z-20 transition-all">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-[0.1em] mb-4">Brightness Curve</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="step" stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#999" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip {...tooltipProps} />
              {/* Safe Zone Area */}
              <Area 
                type="monotone" 
                dataKey="safeRange" 
                stroke="none" 
                fill="#10B981" 
                fillOpacity={0.1} 
              />
              {palettes.map(p => {
                const isSelected = p.id === selectedPalette.id;
                return (
                  <Line 
                    key={p.id}
                    type="monotone" 
                    dataKey={`b_${p.id}`} 
                    name={p.name}
                    stroke={isSelected ? '#F59E0B' : '#E5E7EB'} 
                    strokeWidth={isSelected ? 2 : 1} 
                    dot={isSelected ? { r: 3, fill: '#F59E0B', strokeWidth: 0 } : false} 
                    activeDot={isSelected ? { r: 5, strokeWidth: 0 } : false}
                    isAnimationActive={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </aside>
  );
}
