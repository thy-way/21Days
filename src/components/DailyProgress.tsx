import React from 'react';
import { Flame } from 'lucide-react';
import { Card } from './ui/Card';
import { Category, CheckIn } from '@/types';
import { cn } from '@/utils';

interface DailyProgressProps {
  categories: Category[];
  checkIns: CheckIn[];
  streak: number;
}

export const DailyProgress: React.FC<DailyProgressProps> = ({
  categories,
  checkIns,
  streak,
}) => {
  const enabledCategories = categories.filter((c) => c.enabled);
  const completedCategories = enabledCategories.filter((cat) => {
    const count = checkIns.filter((ci) => ci.categoryId === cat.id).length;
    return count >= (cat.dailyGoal || 1);
  });

  const progress = enabledCategories.length > 0 
    ? (completedCategories.length / enabledCategories.length) * 100 
    : 0;
  const isAllCompleted = completedCategories.length === enabledCategories.length;

  return (
    <Card className={cn('relative overflow-hidden', isAllCompleted && 'bg-gradient-to-r from-green-50 to-emerald-50')}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">今日进度</h2>
          <p className="text-sm text-gray-500 mt-1">
            已完成 {completedCategories.length}/{enabledCategories.length} 个目标
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-orange-500">
            <Flame className="w-5 h-5" />
            <span className="text-2xl font-bold">{streak}</span>
          </div>
          <p className="text-xs text-gray-500">连续天数</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              isAllCompleted ? 'bg-green-500' : 'brand-gradient'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {enabledCategories.map((cat) => {
          const count = checkIns.filter((ci) => ci.categoryId === cat.id).length;
          const isDone = count >= (cat.dailyGoal || 1);
          return (
            <span
              key={cat.id}
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                isDone
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {cat.name}
            </span>
          );
        })}
      </div>
    </Card>
  );
};