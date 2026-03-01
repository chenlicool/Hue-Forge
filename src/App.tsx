import React, { useState } from 'react';
import { useColorSystem } from '@/hooks/useColorSystem';
import { TopBar } from '@/components/TopBar';
import { HueBar } from '@/components/HueBar';
import { MatrixBoard } from '@/components/MatrixBoard';
import { InsightPanel } from '@/components/InsightPanel';
import { Toolbar } from '@/components/Toolbar';
import { ExportPanel } from '@/components/ExportPanel';
import { AppFooter } from '@/components/AppFooter';

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

  const handleSelectHue = (id: string) => {
    setSelectedHueId(id);
    setActiveStepIndex(null);
  };

  const palettes = generatePalette;
  const selectedPalette = palettes.find(p => p.id === selectedHueId);

  return (
    <div className="flex h-screen flex-col bg-[#F5F5F5] text-gray-900 font-sans overflow-hidden">
      {/* 1. Branding Header */}
      <TopBar /> 
      
      {/* 2. Action Toolbar */}
      <Toolbar 
        onSetPresetHues={setPresetHues} 
        onOpenExport={() => setIsExportOpen(true)} 
      />

      {/* 3. Hue Spectrum Input */}
      <div className="bg-white border-b border-gray-200 z-10">
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
