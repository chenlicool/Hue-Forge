import React, { useRef, useState, useEffect } from 'react';
import { HueConfig } from '@/utils/types';
import { cn } from '@/utils/cn';

const TRACK_SIDE_PADDING = 14;

interface HueBarProps {
  hueConfigs: HueConfig[];
  selectedHueId: string | null;
  onSelectHue: (id: string) => void;
  onUpdateHue: (id: string, hue: number) => void;
  onAddHue: (hue: number) => void;
}

export function HueBar({
  hueConfigs,
  selectedHueId,
  onSelectHue,
  onUpdateHue,
  onAddHue,
}: HueBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragConstraints, setDragConstraints] = useState<{ min: number; max: number } | null>(null);

  // Use a ref for the callback to avoid effect dependency issues
  const onUpdateHueRef = useRef(onUpdateHue);
  useEffect(() => {
    onUpdateHueRef.current = onUpdateHue;
  }, [onUpdateHue]);

  // Auto-scroll to selected hue is handled in MatrixBoard now


  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // Calculate constraints based on neighbors
    // Only consider color configs (not gray or accent-gray) for constraints
    const colorConfigs = hueConfigs.filter(c => c.id !== 'gray' && c.id !== 'accent-gray');
    const sortedConfigs = [...colorConfigs].sort((a, b) => a.hue - b.hue);
    
    if (id === 'accent-gray' || id === 'gray') {
      setDragConstraints({ min: 0, max: 360 });
    } else {
      const currentIndex = sortedConfigs.findIndex(c => c.id === id);
      if (currentIndex !== -1) {
        // Find neighbors. If first, min is 0. If last, max is 360.
        const prevHue = currentIndex > 0 ? sortedConfigs[currentIndex - 1].hue : 0;
        const nextHue = currentIndex < sortedConfigs.length - 1 ? sortedConfigs[currentIndex + 1].hue : 360;
        
        setDragConstraints({ min: prevHue, max: nextHue });
      }
    }

    setIsDragging(id);
    onSelectHue(id);
  };

  const handleBarClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const innerWidth = Math.max(1, rect.width - TRACK_SIDE_PADDING * 2);
    const x = clampPosition(e.clientX - rect.left, TRACK_SIDE_PADDING, rect.width - TRACK_SIDE_PADDING);
    const hue = Math.round(((x - TRACK_SIDE_PADDING) / innerWidth) * 360);
    
    // Ensure hue is within 0-360
    const clampedHue = Math.max(0, Math.min(360, hue));
    onAddHue(clampedHue);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !barRef.current) return;

      const rect = barRef.current.getBoundingClientRect();
      const innerWidth = Math.max(1, rect.width - TRACK_SIDE_PADDING * 2);
      let x = e.clientX - rect.left;
      
      // Clamp x
      x = clampPosition(x, TRACK_SIDE_PADDING, rect.width - TRACK_SIDE_PADDING);
      
      let hue = Math.round(((x - TRACK_SIDE_PADDING) / innerWidth) * 360);
      
      // Apply constraints if they exist
      if (dragConstraints) {
        hue = Math.max(dragConstraints.min, Math.min(dragConstraints.max, hue));
      }

      onUpdateHueRef.current(isDragging, hue);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setDragConstraints(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragConstraints]);

  return (
    <div className="w-full h-16 relative select-none">
      {/* Gradient Bar */}
      <div 
        ref={barRef}
        className="absolute inset-x-0 top-4 h-8 cursor-crosshair"
        role="presentation"
        style={{
        }}
        onClick={handleBarClick}
      >
        <div
          className="h-full"
          style={{
            width: `calc(100% - ${TRACK_SIDE_PADDING * 2}px)`,
            marginLeft: `${TRACK_SIDE_PADDING}px`,
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), 
              hsl(60, 100%, 50%), 
              hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), 
              hsl(240, 100%, 50%), 
              hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%)
            )`
          }}
        />
      </div>

      {/* Handles Container - positioned to overlay the bottom edge */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {hueConfigs.filter(c => c.id !== 'gray').map((config) => (
          <div
            key={config.id}
            className={cn(
              "absolute top-0 h-full w-0 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing group z-10 hover:z-20",
              config.id === 'accent-gray' ? "justify-start pt-0.5" : "justify-end pb-0.5",
              isDragging === config.id ? "z-30" : ""
            )}
            style={{
              left: `calc(${TRACK_SIDE_PADDING}px + ((100% - ${TRACK_SIDE_PADDING * 2}px) * ${config.hue / 360}))`,
            }}
            onMouseDown={(e) => handleMouseDown(e, config.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {config.id === 'accent-gray' ? (
              <>
                <div 
                  className={cn(
                    "w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-100",
                    selectedHueId === config.id ? "scale-110 ring-2 ring-blue-500" : "hover:scale-110",
                  )}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${config.hue}, 100%, 50%)` }} />
                </div>
                <div className="h-4 w-px bg-slate-300" />
              </>
            ) : (
              <>
                <div className="h-4 w-px bg-slate-300" />
                <div 
                  className={cn(
                    "w-5 h-5 bg-white rounded-md shadow-md flex items-center justify-center transition-transform duration-100",
                    selectedHueId === config.id ? "scale-110 ring-2 ring-blue-500" : "hover:scale-110",
                  )}
                >
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `hsl(${config.hue}, 100%, 50%)` }} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function clampPosition(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
