import React from 'react';
import { TrendingUp, Check } from 'lucide-react';

interface ProgressCardProps {
  completed: number;
  total: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ completed, total }) => {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const done = total > 0 && completed >= total;

  return (
    <div className="card-warm p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-800">今日进度</span>
        </div>
        <span className="font-bold text-orange-600">{completed}/{total} 项</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full brand-gradient transition-all duration-700 shadow-sm"
          style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">已完成 {Math.round(pct)}%</span>
        <span className="text-gray-600 font-medium">
          {done ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4" /> 全部完成！
            </span>
          ) : '保持节奏，坚持下去 💪'}
        </span>
      </div>
    </div>
  );
};
