import React, { useEffect, useState, useMemo } from 'react';
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isBefore, isAfter } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useCheckInStore, usePlanStore } from '@/store';
import { CheckIn, DailySummary } from '@/types';
import { TaskCheckInDialog } from '@/components/CheckInDialog';
import { cn } from '@/utils';
import { Calendar, Target, FileText, ChevronLeft, ChevronRight, ChevronDown, Save, Edit3, Book, BarChart3, Check, MessageCircle, Plus, X } from 'lucide-react';

interface DailyRecord {
  date: string;
  checkIns: CheckIn[];
  totalDuration: number;
  totalCount: number;
  categories: Record<string, number>;
}

const getCategoryName = (categoryId: string, categories: { id: string; name: string }[]) => {
  const cat = categories.find(c => c.id === categoryId);
  return cat?.name || categoryId;
};

const getCategoryColor = (categoryId: string, categories: { id: string; name: string; color: string }[]) => {
  const cat = categories.find(c => c.id === categoryId);
  return cat?.color || '#3b82f6';
};

export const Stats: React.FC = () => {
  const { categories, tasks, getDailyStats, loadDailySummary, saveDailySummary, loadAllSummaries, updateCheckInComment, addCheckIn, loadDateCheckIns } = useCheckInStore();
  const { plans, loadPlans } = usePlanStore();
  React.useEffect(() => { loadPlans(); }, [loadPlans]);
  const activePlanTasks = React.useMemo(() =>
    plans.filter(p => p.isActive).flatMap(p =>
      p.tasks.map(t => ({ ...t, planId: p.id!, planCategoryId: p.categoryId }))
    ),
    [plans]
  );
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDayCheckIns, setSelectedDayCheckIns] = useState<CheckIn[]>([]);
  const [dailySummary, setDailySummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [allSummaries, setAllSummaries] = useState<DailySummary[]>([]);
  const [showAllSummaries, setShowAllSummaries] = useState(false);
  const [selectedDaySummaries, setSelectedDaySummaries] = useState<DailySummary[]>([]);
  const [editingComments, setEditingComments] = useState<Record<number, string>>({});
  const [savingCommentId, setSavingCommentId] = useState<number | null>(null);
  const [checkInPickerOpen, setCheckInPickerOpen] = useState(false);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkInTask, setCheckInTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);

  // Get week date range
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = useMemo(() =>
    eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );

  useEffect(() => {
    const loadWeeklyData = async (): Promise<void> => {
      const results = await Promise.all(weekDays.map(async (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const [stats, dayCheckIns] = await Promise.all([
          getDailyStats(dateStr),
          useCheckInStore.getState().loadDateCheckIns(dateStr),
        ]);

        const categoryCount: Record<string, number> = {};
        dayCheckIns.forEach(ci => {
          categoryCount[ci.categoryId] = (categoryCount[ci.categoryId] || 0) + 1;
        });

        return {
          date: dateStr,
          checkIns: dayCheckIns,
          totalDuration: stats.totalCheckIns * 30,
          totalCount: stats.totalCheckIns,
          categories: categoryCount,
        };
      }));

      setWeeklyRecords(results);
    };

    loadWeeklyData();
  }, [currentWeek, getDailyStats, weekDays]);

  // Load all summaries
  useEffect(() => {
    loadAllSummaries().then(setAllSummaries);
  }, [loadAllSummaries]);

  const handlePrevWeek = () => {
    const newStart = subDays(weekStart, 1);
    setCurrentWeek(newStart);
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEnd = subDays(weekEnd, 7);
    const inRange = !isBefore(today, format(newStart, 'yyyy-MM-dd'))
                     && !isAfter(today, format(newEnd, 'yyyy-MM-dd'));
    setSelectedDay(inRange ? today : null);
  };
  const handleNextWeek = () => {
    const newStart = subDays(weekStart, -7);
    setCurrentWeek(newStart);
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEnd = subDays(weekEnd, -7);
    const inRange = !isBefore(today, format(newStart, 'yyyy-MM-dd'))
                     && !isAfter(today, format(newEnd, 'yyyy-MM-dd'));
    setSelectedDay(inRange ? today : null);
  };

  // Auto-load details whenever selectedDay or weeklyRecords changes
  useEffect(() => {
    if (!selectedDay) return;
    const record = weeklyRecords.find(r => r.date === selectedDay);
    setSelectedDayCheckIns(record?.checkIns || []);
    loadDailySummary(selectedDay).then(summaries => {
      setSelectedDaySummaries(summaries);
      setDailySummary(summaries.length > 0 ? summaries[0].content : "");
    });
  }, [selectedDay, weeklyRecords, loadDailySummary]);

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    setSaved(false);
    setEditingComments({});
  };

  const handleSaveSummary = async () => {
    if (!selectedDay) return;
    setIsSaving(true);
    await saveDailySummary(selectedDay, dailySummary);
    setIsSaving(false);
    setDailySummary('');
    setSaved(true);
    loadAllSummaries().then(setAllSummaries);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveComment = async (checkInId: number) => {
    const text = editingComments[checkInId];
    if (!text?.trim()) return;
    setSavingCommentId(checkInId);
    await updateCheckInComment(checkInId, text.trim());
    setSavingCommentId(null);
    setSelectedDayCheckIns(prev =>
      prev.map(ci => (ci.id === checkInId ? { ...ci, comment: text.trim() } : ci))
    );
    setEditingComments(prev => {
      const next = { ...prev };
      delete next[checkInId];
      return next;
    });
  };

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.name || taskId;
  };

  // Calculate weekly summary
  const weeklyTotal = weeklyRecords.reduce((acc, r) => acc + r.totalCount, 0);
  const weeklyAvg = Math.round(weeklyTotal / 7 * 10) / 10;
  const completedDays = weeklyRecords.filter(r => r.totalCount > 0).length;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="brand-text-gradient">21Days</span>
            </div>
          </h1>
        </div>

        {/* Weekly Summary Card */}
        <div className="card-warm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">本周概况</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevWeek}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                {format(weekStart, 'MM/dd')} - {format(weekEnd, 'MM/dd')}
              </span>
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{weeklyTotal}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">本周打卡</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{weeklyAvg}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">日均打卡</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{completedDays}/7</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">打卡天数</div>
            </div>
          </div>
        </div>

        {/* Week Calendar View */}
        <div className="card-warm p-5 mb-6">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const record = weeklyRecords.find(r => r.date === dateStr);
              const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
              const isSelected = selectedDay === dateStr;
              const hasCheckIns = record && record.totalCount > 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  className={cn(
                    'p-3 rounded-xl text-center transition-all',
                    isSelected
                      ? 'brand-gradient text-white'
                      : hasCheckIns
                        ? 'bg-orange-50 dark:bg-orange-500/20 text-gray-800 dark:text-gray-200'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500',
                    isToday && !isSelected && 'ring-2 ring-orange-400'
                  )}
                >
                  <div className="text-xs mb-1">{format(day, 'EEE', { locale: zhCN })}</div>
                  <div className={cn(
                    'text-lg font-semibold',
                    isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                  )}>
                    {format(day, 'd')}
                  </div>
                  {hasCheckIns && !isSelected && (
                    <div className="text-xs text-blue-600 mt-1">{record.totalCount}次</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Detail View */}
        {selectedDay && (
          <div className="card-warm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                {format(parseISO(selectedDay), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
              </h2>
              {format(parseISO(selectedDay), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                <button
                  onClick={() => setCheckInPickerOpen(true)}
                  className="brand-gradient text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" /> 今日打卡
                </button>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {selectedDayCheckIns.length} 项任务
                </span>
              </div>
            </div>

            {(() => {
              const isTodaySelected = selectedDay === format(new Date(), 'yyyy-MM-dd');
              return selectedDayCheckIns.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayCheckIns.map((checkIn, idx) => {
                    return (
                      <div key={idx}>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(checkIn.categoryId, categories as unknown as { id: string; name: string; color: string }[]) }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {getTaskName(checkIn.taskId)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {getCategoryName(checkIn.categoryId, categories as unknown as { id: string; name: string; color: string }[])}
                              {checkIn.duration && ` · ${checkIn.duration}分钟`}
                              {checkIn.note && ` · ${checkIn.note}`}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            {format(new Date(checkIn.timestamp), 'HH:mm')}
                          </div>
                        </div>
                        <div className="ml-7 mt-1">
                          {isTodaySelected && !checkIn.comment ? (
                            <div className="flex gap-2">
                              <input
                                value={editingComments[checkIn.id!] ?? ''}
                                onChange={(e) => setEditingComments(prev => ({ ...prev, [checkIn.id!]: e.target.value }))}
                                placeholder="添加评论..."
                                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                              />
                              <button
                                onClick={() => handleSaveComment(checkIn.id!)}
                                disabled={savingCommentId === checkIn.id || !(editingComments[checkIn.id!] ?? '').trim()}
                                className="px-3 py-1.5 brand-gradient text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                              >
                                保存
                              </button>
                            </div>
                          ) : checkIn.comment ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {checkIn.comment}</div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>当日无打卡记录</p>
                </div>
              );
            })()}

            {/* Category Summary */}
            {selectedDayCheckIns.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">分类统计</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    selectedDayCheckIns.reduce((acc, ci) => {
                      acc[ci.categoryId] = (acc[ci.categoryId] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([catId, count]) => (
                    <span
                      key={catId}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: `${getCategoryColor(catId, categories as unknown as { id: string; name: string; color: string }[])}15`,
                        color: getCategoryColor(catId, categories as unknown as { id: string; name: string; color: string }[]),
                      }}
                    >
                      {getCategoryName(catId, categories as unknown as { id: string; name: string; color: string }[])}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Entries for this day */}
            {selectedDaySummaries.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">历史提交记录（共 {selectedDaySummaries.length} 条）</h3>
                <div className="space-y-2">
                  {selectedDaySummaries.slice(1).map((s, idx) => (
                    <div key={s.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">#{idx + 2} · {format(new Date(s.updatedAt), 'HH:mm')}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{s.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  今日总结
                </h3>
                {saved ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm"><Check className="w-4 h-4" /> 保存成功</span>
                ) : (
                  <button
                    onClick={handleSaveSummary}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1.5 brand-gradient text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? '保存中...' : '提交'}
                  </button>
                )}
              </div>
              <textarea
                value={dailySummary}
                onChange={(e) => setDailySummary(e.target.value)}
                className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                rows={4}
                placeholder={`记录 ${selectedDay ? format(parseISO(selectedDay), 'M月d日', { locale: zhCN }) : ''} 的收获与反思...`}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">提交后自动清空，可点击日期查看历史总结</p>
            </div>
          </div>
        )}

        {/* Summary History */}
        {allSummaries.length > 0 && (
          <div className="card-warm p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Book className="w-5 h-5 text-orange-500" />
                历史总结记录
              </h2>
              {allSummaries.length > 3 && (
                <button
                  onClick={() => setShowAllSummaries(!showAllSummaries)}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  {showAllSummaries ? '收起' : `展开全部 ${allSummaries.length} 条`}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showAllSummaries && "rotate-180"
                    )}
                  />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(showAllSummaries ? allSummaries : allSummaries.slice(-3)).map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(parseISO(s.date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {s.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        {/* Task picker modal */}
        {checkInPickerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setCheckInPickerOpen(false)}>
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-md max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">选择任务</h3>
                <button onClick={() => setCheckInPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {activePlanTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-6">暂无 active plan 任务</p>
              ) : (
                <div className="space-y-2">
                  {activePlanTasks.map(t => (
                    <button
                      key={`${t.planId}-${t.id}`}
                      onClick={() => {
                        setCheckInTask({ planId: t.planId!, categoryId: t.planCategoryId, name: t.name });
                        setCheckInPickerOpen(false);
                        setCheckInDialogOpen(true);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{t.name}</div>
                      {t.learningRoute && t.learningRoute[0] && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{t.learningRoute[0]}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Check-in dialog (reused from Home page) */}
        {checkInTask && (
          <TaskCheckInDialog
            open={checkInDialogOpen}
            onClose={() => {
              setCheckInDialogOpen(false);
              setCheckInTask(null);
            }}
            planTaskName={checkInTask.name}
            onConfirm={async (duration, quantity, note, photo) => {
              await addCheckIn(
                `plan-${checkInTask.planId}-${checkInTask.name}`,
                checkInTask.categoryId,
                duration, quantity, note, photo
              );
              const today = format(new Date(), 'yyyy-MM-dd');
              const refreshed = await loadDateCheckIns(today);
              setSelectedDayCheckIns(refreshed);
              setWeeklyRecords(prev => prev.map(r =>
                r.date === today
                  ? { ...r, checkIns: refreshed, totalCount: refreshed.length }
                  : r
              ));
              setCheckInTask(null);
            }}
          />
        )}
        </div>
    );
};

export default Stats;
