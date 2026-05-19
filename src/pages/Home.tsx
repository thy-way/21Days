import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Flame,
  Zap,
  Star,
  Check,
  Target,
  X,
  Clock,
} from 'lucide-react';
import { useCheckInStore, usePlanStore } from '@/store';
import { Task, QuadrantType } from '@/types';
import { cn } from '@/utils';
import { TomatoTimer } from '@/components/TomatoTimer';

interface TaskCheckInDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  planTaskName?: string;
  onConfirm: (duration?: number, quantity?: number, note?: string, photo?: string) => void;
}

const TaskCheckInDialog: React.FC<TaskCheckInDialogProps> = ({
  open, onClose, task, planTaskName, onConfirm,
}) => {
  const [duration, setDuration] = useState(task?.defaultDuration || 30);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mode, setMode] = useState<'duration' | 'quantity'>(
    task?.unit === '分钟' ? 'duration' : 'quantity'
  );

  useEffect(() => {
    if (task) {
      setMode(task.unit === '分钟' ? 'duration' : 'quantity');
      setDuration(task.defaultDuration || 30);
    }
  }, [task]);

  if (!open || (!task && !planTaskName)) return null;

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
              <h3 className="text-xl font-bold text-gray-900">{planTaskName || task?.name}</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">数量（{task?.unit || '次'}）</label>
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

// ===================== QuadrantCell =====================

interface QuadrantCellProps {
  quadrantId: QuadrantType;
  icon: string;
  title: string;
  desc: string;
  headerBg: string;
  tasks: Task[];
  plans: any[];
  draggedTask: Task | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: QuadrantType) => void;
  renderTasks: (id: QuadrantType) => React.ReactNode;
}

const QuadrantCell: React.FC<QuadrantCellProps> = ({
  quadrantId, icon, title, desc, headerBg, onDragOver, onDrop, renderTasks, draggedTask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const taskContent = renderTasks(quadrantId);
  const taskCount = React.Children.count(taskContent);

  return (
    <div onDragOver={onDragOver} onDrop={() => onDrop(quadrantId)}
      className={cn('bg-white rounded-xl shadow-card border border-gray-100 flex flex-col min-h-0 transition-shadow',
        draggedTask && 'ring-2 ring-orange-400')}>
      {/* 标题栏 */}
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-t-xl', headerBg)}>
        <span className="text-base">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-gray-800">{title}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
        {taskCount > 0 && (
          <span className="text-xs font-medium text-gray-400 bg-white/70 rounded-full px-2 py-0.5">
            {taskCount}
          </span>
        )}
      </div>

      {/* 任务列表 */}
      <div className={cn('px-3 py-2 space-y-1 overflow-y-auto transition-all', expanded ? 'max-h-[300px]' : 'max-h-[140px]')}>
        {taskCount > 0 ? taskContent : (
          <div className="text-center text-gray-300 text-xs py-4">拖拽任务到此处</div>
        )}
      </div>

      {/* 展开/收起 */}
      {taskCount > 3 && (
        <button onClick={() => setExpanded(!expanded)}
          className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 border-t border-gray-100 transition-colors">
          {expanded ? '收起 ▲' : `展开全部 ${taskCount} 项 ▼`}
        </button>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const { todayCheckIns, tasks, streak, addCheckIn, updateTaskQuadrant } = useCheckInStore();
  const { plans, loadPlans } = usePlanStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPlanTask, setSelectedPlanTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [tomatoTask, setTomatoTask] = useState<{ name: string; taskId?: string; categoryId?: string; planId?: number; planCategoryId?: string } | null>(null);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handleCheckIn = (task: Task) => {
    setSelectedTask(task);
    setSelectedPlanTask(null);
    setDialogOpen(true);
  };

  const handlePlanTaskCheckIn = (planId: number, categoryId: string, name: string) => {
    setSelectedPlanTask({ planId, categoryId, name });
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const confirmCheckIn = async (duration?: number, quantity?: number, note?: string, photo?: string) => {
    if (selectedTask) {
      await addCheckIn(selectedTask.id, selectedTask.categoryId, duration, quantity, note, photo);
    } else if (selectedPlanTask) {
      await addCheckIn(`plan-${selectedPlanTask.planId}-${selectedPlanTask.name}`, selectedPlanTask.categoryId as any, duration, quantity, note, photo);
    }
  };

  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (quadrantId: QuadrantType) => {
    if (draggedTask) {
      await updateTaskQuadrant(draggedTask.id, quadrantId);
      setDraggedTask(null);
    }
  };

  const renderQuadrantTasks = (quadrantId: QuadrantType) => {
    const builtIn = tasks.filter(t => t.quadrant === quadrantId);
    const fromPlans = plans.filter(p => p.isActive).flatMap(p =>
      p.tasks.filter(t => t.quadrant === quadrantId).map(t => ({ ...t, planId: p.id!, planCategoryId: p.categoryId }))
    );
    const all = [...builtIn, ...fromPlans];
    if (all.length === 0) return null;
    return all.map((item) => {
      const isPlan = 'planId' in item;
      if (isPlan) {
        const pt = item as any;
        return (
          <div key={`plan-${pt.planId}-${pt.id}`}
            className="flex items-center justify-between bg-amber-50 rounded-lg px-2.5 py-1.5 text-xs border border-amber-200 mb-1">
            <span className="truncate text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              {pt.name}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setTomatoTask({ name: pt.name, planId: pt.planId, planCategoryId: pt.planCategoryId })}
                className="px-1 py-0.5 text-orange-500 hover:bg-orange-100 rounded text-xs">🍅</button>
              <button onClick={() => handlePlanTaskCheckIn(pt.planId, pt.planCategoryId, pt.name)}
                className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">打卡</button>
            </div>
          </div>
        );
      }
      const task = item as Task;
      return (
        <div key={task.id} draggable onDragStart={() => handleDragStart(task)}
          className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 text-xs cursor-move hover:bg-gray-100 mb-1">
          <span className="truncate text-gray-700">{task.name}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setTomatoTask({ name: task.name, taskId: task.id, categoryId: task.categoryId })}
              className="px-1 py-0.5 text-orange-500 hover:bg-orange-100 rounded text-xs">🍅</button>
            <button onClick={() => handleCheckIn(task)}
              className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">打卡</button>
          </div>
        </div>
      );
    });
  };

  const totalTasks = plans.filter(p => p.isActive).flatMap(p => p.tasks).length;
  const completedTasks = plans
    .filter(p => p.isActive)
    .flatMap(p => p.tasks.map(t => ({ planId: p.id, task: t })))
    .filter(({ planId, task }) => todayCheckIns.some(ci => ci.taskId === `plan-${planId}-${task.name}`))
    .length;
  const today = new Date();

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            21Days<span className="text-sm text-gray-400 font-normal ml-1">今日打卡</span>
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

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="font-medium text-gray-800">今日进度</span>
            </div>
            <span className="font-bold text-gray-800">{completedTasks}/{totalTasks} 项</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700"
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>已完成 {Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)}%</span>
            <span>{completedTasks === totalTasks && totalTasks > 0 ? '🎉 全部完成！' : '加油！'}</span>
          </div>
        </div>

        {/* 四象限法则 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-500" />
            四象限法则
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <QuadrantCell quadrantId="urgent-important" icon="🔥" title="重要紧急" desc="立即处理" headerBg="bg-red-50"
              tasks={tasks} plans={plans} draggedTask={draggedTask} onDragOver={handleDragOver} onDrop={handleDrop} renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="urgent-not-important" icon="⚡" title="紧急不重要" desc="尽快处理" headerBg="bg-amber-50"
              tasks={tasks} plans={plans} draggedTask={draggedTask} onDragOver={handleDragOver} onDrop={handleDrop} renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="not-urgent-important" icon="🎯" title="重要不紧急" desc="规划安排" headerBg="bg-blue-50"
              tasks={tasks} plans={plans} draggedTask={draggedTask} onDragOver={handleDragOver} onDrop={handleDrop} renderTasks={renderQuadrantTasks} />
            <QuadrantCell quadrantId="not-urgent-not-important" icon="🗑️" title="不重要不紧急" desc="减少或删除" headerBg="bg-gray-50"
              tasks={tasks} plans={plans} draggedTask={draggedTask} onDragOver={handleDragOver} onDrop={handleDrop} renderTasks={renderQuadrantTasks} />
          </div>
        </div>

        {/* 查看全部任务 */}
        <div className="text-center">
          <a href="/categories"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white rounded-xl shadow-card text-sm font-medium text-gray-500 hover:text-gray-700 hover:shadow-card-hover transition-shadow">
            <Target className="w-4 h-4" />
            查看全部任务
          </a>
        </div>
      </div>

      <TaskCheckInDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        task={selectedTask} planTaskName={selectedPlanTask?.name} onConfirm={confirmCheckIn} />

      {tomatoTask && (
        <TomatoTimer taskName={tomatoTask.name}
          onCheckIn={(duration) => {
            if (tomatoTask.taskId && tomatoTask.categoryId) {
              addCheckIn(tomatoTask.taskId, tomatoTask.categoryId as any, duration);
            } else if (tomatoTask.planId && tomatoTask.planCategoryId) {
              addCheckIn(`plan-${tomatoTask.planId}-${tomatoTask.name}`, tomatoTask.planCategoryId as any, duration);
            }
            setTomatoTask(null);
          }}
          onClose={() => setTomatoTask(null)} />
      )}
    </div>
  );
};
