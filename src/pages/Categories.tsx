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
import { CATEGORY_STYLES } from '@/utils/categoryStyles';

const CATEGORY_TABS = [
  { id: 'coding', label: '编程学习', icon: Code },
  { id: 'english', label: '英语', icon: Globe },
  { id: 'exam', label: '考试', icon: GraduationCap },
  { id: 'fitness', label: '健身', icon: Dumbbell },
  { id: 'side', label: '副业', icon: Briefcase },
];

// ===================== TaskCheckInDialog =====================

interface TaskCheckInDialogProps {
  open: boolean;
  onClose: () => void;
  planTaskName?: string;
  onConfirm: (duration?: number, quantity?: number, note?: string, photo?: string) => void;
}

const TaskCheckInDialog: React.FC<TaskCheckInDialogProps> = ({
  open, onClose, planTaskName, onConfirm,
}) => {
  const [duration, setDuration] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mode, setMode] = useState<'duration' | 'quantity'>('duration');

  if (!open || !planTaskName) return null;

  const handleConfirm = () => {
    if (mode === 'duration') {
      onConfirm(duration, undefined, note || undefined, photo || undefined);
    } else {
      onConfirm(undefined, quantity, note || undefined, photo || undefined);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setNote('');
      setPhoto('');
      setShowPhotoInput(false);
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        {showSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-600 mb-2">记录已保存！</p>
            <p className="text-gray-500 text-sm">继续加油！</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{planTaskName}</h3>
              <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setMode('duration')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'duration' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500')}>
                按时长
              </button>
              <button onClick={() => setMode('quantity')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'quantity' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500')}>
                按数量
              </button>
            </div>

            {mode === 'duration' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">时长（分钟）</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="5" max="180" step="5" value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  <span className="text-2xl font-bold text-orange-600 w-16 text-right">{duration}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5分钟</span><span>180分钟</span></div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">数量（次）</label>
                <div className="flex items-center justify-center space-x-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-2xl font-bold">-</button>
                  <span className="text-4xl font-bold text-gray-900 w-20 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-2xl font-bold">+</button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">备注（可选）</label>
              <input type="text" placeholder="添加备注..." value={note} onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="mb-4">
              <button type="button" onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <span className="mr-2">📷</span>
                {photo ? '更换照片' : '添加照片（可选）'}
              </button>
              {showPhotoInput && (
                <div className="mt-3">
                  {photo ? (
                    <div className="relative">
                      <img src={photo} alt="打卡照片" className="w-full h-40 object-cover rounded-xl" />
                      <button onClick={() => setPhoto('')}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <span className="text-3xl mb-2">📷</span>
                      <span className="text-sm text-gray-500">点击上传照片</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleConfirm}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold text-base hover:bg-orange-600 transition-colors">
              确认打卡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== PlanTaskDetailDialog =====================

interface PlanTaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  plan: UserPlan | null;
  task: UserPlanTask | null;
}

const PlanTaskDetailDialog: React.FC<PlanTaskDetailDialogProps> = ({ open, onClose, plan, task }) => {
  if (!open || !task || !plan) return null;

  const style = CATEGORY_STYLES[plan.categoryId] || CATEGORY_STYLES.coding;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold", style.bg)}>
                {plan.title.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{task.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">来自计划：{plan.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {task.learningRoute && task.learningRoute.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
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
                      isWeekHeading && 'font-bold text-gray-800 mt-2',
                      isSubItem && 'text-gray-600 pl-4',
                      !isWeekHeading && !isSubItem && 'text-gray-700'
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
              <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                推荐资源
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {task.resources.map((r, i) => (
                  r.url ? (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-orange-600 font-medium truncate">{r.name}</span>
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{r.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {task.quadrant && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">四象限：</span>
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
  const [activeTab, setActiveTab] = useState<CategoryId>('coding');
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
      await addCheckIn(`plan-${selectedPlanTask.planId}-${selectedPlanTask.name}`, selectedPlanTask.categoryId as any, duration, quantity, note, photo);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            21Days<span className="text-sm text-gray-400 font-normal ml-1">全部任务</span>
            <div className="flex items-center gap-1.5 text-base ml-auto text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak}</span>
              <span className="text-gray-400 font-normal">天</span>
            </div>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-1.5">
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
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-white shadow-md text-gray-900 border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 border border-transparent'
                  )}>
                  <TabIcon className={cn('w-4 h-4', isActive && CATEGORY_STYLES[tab.id as CategoryId]?.text)} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-card p-5 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="font-medium text-gray-800">今日进度</span>
            </div>
            <span className="font-bold text-gray-800">{completedPlanTasks}/{totalPlanTasks} 项</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700"
              style={{ width: `${totalPlanTasks > 0 ? (completedPlanTasks / totalPlanTasks) * 100 : 0}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>已完成 {Math.round(totalPlanTasks > 0 ? (completedPlanTasks / totalPlanTasks) * 100 : 0)}%</span>
            <span>{totalPlanTasks > 0 && completedPlanTasks >= totalPlanTasks ? '🎉 全部完成！' : '加油！'}</span>
          </div>
        </div>

        {/* Plan Tasks for selected category */}
        {activePlansForTab.length > 0 ? (
          <div className="space-y-4">
            {activePlansForTab.map(plan => {
              const style = CATEGORY_STYLES[plan.categoryId] || CATEGORY_STYLES.coding;
              return (
                <div key={plan.id} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
                  {/* Plan Header */}
                  <div className={cn('px-5 py-3 flex items-center gap-2', style.bgLight)}>
                    <BookOpen className={cn('w-4 h-4', style.text)} />
                    <span className={cn('font-semibold text-sm', style.text)}>{plan.title}</span>
                    <span className="ml-auto text-xs text-gray-400">{plan.tasks.length} 个任务</span>
                  </div>

                  {/* Plan Tasks */}
                  <div className="p-4 space-y-2">
                    {plan.tasks.map(task => {
                      const taskCheckInId = `plan-${plan.id}-${task.name}`;
                      const isCheckedIn = checkedInTaskIds.includes(taskCheckInId);
                      const isExpanded = expandedTasks.has(task.id);
                      return (
                        <div key={task.id}
                          className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
                          {/* Clickable Task Header */}
                          <button onClick={() => toggleTaskExpand(task.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100/50 transition-colors">
                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                              <span className={cn(
                                'w-2 h-2 rounded-full flex-shrink-0',
                                isCheckedIn ? 'bg-green-500' : 'bg-amber-400'
                              )} />
                              <span className={cn(
                                'text-sm font-medium truncate',
                                isCheckedIn ? 'text-gray-400 line-through' : 'text-gray-800'
                              )}>
                                {task.name}
                              </span>
                              {task.quadrant && (
                                <span className="text-xs text-gray-400 hidden sm:inline">
                                  · {task.quadrant === 'urgent-important' ? '重要紧急'
                                    : task.quadrant === 'urgent-not-important' ? '紧急不重要'
                                    : task.quadrant === 'not-urgent-important' ? '重要不紧急'
                                    : '不重要不紧急'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              {isCheckedIn ? (
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-medium">
                                  <Check className="w-3 h-3" /> 已打卡
                                </span>
                              ) : (
                                <button onClick={(e) => { e.stopPropagation(); handlePlanCheckIn(plan, task); }}
                                  className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                                  打卡
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); handlePlanDetail(plan, task); }}
                                className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                详情
                              </button>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </button>

                          {/* Collapsible Content */}
                          {isExpanded && (
                            <div className="border-t border-amber-200/50">
                              {/* Learning Route Preview */}
                              {task.learningRoute && task.learningRoute.length > 0 && (
                                <div className="px-4 pt-2 pb-1">
                                  {task.learningRoute.slice(0, 3).map((line, i) => (
                                    <div key={i} className={cn(
                                      'text-xs leading-relaxed',
                                      line.startsWith('•') || line.startsWith('-') ? 'text-gray-500 pl-3' : 'text-gray-600 font-medium'
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
                                <div className="flex flex-wrap gap-1.5 px-4 pt-1 pb-3">
                                  {task.resources.map((r, ri) => (
                                    r.url ? (
                                      <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                        className="px-2 py-0.5 bg-white text-gray-500 rounded text-xs hover:text-orange-500 border border-gray-200">
                                        {r.name}
                                      </a>
                                    ) : (
                                      <span key={ri} className="px-2 py-0.5 bg-white text-gray-400 rounded text-xs border border-gray-200">
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
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              该分类下暂无计划任务
            </h3>
            <p className="text-gray-500 text-sm">
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
