import React, { useState } from 'react';
import { useColorSystem } from '@/hooks/useColorSystem';
import { TopBar } from '@/components/TopBar';
import { HueBar } from '@/components/HueBar';
import { MatrixBoard } from '@/components/MatrixBoard';
import { InsightPanel } from '@/components/InsightPanel';
import { Toolbar } from '@/components/Toolbar';
import { ExportPanel } from '@/components/ExportPanel';
import { AppFooter } from '@/components/AppFooter';
import { buildExportBundle } from '@/utils/exportFormats';

export default function App() {
  const {
    hueConfigs,
    selectedHueId,
    setSelectedHueId,
    generatePalette,
    addHue,
    removeHue,
    updateHueConfig,
    updateCurvePoint,
    setPresetHues,
    baseScale,
    addStep,
    removeStep,
    updateStepValue
  } = useColorSystem();

  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [figmaCopyState, setFigmaCopyState] = useState<'idle' | 'done'>('idle');

  const handleSelectHue = (id: string) => {
    setSelectedHueId(id);
    setActiveStepIndex(null);
  };

  const palettes = generatePalette;
  const selectedPalette = palettes.find(p => p.id === selectedHueId);

  const handleCopyFigma = async () => {
    const svgContent = buildExportBundle(palettes, baseScale).svg;

    if ('ClipboardItem' in window) {
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const textBlob = new Blob([svgContent], { type: 'text/plain' });
      await navigator.clipboard.write([new ClipboardItem({ 'image/svg+xml': svgBlob, 'text/plain': textBlob })]);
    } else {
      await navigator.clipboard.writeText(svgContent);
    }

    setFigmaCopyState('done');
    window.setTimeout(() => setFigmaCopyState('idle'), 1200);
  };

  return (
    <div className="flex h-screen flex-col bg-surface-base relative text-text-main font-sans overflow-hidden">
      {/* Background Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-border-default) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-default) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
        }}
        aria-hidden="true"
      />

      {/* 1. Branding Header */}
      <TopBar />

      {/* 2. Action Toolbar */}
      <Toolbar
        onSetPresetHues={setPresetHues}
        onOpenExport={() => setIsExportOpen(true)}
        onCopyFigma={handleCopyFigma}
        figmaCopyState={figmaCopyState}
      />

      {/* 3. Hue Spectrum Input */}
      <div className="relative z-30 bg-surface-panel/80 backdrop-blur-3xl shadow-[0_12px_48px_-12px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] border-b border-border-subtle/50">
        <HueBar
          hueConfigs={hueConfigs}
          selectedHueId={selectedHueId}
          onSelectHue={handleSelectHue}
          onUpdateHue={(id, hue) => updateHueConfig(id, { hue })}
          onAddHue={addHue}
        />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 4. Main Matrix Output */}
        <MatrixBoard
          palettes={palettes}
          selectedHueId={selectedHueId}
          onSelectHue={handleSelectHue}
          onColorClick={(hueId, index) => setActiveStepIndex(index)}
          activeStepIndex={activeStepIndex}
          onRemoveHue={removeHue}
          baseScale={baseScale}
          onAddStep={addStep}
          onRemoveStep={removeStep}
          onUpdateStepValue={updateStepValue}
          onUpdateHueName={(id, name) => updateHueConfig(id, { name })}
        />

        {/* 5. Details Panel */}
        {selectedHueId && (
          <InsightPanel
            palettes={palettes}
            selectedPalette={selectedPalette}
            activeStepIndex={activeStepIndex}
            onUpdateCurve={(type, index, value) => {
              if (selectedHueId) {
                updateCurvePoint(selectedHueId, type, index, value);
              }
            }}
          />
        )}
      </div>

      {isExportOpen && (
        <ExportPanel
          palettes={palettes}
          baseScale={baseScale}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      <AppFooter />
    </div>
  );
}
