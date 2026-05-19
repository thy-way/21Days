import { CategoryId } from '../types';

export const CATEGORY_STYLES: Record<
  CategoryId,
  {
    bg: string;
    bgLight: string;
    text: string;
    border: string;
    gradient: string;
  }
> = {
  fitness: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    gradient: 'bg-red-500',
  },
  coding: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'bg-blue-500',
  },
  english: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    gradient: 'bg-green-500',
  },
  exam: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    gradient: 'bg-purple-500',
  },
  side: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    gradient: 'bg-amber-500',
  },
};

export function getCategoryStyles(categoryId: CategoryId) {
  return CATEGORY_STYLES[categoryId] || CATEGORY_STYLES.fitness;
}