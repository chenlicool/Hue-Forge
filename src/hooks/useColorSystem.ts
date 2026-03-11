import { useState, useMemo, useEffect } from 'react';
import { hsbToHex, getContrastRatio, getWcagRating, getHueName } from '@/utils/color';
import { DEFAULT_BRIGHTNESS_SCALE, DEFAULT_SATURATION_SCALE, HueConfig, ColorStep } from '@/utils/types';

export function useColorSystem() {
  // Base Scale (Brightness targets)
  const [baseScale, setBaseScale] = useState<number[]>([...DEFAULT_BRIGHTNESS_SCALE]);
  
  const YELLOW_SATURATION_SCALE = [38, 59, 81, 85, 93, 81, 81, 100, 81, 67];
  const YELLOW_BRIGHTNESS_SCALE = [100, 94, 86, 76, 64, 46, 38, 28, 23, 16];

  const LIME_SATURATION_SCALE = [35, 56, 79, 80, 71, 97, 98, 88, 87, 81];
  const LIME_BRIGHTNESS_SCALE = [100, 94, 86, 76, 61, 46, 39, 31, 23, 17];

  const GREEN_SATURATION_SCALE = [24, 42, 56, 64, 70, 76, 86, 90, 87, 84];
  const GREEN_BRIGHTNESS_SCALE = [99, 96, 88, 77, 63, 49, 38, 29, 21, 15];

  const TEAL_SATURATION_SCALE = [26, 46, 60, 68, 74, 80, 90, 94, 91, 88];
  const TEAL_BRIGHTNESS_SCALE = [99, 96, 88, 77, 63, 49, 38, 29, 21, 15];

  const CYAN_SATURATION_SCALE = [24, 42, 56, 64, 70, 76, 86, 90, 87, 84];
  const CYAN_BRIGHTNESS_SCALE = [100, 98, 92, 82, 69, 50, 44, 34, 25, 18];

  const VIOLET_SATURATION_SCALE = [8, 16, 30, 43, 56, 65, 64, 64, 60, 53];
  const VIOLET_BRIGHTNESS_SCALE = [100, 98, 96, 94, 92, 83, 73, 51, 37, 25];

  const PINK_SATURATION_SCALE = [4, 15, 26, 43, 54, 64, 62, 56, 58, 53];
  const PINK_BRIGHTNESS_SCALE = [100, 98, 96, 96, 87, 72, 59, 46, 35, 23];

  const CRIMSON_SATURATION_SCALE = [4, 15, 26, 43, 54, 65, 62, 56, 58, 53];
  const CRIMSON_BRIGHTNESS_SCALE = [100, 98, 96, 96, 87, 72, 59, 46, 35, 23];

  const RED_SATURATION_SCALE = [5, 18, 30, 40, 50, 65, 71, 78, 70, 52];
  const RED_BRIGHTNESS_SCALE = [99, 98, 96, 96, 89, 72, 59, 46, 35, 23];

  const ORANGE_SATURATION_SCALE = [16, 35, 68, 86, 91, 97, 97, 93, 80, 81];
  const ORANGE_BRIGHTNESS_SCALE = [100, 100, 100, 93, 85, 71, 60, 40, 30, 21];

  const BLUE_SATURATION_SCALE = [12, 25, 41, 54, 69, 80, 82, 95, 92, 91];
  const BLUE_BRIGHTNESS_SCALE = [100, 100, 100, 99, 96, 78, 79, 65, 42, 30];

  const INDIGO_SATURATION_SCALE = [8, 16, 25, 36, 49, 63, 76, 87, 100, 97];
  const INDIGO_BRIGHTNESS_SCALE = [100, 100, 100, 100, 98, 83, 85, 81, 72, 51];

  const GRAY_SATURATION_SCALE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const GRAY_BRIGHTNESS_SCALE = [99, 98, 92, 81, 68, 46, 38, 30, 22, 14];

  const ACCENT_GRAY_SATURATION_SCALE = [2, 3, 4, 5, 6, 8, 9, 8, 7, 6];
  const ACCENT_GRAY_BRIGHTNESS_SCALE = [99, 98, 92, 81, 68, 48, 42, 34, 27, 19];

  // Initial Hues
  const [hueConfigs, setHueConfigs] = useState<HueConfig[]>([
    {
      id: 'gray',
      hue: 0,
      name: 'Gray',
      saturationCurve: [...GRAY_SATURATION_SCALE],
      brightnessCurve: [...DEFAULT_BRIGHTNESS_SCALE],
    },
    {
      id: 'accent-gray',
      hue: 200,
      name: 'Accent Gray',
      customName: true,
      saturationCurve: [...ACCENT_GRAY_SATURATION_SCALE],
      brightnessCurve: [...ACCENT_GRAY_BRIGHTNESS_SCALE],
    },
    {
      id: 'red',
      hue: 0,
      name: 'Red',
      saturationCurve: [...RED_SATURATION_SCALE],
      brightnessCurve: [...RED_BRIGHTNESS_SCALE],
    },
    {
      id: 'orange',
      hue: 30,
      name: 'Orange',
      saturationCurve: [...ORANGE_SATURATION_SCALE],
      brightnessCurve: [...ORANGE_BRIGHTNESS_SCALE],
    },
    {
      id: 'yellow',
      hue: 45,
      name: 'Yellow',
      saturationCurve: [...YELLOW_SATURATION_SCALE],
      brightnessCurve: [...YELLOW_BRIGHTNESS_SCALE],
    },
    {
      id: 'lime',
      hue: 90,
      name: 'Lime',
      saturationCurve: [...LIME_SATURATION_SCALE],
      brightnessCurve: [...LIME_BRIGHTNESS_SCALE],
    },
    {
      id: 'green',
      hue: 140,
      name: 'Green',
      saturationCurve: [...GREEN_SATURATION_SCALE],
      brightnessCurve: [...GREEN_BRIGHTNESS_SCALE],
    },
    {
      id: 'teal',
      hue: 170,
      name: 'Teal',
      saturationCurve: [...TEAL_SATURATION_SCALE],
      brightnessCurve: [...TEAL_BRIGHTNESS_SCALE],
    },
    {
      id: 'cyan',
      hue: 190,
      name: 'Cyan',
      saturationCurve: [...CYAN_SATURATION_SCALE],
      brightnessCurve: [...CYAN_BRIGHTNESS_SCALE],
    },
    {
      id: 'blue',
      hue: 210,
      name: 'Blue',
      saturationCurve: [...BLUE_SATURATION_SCALE],
      brightnessCurve: [...BLUE_BRIGHTNESS_SCALE],
    },
    {
      id: 'indigo',
      hue: 240,
      name: 'Indigo',
      saturationCurve: [...INDIGO_SATURATION_SCALE],
      brightnessCurve: [...INDIGO_BRIGHTNESS_SCALE],
    },
    {
      id: 'violet',
      hue: 260,
      name: 'Violet',
      saturationCurve: [...VIOLET_SATURATION_SCALE],
      brightnessCurve: [...VIOLET_BRIGHTNESS_SCALE],
    },
    {
      id: 'pink',
      hue: 300,
      name: 'Pink',
      saturationCurve: [...PINK_SATURATION_SCALE],
      brightnessCurve: [...PINK_BRIGHTNESS_SCALE],
    },
    {
      id: 'crimson',
      hue: 330,
      name: 'Crimson',
      saturationCurve: [...CRIMSON_SATURATION_SCALE],
      brightnessCurve: [...CRIMSON_BRIGHTNESS_SCALE],
    }
  ]);

  const [selectedHueId, setSelectedHueId] = useState<string | null>(hueConfigs[0].id);

  const generatePalette = useMemo(() => {
    return hueConfigs.map(config => {
      const colors: ColorStep[] = [];
      // Use baseScale length for steps
      for (let i = 0; i < baseScale.length; i++) {
        const stepNum = (i + 1) * 10; // This might need to be dynamic if we want arbitrary steps
        const s = config.saturationCurve[i] ?? 0;
        const b = config.brightnessCurve[i] ?? 0;
        const hex = hsbToHex(config.hue, s, b);
        
        const contrastBlack = getContrastRatio(hex, '#000000');
        const contrastWhite = getContrastRatio(hex, '#FFFFFF');
        
        colors.push({
          step: stepNum,
          h: config.hue,
          s,
          b,
          hex,
          contrastBlack,
          contrastWhite,
          wcagBlack: getWcagRating(contrastBlack),
          wcagWhite: getWcagRating(contrastWhite),
        });
      }
      return { ...config, colors };
    });
  }, [hueConfigs, baseScale]);

  const addHue = (hue: number) => {
    const newId = Math.random().toString(36).substr(2, 9);
    // Create new curves matching the current baseScale length
    
    let targetSaturation = [...DEFAULT_SATURATION_SCALE];
    let targetBrightness = [...baseScale];

    // Determine naming density based on total colored hues (+1 for the one we're about to add)
    const colorCount = hueConfigs.filter(h => h.id !== 'gray' && h.id !== 'accent-gray').length + 1;
    const namingDensity = colorCount <= 8 ? 8 : (colorCount <= 12 ? 12 : 24);

    // Use custom curves for Red range (345-15), Orange range (15-38), Yellow range (38-60), Lime range (60-115), Green range (115-155), Teal range (155-180), Cyan range (180-195), Blue range (195-225), Indigo range (225-250), Violet range (250-285), Pink range (285-315), or Crimson range (315-345)
    if (hue >= 345 || hue < 15) {
      targetSaturation = [...RED_SATURATION_SCALE];
      targetBrightness = [...RED_BRIGHTNESS_SCALE];
    } else if (hue >= 15 && hue < 38) {
      targetSaturation = [...ORANGE_SATURATION_SCALE];
      targetBrightness = [...ORANGE_BRIGHTNESS_SCALE];
    } else if (hue >= 38 && hue < 60) {
      targetSaturation = [...YELLOW_SATURATION_SCALE];
      targetBrightness = [...YELLOW_BRIGHTNESS_SCALE];
    } else if (hue >= 60 && hue < 115) {
      targetSaturation = [...LIME_SATURATION_SCALE];
      targetBrightness = [...LIME_BRIGHTNESS_SCALE];
    } else if (hue >= 115 && hue < 155) {
      targetSaturation = [...GREEN_SATURATION_SCALE];
      targetBrightness = [...GREEN_BRIGHTNESS_SCALE];
    } else if (hue >= 155 && hue < 180) {
      targetSaturation = [...TEAL_SATURATION_SCALE];
      targetBrightness = [...TEAL_BRIGHTNESS_SCALE];
    } else if (hue >= 180 && hue <= 195) {
      targetSaturation = [...CYAN_SATURATION_SCALE];
      targetBrightness = [...CYAN_BRIGHTNESS_SCALE];
    } else if (hue > 195 && hue < 225) {
      targetSaturation = [...BLUE_SATURATION_SCALE];
      targetBrightness = [...BLUE_BRIGHTNESS_SCALE];
    } else if (hue >= 225 && hue < 250) {
      targetSaturation = [...INDIGO_SATURATION_SCALE];
      targetBrightness = [...INDIGO_BRIGHTNESS_SCALE];
    } else if (hue >= 250 && hue < 285) {
      targetSaturation = [...VIOLET_SATURATION_SCALE];
      targetBrightness = [...VIOLET_BRIGHTNESS_SCALE];
    } else if (hue >= 285 && hue < 315) {
      targetSaturation = [...PINK_SATURATION_SCALE];
      targetBrightness = [...PINK_BRIGHTNESS_SCALE];
    } else if (hue >= 315 && hue < 345) {
      targetSaturation = [...CRIMSON_SATURATION_SCALE];
      targetBrightness = [...CRIMSON_BRIGHTNESS_SCALE];
    }

    const newSaturation = resizeArray(targetSaturation, baseScale.length);
    // For brightness, if it matches a custom curve, we resize the custom curve. Otherwise we use baseScale (which is already correct length)
    const newBrightness = resizeArray(targetBrightness, baseScale.length);

    setHueConfigs(prev => [...prev, {
      id: newId,
      hue,
      name: getHueName(hue, namingDensity),
      saturationCurve: newSaturation,
      brightnessCurve: newBrightness,
    }]);
    setSelectedHueId(newId);
  };

  const removeHue = (id: string) => {
    setHueConfigs(prev => prev.filter(h => h.id !== id));
    if (selectedHueId === id) {
      setSelectedHueId(null);
    }
  };

  const updateHueConfig = (id: string, updates: Partial<HueConfig>) => {
    setHueConfigs(prev => {
      // Calculate current naming density
      const colorCount = prev.filter(h => h.id !== 'gray' && h.id !== 'accent-gray').length;
      const namingDensity = colorCount <= 8 ? 8 : (colorCount <= 12 ? 12 : 24);

      return prev.map(h => {
        if (h.id === id) {
          const updated = { ...h, ...updates };
          if (updates.hue !== undefined && !h.customName) {
            updated.name = getHueName(updates.hue, namingDensity);
          }
          if (updates.name !== undefined) {
            updated.customName = true;
          }
          return updated;
        }
        return h;
      });
    });
  };

  const updateCurvePoint = (hueId: string, type: 'saturation' | 'brightness', index: number, value: number) => {
    setHueConfigs(prev => prev.map(h => {
      if (h.id === hueId) {
        const curve = type === 'saturation' ? [...h.saturationCurve] : [...h.brightnessCurve];
        curve[index] = Math.max(0, Math.min(100, value));
        return {
          ...h,
          [type === 'saturation' ? 'saturationCurve' : 'brightnessCurve']: curve
        };
      }
      return h;
    }));
  };

  const setPresetHues = (count: number) => {
    const newConfigs: HueConfig[] = [];
    const startHue = 0;
    const step = 360 / count;
    
    for (let i = 0; i < count; i++) {
      const h = Math.round((startHue + i * step) % 360);
      
      let targetSaturation = [...DEFAULT_SATURATION_SCALE];
      let targetBrightness = [...baseScale];

      if (h >= 345 || h < 15) {
        targetSaturation = [...RED_SATURATION_SCALE];
        targetBrightness = [...RED_BRIGHTNESS_SCALE];
      } else if (h >= 15 && h < 38) {
        targetSaturation = [...ORANGE_SATURATION_SCALE];
        targetBrightness = [...ORANGE_BRIGHTNESS_SCALE];
      } else if (h >= 38 && h < 60) {
        targetSaturation = [...YELLOW_SATURATION_SCALE];
        targetBrightness = [...YELLOW_BRIGHTNESS_SCALE];
      } else if (h >= 60 && h < 115) {
        targetSaturation = [...LIME_SATURATION_SCALE];
        targetBrightness = [...LIME_BRIGHTNESS_SCALE];
      } else if (h >= 115 && h < 155) {
        targetSaturation = [...GREEN_SATURATION_SCALE];
        targetBrightness = [...GREEN_BRIGHTNESS_SCALE];
      } else if (h >= 155 && h < 180) {
        targetSaturation = [...TEAL_SATURATION_SCALE];
        targetBrightness = [...TEAL_BRIGHTNESS_SCALE];
      } else if (h >= 180 && h <= 195) {
        targetSaturation = [...CYAN_SATURATION_SCALE];
        targetBrightness = [...CYAN_BRIGHTNESS_SCALE];
      } else if (h > 195 && h < 225) {
        targetSaturation = [...BLUE_SATURATION_SCALE];
        targetBrightness = [...BLUE_BRIGHTNESS_SCALE];
      } else if (h >= 225 && h < 250) {
        targetSaturation = [...INDIGO_SATURATION_SCALE];
        targetBrightness = [...INDIGO_BRIGHTNESS_SCALE];
      } else if (h >= 250 && h < 285) {
        targetSaturation = [...VIOLET_SATURATION_SCALE];
        targetBrightness = [...VIOLET_BRIGHTNESS_SCALE];
      } else if (h >= 285 && h < 315) {
        targetSaturation = [...PINK_SATURATION_SCALE];
        targetBrightness = [...PINK_BRIGHTNESS_SCALE];
      } else if (h >= 315 && h < 345) {
        targetSaturation = [...CRIMSON_SATURATION_SCALE];
        targetBrightness = [...CRIMSON_BRIGHTNESS_SCALE];
      }

      // Resize defaults to match current baseScale
      const newSaturation = resizeArray(targetSaturation, baseScale.length);
      const newBrightness = resizeArray(targetBrightness, baseScale.length);

      newConfigs.push({
        id: `preset-${i}`,
        hue: h,
        name: getHueName(h, count),
        saturationCurve: newSaturation,
        brightnessCurve: newBrightness,
      });
    }
    setHueConfigs(prev => {
      const grays = prev.filter(c => c.id === 'gray' || c.id === 'accent-gray');
      return [...grays, ...newConfigs];
    });
    setSelectedHueId(newConfigs[0].id);
  };

  // --- Base Scale Management ---

  const addStep = (value: number) => {
    const clampedValue = clampPercentage(value);
    const insertionIndex = getInsertionIndex(baseScale, clampedValue);

    const boundedValue = clampInsertedValue(baseScale, insertionIndex, clampedValue);
    if (boundedValue === null) {
      return;
    }

    const nextBaseScale = [...baseScale];
    nextBaseScale.splice(insertionIndex, 0, boundedValue);

    setBaseScale(nextBaseScale);

    setHueConfigs(prev => prev.map(config => ({
      ...config,
      saturationCurve: insertCurveValue(config.saturationCurve, insertionIndex, 'saturation'),
      brightnessCurve:
        config.id === 'gray'
          ? [...nextBaseScale]
          : insertCurveValue(config.brightnessCurve, insertionIndex, 'brightness'),
    })));
  };

  const removeStep = (index: number) => {
    if (baseScale.length <= 2) return; // Prevent removing all steps

    const nextBaseScale = baseScale.filter((_, i) => i !== index);
    setBaseScale(nextBaseScale);

    setHueConfigs(prev => prev.map(config => ({
      ...config,
      saturationCurve: config.saturationCurve.filter((_, i) => i !== index),
      brightnessCurve:
        config.id === 'gray'
          ? [...nextBaseScale]
          : config.brightnessCurve.filter((_, i) => i !== index),
    })));
  };

  const updateStepValue = (index: number, value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const delta = clampedValue - baseScale[index];
    const nextBaseScale = [...baseScale];
    nextBaseScale[index] = clampedValue;
    
    setBaseScale(nextBaseScale);

    // Propagate change to all hues' brightness curves relatively
    setHueConfigs(prev => prev.map(config => {
      if (config.id === 'gray') {
        return {
          ...config,
          brightnessCurve: [...nextBaseScale]
        };
      }
      const newBri = [...config.brightnessCurve];
      // Ensure we don't go out of bounds, though baseScale and curves should be synced in length
      if (index < newBri.length) {
        newBri[index] = Math.max(0, Math.min(100, newBri[index] + delta));
      }
      return {
        ...config,
        brightnessCurve: newBri
      };
    }));
  };

  return {
    baseScale,
    hueConfigs,
    selectedHueId,
    setSelectedHueId,
    generatePalette,
    addHue,
    removeHue,
    updateHueConfig,
    updateCurvePoint,
    setPresetHues,
    addStep,
    removeStep,
    updateStepValue
  };
}

// Helper to resize array (preserves 50/50 split and uses smoothstep)
function resizeArray(arr: number[], targetLength: number): number[] {
  if (arr.length === targetLength) return arr;
  
  // For standard 10-step scales, we want to preserve the 50/50 split (between index 4 and 5)
  // when scaling up to 12, 24, etc.
  if (arr.length === 10 && targetLength >= 10) {
    const result: number[] = [];
    const halfTarget = Math.floor(targetLength / 2);
    const isOdd = targetLength % 2 !== 0;

    for (let i = 0; i < targetLength; i++) {
      let originalIndex: number;

      if (i < halfTarget) {
        // First half: map [0, halfTarget - 1] to [0, 4]
        originalIndex = i * (4 / (halfTarget - 1));
      } else if (isOdd && i === halfTarget) {
        // Exact middle for odd lengths
        originalIndex = 4.5;
      } else {
        // Second half: map [targetLength - halfTarget, targetLength - 1] to [5, 9]
        const secondHalfIndex = i - (targetLength - halfTarget);
        originalIndex = 5 + secondHalfIndex * (4 / (halfTarget - 1));
      }

      const lower = Math.floor(originalIndex);
      const upper = Math.ceil(originalIndex);
      const weight = originalIndex - lower;
      
      if (lower === upper) {
        result.push(arr[lower]);
      } else {
        // Use smoothstep for better fine-grained transitions
        const smoothWeight = weight * weight * (3 - 2 * weight);
        const val = arr[lower] * (1 - smoothWeight) + arr[upper] * smoothWeight;
        result.push(Math.round(val));
      }
    }
    return result;
  }

  // Fallback for other lengths
  const result: number[] = [];
  for (let i = 0; i < targetLength; i++) {
    const originalIndex = (i / (targetLength - 1)) * (arr.length - 1);
    const lower = Math.floor(originalIndex);
    const upper = Math.ceil(originalIndex);
    const weight = originalIndex - lower;
    
    if (lower === upper) {
      result.push(arr[lower]);
    } else {
      const smoothWeight = weight * weight * (3 - 2 * weight);
      const val = arr[lower] * (1 - smoothWeight) + arr[upper] * smoothWeight;
      result.push(Math.round(val));
    }
  }
  return result;
}

function addEdgeValues(values: number[], curveType: 'saturation' | 'brightness'): number[] {
  if (values.length === 0) {
    return [50, 50];
  }

  if (values.length === 1) {
    const only = clampPercentage(values[0]);
    return [only, only, only];
  }

  const first = values[0];
  const second = values[1];
  const last = values[values.length - 1];
  const beforeLast = values[values.length - 2];

  const headFactor = 0.1;
  const tailFactor = 0.25;

  const rawHead = first + (first - second) * headFactor;
  const rawTail = last + (last - beforeLast) * tailFactor;

  const head = curveType === 'brightness'
    ? clampPercentage(Math.min(99, rawHead))
    : clampPercentage(rawHead);
  const tail = clampPercentage(rawTail);

  return [head, ...values, tail];
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getInsertionIndex(values: number[], target: number): number {
  const index = values.findIndex((value) => target > value);
  return index === -1 ? values.length : index;
}

function clampInsertedValue(values: number[], insertionIndex: number, target: number): number | null {
  const upperBound = insertionIndex === 0 ? 100 : values[insertionIndex - 1] - 1;
  const lowerBound = insertionIndex === values.length ? 0 : values[insertionIndex] + 1;

  if (upperBound < lowerBound) {
    return null;
  }

  return Math.max(lowerBound, Math.min(upperBound, target));
}

function insertCurveValue(
  values: number[],
  insertionIndex: number,
  curveType: 'saturation' | 'brightness',
): number[] {
  if (values.length === 0) {
    return [50];
  }

  if (insertionIndex === 0) {
    return insertHeadRedistributedValue(values, curveType);
  }

  const next = [...values];

  const prevValue =
    insertionIndex === 0 ? values[0] : values[insertionIndex - 1];
  const nextValue =
    insertionIndex >= values.length ? values[values.length - 1] : values[insertionIndex];

  const inserted =
    insertionIndex === 0 || insertionIndex >= values.length
      ? clampPercentage((prevValue + nextValue) / 2)
      : clampPercentage((prevValue + nextValue) / 2);

  next.splice(insertionIndex, 0, inserted);
  return next;
}

function insertHeadRedistributedValue(
  values: number[],
  curveType: 'saturation' | 'brightness',
): number[] {
  if (values.length === 1) {
    const first = clampPercentage(values[0]);
    const inserted = curveType === 'brightness'
      ? Math.min(100, first + 1)
      : Math.max(0, first - 1);
    return [inserted, first];
  }

  const anchorIndex = getHeadAnchorIndex(values, curveType);
  const anchorValue = values[anchorIndex];
  const targetHead = getHeadTargetValue(values, anchorIndex, curveType);
  const redistributed = interpolateRange(targetHead, anchorValue, anchorIndex + 2);

  if (curveType === 'brightness' && redistributed.length >= 2 && redistributed[0] === redistributed[1]) {
    redistributed[1] = Math.max(anchorValue, redistributed[0] - 1);
  }

  if (curveType === 'saturation' && redistributed.length >= 2 && redistributed[0] === redistributed[1]) {
    redistributed[1] = Math.min(anchorValue, redistributed[0] + 1);
  }

  return [...redistributed, ...values.slice(anchorIndex + 1)];
}

function getHeadAnchorIndex(
  values: number[],
  curveType: 'saturation' | 'brightness',
): number {
  const first = values[0];
  const threshold = curveType === 'brightness' ? 4 : 12;
  const maxWindow = Math.min(values.length - 1, curveType === 'brightness' ? 4 : 3);

  for (let index = 1; index <= maxWindow; index += 1) {
    if (Math.abs(values[index] - first) >= threshold) {
      return index;
    }
  }

  return Math.max(1, maxWindow);
}

function getHeadTargetValue(
  values: number[],
  anchorIndex: number,
  curveType: 'saturation' | 'brightness',
): number {
  const first = values[0];
  const anchor = values[anchorIndex];

  if (curveType === 'brightness') {
    const estimatedStep = Math.max(1, Math.round((first - anchor) / (anchorIndex + 1)));
    return clampPercentage(Math.min(100, first + estimatedStep));
  }

  const estimatedStep = Math.max(1, Math.round((anchor - first) / (anchorIndex + 1)));
  const minimumDesaturation = Math.max(2, Math.round(first * 0.25));
  return clampPercentage(Math.max(3, first - Math.max(estimatedStep, minimumDesaturation)));
}

function interpolateRange(start: number, end: number, length: number): number[] {
  if (length <= 1) {
    return [clampPercentage(start)];
  }

  const result: number[] = [];
  for (let index = 0; index < length; index += 1) {
    const ratio = index / (length - 1);
    const value = start + (end - start) * ratio;
    result.push(clampPercentage(value));
  }
  return result;
}
