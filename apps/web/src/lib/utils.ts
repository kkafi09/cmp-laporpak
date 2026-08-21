import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const beUITransitions = {
  spring: { type: 'spring' as const, stiffness: 360, damping: 28 },
  fadeSlide: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }
};
