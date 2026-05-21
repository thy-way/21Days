import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useCheckInStore } from '@/store';
import { CalendarGrid } from '@/components/CalendarGrid';
import { DailyStats } from '@/types';
import { cn } from '@/utils';
import { Calendar as CalendarIcon, Check } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { getDailyStats, categories } = useCheckInStore();
  const [statsMap, setStatsMap] = useState<Record<string, DailyStats>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStats, setSelectedStats] = useState<DailyStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const today = new Date();
      const stats: Record<string, DailyStats> = {};

      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        stats[dateStr] = await getDailyStats(dateStr);
      }

      setStatsMap(stats);
    };

    loadStats();
  }, [getDailyStats]);

  useEffect(() => {
    if (selectedDate && statsMap[selectedDate]) {
      setSelectedStats(statsMap[selectedDate]);
    }
  }, [selectedDate, statsMap]);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="brand-text-gradient">21Days</span>
              <span className="text-gray-400 text-base font-normal ml-2">日历</span>
            </div>
          </h1>
          <p className="text-amber-600/60 mt-1 text-sm">查看打卡历史记录</p>
        </div>

        <div className="card-warm p-4 sm:p-6 mb-6">
          <CalendarGrid
            statsMap={statsMap}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate || undefined}
          />
        </div>

        {selectedStats && selectedDate && (
          <div className="card-warm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">
                {format(parseISO(selectedDate), 'M月d日 EEEE', { locale: zhCN })}
              </h3>
              <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
                {selectedStats.totalCheckIns} 次打卡
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.filter((c) => c.enabled).map((cat) => {
                const count = selectedStats.byCategory[cat.id] || 0;
                const goal = cat.dailyGoal || 1;
                const isCompleted = count >= goal;

                return (
                  <div
                    key={cat.id}
                    className={cn(
                      'rounded-xl p-3 transition-all',
                      isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{cat.name}</span>
                      {isCompleted && <Check className="w-3.5 h-3.5 text-green-500" />}
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500">/ {goal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};