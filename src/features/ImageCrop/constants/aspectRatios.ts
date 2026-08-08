export type AspectRatioId = 'free' | '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | '3:4';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  value: number | null;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: 'free', label: 'Free', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '3:2', label: '3:2', value: 3 / 2 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
  { id: '3:4', label: '3:4', value: 3 / 4 },
  { id: '9:16', label: '9:16', value: 9 / 16 },
];
