import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSliderValue(value: number | readonly number[]): number {
  if (typeof value === 'number') {
    return value;
  }
  return value[0];
}
