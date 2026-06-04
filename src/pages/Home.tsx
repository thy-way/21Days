import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Flame,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  Minus,
} from 'lucide-react';
import { useCheckInStore, usePlanStore } from '@/store';
import { cn } from '@/utils';
import { QuadrantType } from '@/types';
import { TomatoTimer } from '@/components/TomatoTimer';
import { TaskCheckInDialog } from '@/components/CheckInDialog';
import { ProgressCard } from '@/components/ProgressCard';

// ===================== QuadrantCell =====================

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  AlertTriangle, Zap, Target, Minus,
};

interface QuadrantCellProps {
  quadrantId: QuadrantType;
  icon: string;
  title: string;
  desc: string;
  headerBg: string;
  renderTasks: (id: QuadrantType) => React.ReactNode;
}

const QuadrantCell: React.FC<QuadrantCellProps> = ({
  quadrantId, icon, title, desc, headerBg, renderTasks,
}) => {
  const [expanded, setExpanded] = useState(false);
  const taskContent = renderTasks(quadrantId);
  const taskCount = React.Children.count(taskContent);
  const IconComponent = ICON_MAP[icon];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-0">
      {/* 标题栏 */}
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-t-xl', headerBg)}>
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
        </div>
        {taskCount > 0 && (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-slate-900/70 rounded-full px-2 py-0.5">
            {taskCount}
          </span>
        )}
      </div>

      {/* 任务列表 */}
      <div className={cn('px-3 py-2 space-y-1 overflow-y-auto transition-all', expanded ? 'max-h-[300px]' : 'max-h-[140px]')}>
        {taskCount > 0 ? taskContent : (
          <div className="text-center text-gray-300 dark:text-gray-500 text-xs py-4">暂无任务</div>
        )}
      </div>

      {/* 展开/收起 */}
      {taskCount > 3 && (
        <button onClick={() => setExpanded(!expanded)}
          className="w-full py-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-100 dark:border-gray-700 transition-colors">
          {expanded ? '收起 ▲' : `展开全部 ${taskCount} 项 ▼`}
        </button>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const { todayCheckIns, streak, addCheckIn } = useCheckInStore();
  const { plans, loadPlans } = usePlanStore();
  const [selectedPlanTask, setSelectedPlanTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tomatoTask, setTomatoTask] = useState<{ name: string; planId?: number; planCategoryId?: string } | null>(null);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handlePlanTaskCheckIn = (planId: number, categoryId: string, name: string) => {
    setSelectedPlanTask({ planId, categoryId, name });
    setDialogOpen(true);
  };

  const confirmCheckIn = async (duration?: number, quantity?: number, note?: string, photo?: string) => {
    if (selectedPlanTask) {
      await addCheckIn(`plan-${selectedPlanTask.planId}-${selectedPlanTask.name}`, selectedPlanTask.categoryId, duration, quantity, note, photo);
    }
  };

  const renderQuadrantTasks = (quadrantId: QuadrantType) => {
    const fromPlans = plans.filter(p => p.isActive).flatMap(p =>
      p.tasks.filter(t => t.quadrant === quadrantId).map(t => ({ ...t, planId: p.id!, planCategoryId: p.categoryId }))
    );
    if (fromPlans.length === 0) return null;
    return fromPlans.map((pt: any) => (
      <div key={`plan-${pt.planId}-${pt.id}`}
        className="flex items-center justify-between bg-orange-50 dark:bg-orange-500/20 rounded-lg px-2.5 py-1.5 text-xs border border-orange-200 dark:border-orange-700 mb-1">
        <span className="truncate text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
          {pt.name}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setTomatoTask({ name: pt.name, planId: pt.planId, planCategoryId: pt.planCategoryId })}
            className="px-1.5 py-0.5 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-500/30 rounded text-xs font-medium">专注</button>
          <button onClick={() => handlePlanTaskCheckIn(pt.planId, pt.planCategoryId, pt.name)}
            className="px-1.5 py-0.5 bg-orange-500 text-white rounded text-xs hover:bg-orange-600">打卡</button>
        </div>
      </div>
    ));
  };

  const totalTasks = useMemo(() =>
    plans.filter(p => p.isActive).flatMap(p => p.tasks).length,
    [plans]
  );
  const completedTasks = useMemo(() =>
    plans
      .filter(p => p.isActive)
      .flatMap(p => p.tasks.map(t => ({ planId: p.id, task: t })))
      .filter(({ planId, task }) => todayCheckIns.some(ci => ci.taskId === `plan-${planId}-${task.name}`))
      .length,
    [plans, todayCheckIns]
  );
  const today = new Date();

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
              </div>
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-gray-600">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold text-orange-600 text-sm">{streak}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">天</span>
              </div>
              <div className="px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-500 dark:text-gray-400">
                DAY {streak > 21 ? 21 : streak}/21
              </div>
            </div>
          </div>
          <p className="text-amber-600/60 dark:text-amber-400/60 mt-2 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            {format(today, 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </p>
        </div>

        <ProgressCard completed={completedTasks} total={totalTasks} />

        {/* 四象限法则 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-500" />
            四象限法则
            <span className="ml-auto text-xs font-normal text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 rounded-full">优先管理</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <QuadrantCell quadrantId="urgent-important" icon="AlertTriangle" title="重要紧急" desc="立即处理" headerBg="bg-red-50"
              renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="urgent-not-important" icon="Zap" title="紧急不重要" desc="尽快处理" headerBg="bg-orange-50"
              renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="not-urgent-important" icon="Target" title="重要不紧急" desc="规划安排" headerBg="bg-amber-50"
              renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="not-urgent-not-important" icon="Minus" title="不重要不紧急" desc="减少或删除" headerBg="bg-gray-50"
              renderTasks={renderQuadrantTasks} />
          </div>
        </div>

      </div>

      <TaskCheckInDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        planTaskName={selectedPlanTask?.name} onConfirm={confirmCheckIn} />

      {tomatoTask && (
        <TomatoTimer taskName={tomatoTask.name}
          onCheckIn={(duration) => {
            if (tomatoTask.planId && tomatoTask.planCategoryId) {
              addCheckIn(`plan-${tomatoTask.planId}-${tomatoTask.name}`, tomatoTask.planCategoryId, duration);
            }
            setTomatoTask(null);
          }}
          onClose={() => setTomatoTask(null)} />
      )}
    </div>
  );
};
