export { NoteFunctionType, MusicActionType, NoteDuration } from './types';
export interface Tuning {
  note: string;
  frequency: number;
}

import { NoteFunctionType } from './types';

export interface NoteDto {
  value: string;
  duration: number;
  functionType: NoteFunctionType;
}

export interface TactInfo {
  sizeStr: string;
  notes: NoteDto[][];
  serialNumber: number;
  topLeftCorner?: number;
  width?: number;
  height?: number;
}

export interface StaveInfo {
  instrument: string;
  tacts: TactInfo[];
  sliderContext?: SliderContext;
}

export interface Composition {
  id?: number;
  staves: StaveInfo[];
  name: string;
  complexity: number;
  description: string;
  bpm: number;
  videoLink: string;
}

export interface SliderMovementInfo {
  speed: number;
  time: number;
  tact?: number;
  note?: number;
  jumpBelow?: boolean;
  jumpHeight?: number;
  endOfTact?: boolean;
}

export interface SliderContext {
  top: number;
  left: number;
  currentInterval: number;
  playIntervals: SliderMovementInfo[];
  intervals: number[];
  timeouts: ReturnType<typeof setTimeout>[];
}
