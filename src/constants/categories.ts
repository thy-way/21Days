import { CategoryId, QuadrantType } from '@/types';

export const CATEGORY_NAMES: Record<CategoryId, string> = {
  fitness: '健身',
  coding: '编程学习',
  english: '英语',
  exam: '考试备考',
  side: '副业',
};

export const QUADRANT_LABELS: Record<QuadrantType, string> = {
  'urgent-important': '重要紧急',
  'urgent-not-important': '紧急不重要',
  'not-urgent-important': '重要不紧急',
  'not-urgent-not-important': '不重要不紧急',
};

export const QUADRANT_COLORS: Record<QuadrantType, string> = {
  'urgent-important': 'bg-red-100 text-red-700 border-red-200',
  'urgent-not-important': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'not-urgent-important': 'bg-blue-100 text-blue-700 border-blue-200',
  'not-urgent-not-important': 'bg-gray-100 text-gray-700 border-gray-200',
};
