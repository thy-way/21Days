import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card } from './ui/Card';
import { cn, getFullMonthCalendarDays } from '@/utils';
import { DailyStats, CategoryId } from '@/types';
import { CATEGORY_STYLES } from '@/utils/categoryStyles';

interface CalendarGridProps {
  statsMap: Record<string, DailyStats>;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  statsMap,
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = getFullMonthCalendarDays(currentDate);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'yyyy年M月', { locale: zhCN })}
          </h2>
          <button
            onClick={goToToday}
            className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
          >
            今天
          </button>
        </div>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const stats = statsMap[dateStr];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate === dateStr;
          const isToday = isSameDay(day, new Date());

          const categoryDots: CategoryId[] = stats
            ? Object.entries(stats.byCategory)
                .filter(([_, count]) => count > 0)
                .map(([id]) => id as CategoryId)
            : [];

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dateStr)}
              disabled={!isCurrentMonth}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative',
                isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-300',
                isSelected && 'bg-orange-100 ring-2 ring-orange-500',
                isToday && !isSelected && 'bg-orange-50',
                isToday && 'font-semibold'
              )}
            >
              <span className={cn(!isCurrentMonth && 'text-gray-300')}>
                {format(day, 'd')}
              </span>
              {categoryDots.length > 0 && (
                <div className="flex space-x-0.5 mt-0.5">
                  {categoryDots.slice(0, 3).map((catId) => (
                    <div
                      key={catId}
                      className={cn('w-1.5 h-1.5 rounded-full', CATEGORY_STYLES[catId].bg)}
                    />
                  ))}
                  {categoryDots.length > 3 && (
                    <span className="text-xs text-gray-400">+</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};