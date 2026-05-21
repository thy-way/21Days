import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Trash2, Edit2, CheckCircle, Circle, AlertTriangle, Zap, Target, Minus, LayoutGrid } from 'lucide-react';
import { useQuadrantStore } from '@/store';
import { useCheckInStore } from '@/store';
import { QuadrantTask } from '@/types';
import { cn } from '@/utils';

const Q_ICONS: Record<string, React.ComponentType<any>> = {
  AlertTriangle, Zap, Target, Minus,
};

const QUADRANTS = [
  {
    id: 'urgent-important' as const,
    title: '重要紧急',
    description: '立即处理',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    icon: 'AlertTriangle',
  },
  {
    id: 'urgent-not-important' as const,
    title: '紧急不重要',
    description: '尽快处理',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: 'Zap',
  },
  {
    id: 'not-urgent-important' as const,
    title: '重要不紧急',
    description: '规划安排',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: 'Target',
  },
  {
    id: 'not-urgent-not-important' as const,
    title: '不重要不紧急',
    description: '减少或删除',
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    icon: 'Minus',
  },
];

export const Quadrants: React.FC = () => {
  const { loadTasks, addTask, updateTask, deleteTask, getTasksByQuadrant, loading } = useQuadrantStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<{ urgency: 'high' | 'low', importance: 'high' | 'low' } | null>(null);
  const [editingTask, setEditingTask] = useState<QuadrantTask | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (data: {
    title: string;
    description: string;
    urgency: 'high' | 'low';
    importance: 'high' | 'low';
    dueDate?: string;
    relatedTaskId?: string;
  }) => {
    await addTask({
      ...data,
      status: 'pending',
    });
    setShowAddDialog(false);
    setSelectedQuadrant(null);
  };

  const handleUpdateTask = async (id: number, updates: Partial<QuadrantTask>) => {
    await updateTask(id, updates);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('确定要删除这个任务吗？')) {
      await deleteTask(id);
    }
  };

  const toggleTaskStatus = async (task: QuadrantTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id!, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen brand-gradient-vertical p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 text-amber-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="brand-text-gradient">21Days</span>
              <span className="text-gray-400 text-base font-normal ml-2">四象限法则</span>
            </div>
          </h1>
          <p className="text-amber-600/60 mt-1 text-sm">重要-紧急时间管理工具</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {QUADRANTS.map((q) => {
            const quadrantTasks = getTasksByQuadrant(q.id);
            const completedCount = quadrantTasks.filter(t => t.status === 'completed').length;
            return (
              <div key={q.id} className={cn('rounded-xl p-3 sm:p-4', q.bgColor, q.borderColor, 'border')}>
                <div className="flex items-center justify-between mb-1">
                  {React.createElement(Q_ICONS[q.icon], { className: 'w-5 h-5 sm:w-6 sm:h-6', ...(q.id === 'urgent-important' ? { color: '#dc2626' } : q.id === 'urgent-not-important' ? { color: '#d97706' } : q.id === 'not-urgent-important' ? { color: '#2563eb' } : { color: '#6b7280' }) })}
                  <span className={cn('text-xs sm:text-sm font-bold', q.textColor)}>
                    {completedCount}/{quadrantTasks.length}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700">{q.title}</div>
              </div>
            );
          })}
        </div>

        {/* Quadrants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {QUADRANTS.map((quadrant) => {
            const quadrantTasks = getTasksByQuadrant(quadrant.id);
            return (
              <div key={quadrant.id} className={cn(
                'rounded-2xl p-4 sm:p-5 shadow-lg border-2',
                quadrant.bgColor,
                quadrant.borderColor
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      {React.createElement(Q_ICONS[quadrant.icon], { className: 'w-5 h-5 sm:w-6 sm:h-6', ...(quadrant.id === 'urgent-important' ? { color: '#dc2626' } : quadrant.id === 'urgent-not-important' ? { color: '#d97706' } : quadrant.id === 'not-urgent-important' ? { color: '#2563eb' } : { color: '#6b7280' }) })}
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">{quadrant.title}</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{quadrant.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      const urgency = quadrant.id.includes('urgent') ? 'high' : 'low';
                      const importance = quadrant.id.includes('important') ? 'high' : 'low';
                      setSelectedQuadrant({ urgency, importance });
                      setShowAddDialog(true);
                    }}
                    className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {quadrantTasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">暂无任务</div>
                  ) : (
                    quadrantTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskStatus(task)}
                        onEdit={() => setEditingTask(task)}
                        onDelete={() => handleDeleteTask(task.id!)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Dialog */}
      {showAddDialog && (
        <AddTaskDialog
          onClose={() => {
            setShowAddDialog(false);
            setSelectedQuadrant(null);
          }}
          onConfirm={handleAddTask}
          defaultUrgency={selectedQuadrant?.urgency}
          defaultImportance={selectedQuadrant?.importance}
        />
      )}

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onConfirm={(updates) => handleUpdateTask(editingTask.id!, updates)}
        />
      )}
    </div>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: QuadrantTask;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <div className={cn(
      'bg-white rounded-xl p-3 sm:p-4 shadow-sm border transition-all',
      'hover:shadow-md',
      task.status === 'completed' ? 'opacity-60' : ''
    )}>
      <div className="flex items-start justify-between mb-2">
        <button
          onClick={onToggle}
          className="flex-shrink-0 mt-1"
        >
          {task.status === 'completed' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
          )}
        </button>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <h3 className={cn(
        'font-semibold text-sm sm:text-base text-gray-900',
        task.status === 'completed' ? 'line-through text-gray-500' : ''
      )}>
        {task.title}
      </h3>
      {task.description && (
        <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
      )}
      {task.dueDate && (
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(task.dueDate).toLocaleDateString('zh-CN')}
        </div>
      )}
    </div>
  );
};

// Add Task Dialog Component
const AddTaskDialog: React.FC<{
  onClose: () => void;
  onConfirm: (data: {
    title: string;
    description: string;
    urgency: 'high' | 'low';
    importance: 'high' | 'low';
    dueDate?: string;
    relatedTaskId?: string;
  }) => void;
  defaultUrgency?: 'high' | 'low';
  defaultImportance?: 'high' | 'low';
}> = ({ onClose, onConfirm, defaultUrgency = 'high', defaultImportance = 'high' }) => {
  const { tasks } = useCheckInStore();
  const enabledTasks = tasks.filter(t => t.enabled).sort((a, b) => a.order - b.order);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'low'>(defaultUrgency);
  const [importance, setImportance] = useState<'high' | 'low'>(defaultImportance);
  const [dueDate, setDueDate] = useState('');
  const [relatedTaskId, setRelatedTaskId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onConfirm({
      title: title.trim(),
      description: description.trim(),
      urgency,
      importance,
      dueDate: dueDate || undefined,
      relatedTaskId: relatedTaskId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">添加任务</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="输入任务标题"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">关联打卡事项（可选）</label>
            <select
              value={relatedTaskId}
              onChange={(e) => setRelatedTaskId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">不关联打卡事项</option>
              {enabledTasks.map((task) => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={2}
              placeholder="添加任务描述（可选）"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">紧急程度</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'high' | 'low')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="high">紧急</option>
                <option value="low">不紧急</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">重要程度</label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as 'high' | 'low')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="high">重要</option>
                <option value="low">不重要</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 brand-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Task Dialog Component
const EditTaskDialog: React.FC<{
  task: QuadrantTask;
  onClose: () => void;
  onConfirm: (updates: Partial<QuadrantTask>) => void;
}> = ({ task, onClose, onConfirm }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [urgency, setUrgency] = useState(task.urgency);
  const [importance, setImportance] = useState(task.importance);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onConfirm({
      title: title.trim(),
      description: description.trim(),
      urgency,
      importance,
      status,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">编辑任务</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任务标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">紧急程度</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'high' | 'low')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="high">紧急</option>
                <option value="low">不紧急</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">重要程度</label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as 'high' | 'low')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="high">重要</option>
                <option value="low">不重要</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="pending">待办</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 brand-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};