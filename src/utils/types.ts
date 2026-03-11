export const DEFAULT_STEPS = 10;

// Standard brightness scale from the prompt
// 10: 96, 20: 87, 30: 78, 40: 68, 50: 56, 60: 44, 70: 34, 80: 24, 90: 14, 100: 4
export const DEFAULT_BRIGHTNESS_SCALE = [96, 87, 78, 68, 56, 44, 34, 24, 14, 4];

// Default saturation curve (can be adjusted per hue)
// Usually saturation increases as brightness decreases, but it's often non-linear.
// Let's define a default "S" curve that goes from low saturation (light) to high saturation (vibrant) then maybe dips or stays high.
// For a simple start: 5, 15, 30, 50, 70, 85, 95, 100, 100, 100
export const DEFAULT_SATURATION_SCALE = [10, 20, 35, 50, 65, 80, 90, 95, 98, 100];

export interface ColorStep {
  step: number; // 10, 20, ... 100
  h: number;
  s: number;
  b: number;
  hex: string;
  contrastBlack: number;
  contrastWhite: number;
  wcagBlack: 'AAA' | 'AA' | 'Fail';
  wcagWhite: 'AAA' | 'AA' | 'Fail';
}

export interface HueConfig {
  id: string;
  hue: number;
  name: string;
  customName?: boolean;
  saturationCurve: number[]; // Array of 10 numbers
  brightnessCurve: number[]; // Array of 10 numbers
}
