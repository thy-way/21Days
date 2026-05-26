import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Code, Globe, GraduationCap, Dumbbell, Briefcase,
  BookOpen, Clock, Flame, Check, X, Star, Target, Zap,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useCheckInStore, usePlanStore } from '@/store';
import { UserPlanTask, UserPlan, CategoryId } from '@/types';
import { cn } from '@/utils';
import { CATEGORY_STYLES, getCategoryStyles } from '@/utils/categoryStyles';
import { TaskCheckInDialog } from '@/components/CheckInDialog';
import { ProgressCard } from '@/components/ProgressCard';

const CATEGORY_TABS = [
  { id: 'coding', label: '编程学习', icon: Code },
  { id: 'english', label: '英语', icon: Globe },
  { id: 'exam', label: '考试', icon: GraduationCap },
  { id: 'fitness', label: '健身', icon: Dumbbell },
  { id: 'side', label: '副业', icon: Briefcase },
];

// ===================== PlanTaskDetailDialog =====================

interface PlanTaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  plan: UserPlan | null;
  task: UserPlanTask | null;
}

const PlanTaskDetailDialog: React.FC<PlanTaskDetailDialogProps> = ({ open, onClose, plan, task }) => {
  if (!open || !task || !plan) return null;

  const style = getCategoryStyles(plan.categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold", style.bg)}>
                {plan.title.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{task.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">来自计划：{plan.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {task.learningRoute && task.learningRoute.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                学习路线
              </h4>
              <div className="space-y-1.5">
                {task.learningRoute.map((item, i) => {
                  if (!item.trim()) return <div key={i} className="h-2" />;
                  const isWeekHeading = /^(Week|Day|第)/.test(item.trim());
                  const isSubItem = item.trim().startsWith('•') || item.trim().startsWith('-');
                  return (
                    <div key={i} className={cn(
                      'text-sm leading-relaxed',
                      isWeekHeading && 'font-bold text-gray-800 dark:text-gray-200 mt-2',
                      isSubItem && 'text-gray-600 dark:text-gray-400 pl-4',
                      !isWeekHeading && !isSubItem && 'text-gray-700 dark:text-gray-300'
                    )}>
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {task.resources && task.resources.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                推荐资源
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {task.resources.map((r, i) => (
                  r.url ? (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 font-medium truncate">{r.name}</span>
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{r.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {task.quadrant && (
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">四象限：</span>
              <span className={cn(
                'text-sm font-medium ml-1',
                task.quadrant === 'urgent-important' ? 'text-red-600'
                  : task.quadrant === 'urgent-not-important' ? 'text-yellow-600'
                  : task.quadrant === 'not-urgent-important' ? 'text-blue-600'
                  : 'text-gray-600'
              )}>
                {task.quadrant === 'urgent-important' ? '重要紧急'
                  : task.quadrant === 'urgent-not-important' ? '紧急不重要'
                  : task.quadrant === 'not-urgent-important' ? '重要不紧急'
                  : '不重要不紧急'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===================== Main Categories Component =====================

export const Categories: React.FC = () => {
  const { todayCheckIns, streak, addCheckIn } = useCheckInStore();
  const { plans, loadPlans } = usePlanStore();
  const [activeTab, setActiveTab] = useState<string>('coding');
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [planDetailOpen, setPlanDetailOpen] = useState(false);
  const [planDetailTask, setPlanDetailTask] = useState<{ plan: UserPlan; task: UserPlanTask } | null>(null);
  const [selectedPlanTask, setSelectedPlanTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const today = new Date();

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const checkedInTaskIds = useMemo(
    () => todayCheckIns.map(ci => ci.taskId),
    [todayCheckIns]
  );

  const totalPlanTasks = useMemo(
    () => plans.filter(p => p.isActive).flatMap(p => p.tasks).length,
    [plans]
  );

  const completedPlanTasks = useMemo(
    () => plans.filter(p => p.isActive)
      .flatMap(p => p.tasks.map(t => ({ planId: p.id, task: t })))
      .filter(({ planId, task }) => todayCheckIns.some(ci => ci.taskId === `plan-${planId}-${task.name}`))
      .length,
    [plans, todayCheckIns]
  );

  const activePlansForTab = useMemo(
    () => plans.filter(p => p.isActive && p.categoryId === activeTab),
    [plans, activeTab]
  );

  const handlePlanCheckIn = (plan: UserPlan, task: UserPlanTask) => {
    setSelectedPlanTask({ planId: plan.id!, categoryId: plan.categoryId, name: task.name });
    setCheckInOpen(true);
  };

  const handlePlanDetail = (plan: UserPlan, task: UserPlanTask) => {
    setPlanDetailTask({ plan, task });
    setPlanDetailOpen(true);
  };

  const confirmCheckIn = async (duration?: number, quantity?: number, note?: string, photo?: string) => {
    if (selectedPlanTask) {
      await addCheckIn(`plan-${selectedPlanTask.planId}-${selectedPlanTask.name}`, selectedPlanTask.categoryId, duration, quantity, note, photo);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="brand-text-gradient">21Days</span>
                <span className="text-sm text-gray-400 dark:text-gray-500 font-normal ml-2">全部任务</span>
              </div>
            </h1>
              <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-gray-600">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold text-orange-600 text-sm">{streak}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">天</span>
              </div>
            </div>
          </div>
          <p className="text-amber-600/60 dark:text-amber-400/60 mt-2 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            {format(today, 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </p>
        </div>

        {/* Category Tab Bar */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as CategoryId)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-white dark:bg-slate-800 shadow-md text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-transparent'
                  )}>
                  <TabIcon className={cn('w-4 h-4', isActive && CATEGORY_STYLES[tab.id as CategoryId]?.text)} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <ProgressCard completed={completedPlanTasks} total={totalPlanTasks} />

        {/* Plan Tasks for selected category */}
        {activePlansForTab.length > 0 ? (
          <div className="space-y-4">
            {activePlansForTab.map(plan => {
              const style = getCategoryStyles(plan.categoryId);
              return (
                <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Plan Header */}
                  <div className={cn('px-5 py-3 flex items-center gap-2', style.bgLight)}>
                    <BookOpen className={cn('w-4 h-4', style.text)} />
                    <span className={cn('font-semibold text-sm', style.text)}>{plan.title}</span>
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{plan.tasks.length} 个任务</span>
                  </div>

                  {/* Plan Tasks */}
                  <div className="p-4 space-y-2">
                    {plan.tasks.map(task => {
                      const taskCheckInId = `plan-${plan.id}-${task.name}`;
                      const isCheckedIn = checkedInTaskIds.includes(taskCheckInId);
                      const isExpanded = expandedTasks.has(task.id);
                      return (
                        <div key={task.id}
                          className="bg-orange-50/50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-700 overflow-hidden">
                          {/* Clickable Task Header */}
                          <button onClick={() => toggleTaskExpand(task.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100/50 dark:hover:bg-orange-500/20 transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                              <span className={cn(
                                'w-2 h-2 rounded-full flex-shrink-0',
                                isCheckedIn ? 'bg-green-500' : 'bg-orange-400'
                              )} />
                              <span className={cn(
                                'text-sm font-medium truncate',
                                isCheckedIn ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
                              )}>
                                {task.name}
                              </span>
                              {task.quadrant && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                  · {task.quadrant === 'urgent-important' ? '重要紧急'
                                    : task.quadrant === 'urgent-not-important' ? '紧急不重要'
                                    : task.quadrant === 'not-urgent-important' ? '重要不紧急'
                                    : '不重要不紧急'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              {isCheckedIn ? (
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium">
                                  <Check className="w-3 h-3" /> 已打卡
                                </span>
                              ) : (
                                <button onClick={(e) => { e.stopPropagation(); handlePlanCheckIn(plan, task); }}
                                  className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                                  打卡
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); handlePlanDetail(plan, task); }}
                                 className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                 详情
                              </button>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                            </div>
                          </button>

                          {/* Collapsible Content */}
                          {isExpanded && (
                            <div className="border-t border-orange-200/50 dark:border-orange-700/50">
                              {/* Learning Route Preview */}
                              {task.learningRoute && task.learningRoute.length > 0 && (
                                <div className="px-4 pt-2 pb-1">
                                  {task.learningRoute.slice(0, 3).map((line, i) => (
                                    <div key={i} className={cn(
                                      'text-xs leading-relaxed',
                                      line.startsWith('•') || line.startsWith('-') ? 'text-gray-500 dark:text-gray-400 pl-3' : 'text-gray-600 dark:text-gray-400 font-medium'
                                    )}>
                                      {line}
                                    </div>
                                  ))}
                                  {task.learningRoute.length > 3 && (
                                    <button onClick={(e) => { e.stopPropagation(); handlePlanDetail(plan, task); }}
                                      className="text-xs text-orange-500 hover:text-orange-600 mt-1">
                                      查看全部 {task.learningRoute.length} 项 →
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Resources */}
                              {task.resources && task.resources.length > 0 && (
                                <div className="flex flex-wrap gap-2 px-4 pt-1 pb-3">
                                  {task.resources.map((r, ri) => (
                                    r.url ? (
                                      <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                        className="px-2 py-0.5 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded text-xs hover:text-orange-500 border border-gray-200 dark:border-gray-600">
                                        {r.name}
                                      </a>
                                    ) : (
                                      <span key={ri} className="px-2 py-0.5 bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 rounded text-xs border border-gray-200 dark:border-gray-600">
                                        {r.name}
                                      </span>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              该分类下暂无计划任务
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              前往「计划」页面创建学习计划，任务将在这里展示
            </p>
          </div>
        )}
      </div>

      <TaskCheckInDialog open={checkInOpen} onClose={() => setCheckInOpen(false)}
        planTaskName={selectedPlanTask?.name} onConfirm={confirmCheckIn} />

      <PlanTaskDetailDialog open={planDetailOpen} onClose={() => setPlanDetailOpen(false)}
        plan={planDetailTask?.plan || null} task={planDetailTask?.task || null} />
    </div>
  );
};

export default Categories;
