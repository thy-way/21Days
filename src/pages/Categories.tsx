import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Code, Globe, GraduationCap, Dumbbell, Briefcase,
  BookOpen, BookMarked, Headphones, Mic, CheckCircle, CheckSquare,
  Award, ShoppingCart, Server, BarChart3, FileText, MessageCircle,
  Coffee, Terminal, FileCode, Layout, Binary, Heart, Activity,
  Camera, Sparkles, Video, Rocket, Users, Search, Package,
  Clock, Flame, Check, X, Star, Target, Zap, Box, Pen,
  Play, Pause, Monitor,
} from 'lucide-react';
import { useCheckInStore } from '@/store';
import { Task } from '@/types';
import { DEFAULT_TASKS } from '@/types/categories';
import { cn } from '@/utils';
import { getCategoryStyles } from '@/utils/categoryStyles';

const ENCOURAGING_MESSAGES = [
  '今天的努力是明天的基石 💪',
  '坚持就是胜利！加油！',
  '你已经很棒了，继续前进！',
  '每一步都是进步 🌟',
  '自律即自由',
  '今天的付出，明天的收获',
  '不忘初心，砥砺前行',
  '做个不将就的人',
  'Don\'t stop when you\'re tired, stop when you\'re done',
  'Better late than never',
  '相信过程，相信时间',
  '为未来的自己奋斗',
  '每一个不曾起舞的日子，都是对生命的辜负',
  'Stay hungry, stay foolish',
  '行动是克服恐惧的唯一方法',
  '你今天的努力，是未来选择的底气',
  '卓越不是一次行为，而是一种习惯',
  '不积跬步，无以至千里',
  '前行路上，有风有雨是常态',
  '既然选择了远方，便只顾风雨兼程',
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dumbbell, Heart, Activity, Sparkles, Camera,
  Coffee, Package, Terminal, FileCode, Layout, Binary, BookMarked,
  ShoppingCart, Server, BarChart3, FileText, MessageCircle,
  Headphones, Mic, BookOpen, Pen: Pen, CheckCircle, Award,
  CheckSquare, Briefcase, Video, Rocket, Users,
  GraduationCap, Search, Globe, Code, Box, Monitor,
};

const CATEGORY_TABS = [
  { id: 'coding', label: '编程学习', icon: Code },
  { id: 'english', label: '英语', icon: Globe },
  { id: 'exam', label: '考试', icon: GraduationCap },
  { id: 'fitness', label: '健身', icon: Dumbbell },
  { id: 'side', label: '副业', icon: Briefcase },
];

const MODULE_TABS: Record<string, { id: string; label: string }[]> = {
  coding: [
    { id: 'coding-cs', label: '计算机基础' },
    { id: 'coding-algorithm', label: '数据结构算法' },
    { id: 'coding-frontend', label: 'TS全栈' },
    { id: 'coding-python', label: 'Python全栈' },
    { id: 'coding-java', label: 'Java全栈' },
    { id: 'coding-go', label: 'Go全栈' },
  ],
  english: [
    { id: 'english-listening-learn', label: '听力' },
    { id: 'english-speaking-learn', label: '口语' },
    { id: 'english-reading-learn', label: '阅读' },
    { id: 'english-writing-learn', label: '写作' },
    { id: 'english-vocabulary', label: '词汇' },
  ],
  exam: [
    { id: 'exam-pmp', label: 'PMP' },
    { id: 'exam-csip', label: 'CSIP' },
    { id: 'exam-ielts-learn', label: 'IELTS' },
  ],
  fitness: [
    { id: 'fitness-training', label: '训练' },
    { id: 'fitness-photo', label: '记录' },
  ],
  side: [
    { id: 'side-action', label: '行动' },
    { id: 'side-learning', label: '学习' },
  ],
};

const SUB_MODULE_PROJECT_MAP: Record<string, string[]> = {
  'coding-frontend': ['coding-project-blog', 'coding-project-ai'],
  'coding-python': ['coding-project-python'],
  'coding-java': ['coding-project-java'],
  'coding-go': ['coding-project-go'],
};

// ===================== TaskDetailDialog =====================

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ open, onClose, task }) => {
  if (!open || !task) return null;

  const IconComp = iconMap[task.icon];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {IconComp && (
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <IconComp className="w-6 h-6 text-blue-600" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{task.name}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                )}
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
                  const cleaned = item.replace(/^(Week|Day|第)\s*\d+(?:[-–—]\d+)?\s*[：:\-–—]?\s*/, '').trim();
                  const isHeading = isWeekHeading || /^(周一|周二|周三|周四|周五|周六|周日|📋|📦|🛒|🔒|🎯|🤖|💾|⚡|🎨|⚙️|🚀|📊|🎛️|☑️|📝|📈|🎯|☁️)/.test(cleaned);
                  const isSubItem = cleaned.startsWith('•') || cleaned.startsWith('-');
                  return (
                    <div key={i} className={cn(
                      'text-sm leading-relaxed',
                      isHeading && 'font-bold text-gray-800 mt-2',
                      isSubItem && 'text-gray-600 pl-4',
                      !isHeading && !isSubItem && 'text-gray-700'
                    )}>
                      {cleaned}
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
                      className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium truncate">{r.name}</span>
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

          {task.projects && task.projects.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-500" />
                实战项目
              </h4>
              <div className="space-y-4">
                {task.projects.map((proj, pi) => (
                  <div key={pi} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="font-semibold text-gray-800 mb-2">{proj.name}</h5>
                    <div className="space-y-1">
                      {proj.learningRoute.map((item, ri) => {
                        if (!item.trim()) return <div key={ri} className="h-1" />;
                        return (
                          <div key={ri} className={cn(
                            'text-xs leading-relaxed',
                            item.trim().startsWith('\u2022') || item.trim().startsWith('-') ? 'text-gray-500 pl-3' : 'text-gray-700 font-medium'
                          )}>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                    {proj.resources && proj.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {proj.resources.map((r, ri) => r.url ? (
                          <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline">{r.name}</a>
                        ) : null)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===================== TaskCheckInDialog =====================

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {showSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-600 mb-2">记录已保存！</p>
            <p className="text-gray-500 text-sm">{ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]}</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{planTaskName || task?.name}</h3>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setMode('duration')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'duration' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500')}>
                按时长
              </button>
              <button onClick={() => setMode('quantity')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'quantity' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500')}>
                按数量
              </button>
            </div>

            {mode === 'duration' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">时长（分钟）</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="5" max="180" step="5" value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <span className="text-2xl font-bold text-blue-600 w-16 text-right">{duration}</span>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <button type="button" onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <span className="mr-2">{'📷'}</span>
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <span className="text-3xl mb-2">{'📷'}</span>
                      <span className="text-sm text-gray-500">点击上传照片</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
              确认打卡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== TomatoTimer =====================

interface TomatoTimerProps {
  taskName: string;
  onCheckIn: (duration: number) => void;
  onClose: () => void;
}

const TIME_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '25m', value: 25 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '60m', value: 60 },
];

const TomatoTimer: React.FC<TomatoTimerProps> = ({ taskName, onCheckIn, onClose }) => {
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleUseDuration = (mins: number) => {
    if (isRunning) pauseTimer();
    setDuration(mins);
    setRemaining(mins * 60);
    setCompleted(false);
  };

  const handleFinish = () => {
    const elapsed = duration * 60 - remaining;
    const actualMinutes = Math.max(1, Math.round(elapsed / 60));
    onCheckIn(actualMinutes);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - remaining / (duration * 60);
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 p-6 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="text-3xl mb-1">{'🍅'}</div>
          <h3 className="text-lg font-bold">{'番茄专注'}</h3>
        </div>

        <div className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-4 truncate">{taskName}</p>

          <div className="relative w-36 h-36 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="url(#g)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{formatTime(remaining)}</span>
              <span className="text-xs text-gray-500">{completed ? '已完成' : isRunning ? '专注中' : '准备就绪'}</span>
            </div>
          </div>

          {!isRunning && !completed && (
            <div className="flex gap-1.5 justify-center mb-4 flex-wrap">
              {TIME_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleUseDuration(opt.value)}
                  className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                    duration === opt.value ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {completed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="w-5 h-5" /><span className="font-medium">{'专注完成！'}</span>
              </div>
              <button onClick={handleFinish}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                {'记录并打卡'}
              </button>
            </div>
          ) : isRunning ? (
            <div className="flex gap-3">
              <button onClick={pauseTimer}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" />{'暂停'}
              </button>
              <button onClick={handleFinish}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                {'完成'}
              </button>
            </div>
          ) : (
            <button onClick={startTimer}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />{'开始专注'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ===================== ProjectPopup =====================

interface ProjectPopupProps {
  open: boolean;
  onClose: () => void;
  subModuleId: string;
  checkedInTaskIds: string[];
  onCheckIn: (task: Task) => void;
}

const ProjectPopup: React.FC<ProjectPopupProps> = ({ open, onClose, subModuleId, checkedInTaskIds, onCheckIn }) => {
  if (!open) return null;

  const projectTaskIds = SUB_MODULE_PROJECT_MAP[subModuleId] || [];
  const projectTasks = DEFAULT_TASKS.filter(t => projectTaskIds.includes(t.id));

  if (projectTasks.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 text-center">
          <p className="text-gray-400 text-lg mb-4">该模块暂无实战项目</p>
          <button onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-500" />
            实战项目
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {projectTasks.map(task => {
            const TaskIcon = iconMap[task.icon] || null;
            const isCheckedIn = checkedInTaskIds.includes(task.id);

            return (
              <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {TaskIcon && (
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <TaskIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{task.name}</h4>
                      {task.description && (
                        <p className="text-xs text-gray-500">{task.description}</p>
                      )}
                    </div>
                    <div className="ml-auto">
                      {isCheckedIn ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> {'已打卡'}
                        </span>
                      ) : (
                        <button onClick={() => onCheckIn(task)}
                          className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-opacity">
                          {'✅ 打卡'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {task.resources && task.resources.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">⚙️ 技术栈</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {task.resources.map((r, i) => {
                          const tech = r.name.replace(/ (文档|教程|官方文档|部署|示例|实战|指南|API).*$/, '');
                          return (
                            <span key={i} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                              {tech || r.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {task.learningRoute && task.learningRoute.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-blue-500" />
                        学习路线
                      </h5>
                      <div className="space-y-1">
                        {task.learningRoute.map((item, i) => {
                          if (!item.trim()) return <div key={i} className="h-1" />;
                          const isWeekHeading = /^(Week|Day|第)/.test(item.trim());
                          const cleaned = item.replace(/^(Week|Day|第)\s*\d+(?:[-–—]\d+)?\s*[：:\-–—]?\s*/, '').trim();
                          const isHeading = isWeekHeading || /^(周一|周二|周三|周四|周五|周六|周日|📋|📦|🛒|🔒|🎯|🤖|💾|⚡|🎨|⚙️|🚀|📊|🎛️|☑️)/.test(cleaned);
                          const isSubItem = cleaned.startsWith('•') || cleaned.startsWith('-');
                          return (
                            <div key={i} className={cn(
                              'text-xs leading-relaxed',
                              isHeading && 'font-bold text-gray-800 mt-1.5',
                              isSubItem && 'text-gray-500 pl-3',
                              !isHeading && !isSubItem && 'text-gray-600'
                            )}>
                              {cleaned}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {task.resources && task.resources.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        推荐资源
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {task.resources.map((r, i) => r.url ? (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline bg-blue-50 px-2.5 py-1 rounded-lg">
                            {r.name}
                          </a>
                        ) : (
                          <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===================== Main Categories Component =====================

export const Categories: React.FC = () => {
  const { todayCheckIns, tasks, streak, addCheckIn, initialize } = useCheckInStore();
  const [activeTab, setActiveTab] = useState('coding');
  const [activeSubTab, setActiveSubTab] = useState('coding-cs');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [tomatoOpen, setTomatoOpen] = useState(false);
  const [tomatoTask, setTomatoTask] = useState<{ id: string; categoryId: string; name: string } | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);

  const today = new Date();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const checkedInTaskIds = useMemo(
    () => todayCheckIns.map(ci => ci.taskId),
    [todayCheckIns]
  );

  const currentTask = useMemo(
    () => DEFAULT_TASKS.find(t => t.id === activeSubTab && t.enabled) || null,
    [activeSubTab]
  );

  const handleCheckIn = (task: Task) => {
    setSelectedTask(task);
    setCheckInOpen(true);
  };

  const handleDetail = (task: Task) => {
    setDetailTask(task);
    setDetailOpen(true);
  };

  const handleTomato = (task: Task) => {
    setTomatoTask({ id: task.id, categoryId: task.categoryId, name: task.name });
    setTomatoOpen(true);
  };

  const confirmCheckIn = async (duration?: number, quantity?: number, note?: string, photo?: string) => {
    if (selectedTask) {
      await addCheckIn(selectedTask.id, selectedTask.categoryId, duration, quantity, note, photo);
    }
  };

  const confirmTomatoCheckIn = async (duration: number) => {
    if (tomatoTask) {
      await addCheckIn(tomatoTask.id, tomatoTask.categoryId as any, duration);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            21Days<span className="text-sm text-gray-400 font-normal ml-1">{'全部任务'}</span>
            <div className="flex items-center gap-1.5 text-base ml-auto text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak}</span>
              <span className="text-gray-400 font-normal">{'天'}</span>
            </div>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {format(today, 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </p>
        </div>

        {/* Module Tab Bar */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveSubTab(MODULE_TABS[tab.id]?.[0]?.id || ''); }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-white shadow-md text-gray-900 border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 border border-transparent'
                  )}>
                  <TabIcon className={cn('w-4 h-4', isActive && getCategoryStyles(tab.id as any).text)} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-800">{'今日进度'}</span>
            </div>
            <span className="font-bold text-gray-800">{checkedInTaskIds.length}/{tasks.filter(t => t.enabled).length} {'项'}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700"
              style={{ width: `${tasks.filter(t => t.enabled).length > 0 ? (checkedInTaskIds.length / tasks.filter(t => t.enabled).length) * 100 : 0}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{'已完成'} {Math.round(tasks.filter(t => t.enabled).length > 0 ? (checkedInTaskIds.length / tasks.filter(t => t.enabled).length) * 100 : 0)}%</span>
            <span>{tasks.filter(t => t.enabled).length > 0 && checkedInTaskIds.length >= tasks.filter(t => t.enabled).length ? '🎉 全部完成！' : '加油！'}</span>
          </div>
        </div>

        {/* Sub-module Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-6">
            {(MODULE_TABS[activeTab] || []).map(tab => {
              const isActive = activeSubTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-white shadow-md text-gray-900 border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 border border-transparent'
                  )}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Task Card */}
          {currentTask && (
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                {currentTask.icon && iconMap[currentTask.icon] && (() => {
                  const SubIcon = iconMap[currentTask.icon]!;
                  return (
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <SubIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{currentTask.name}</h3>
                  {currentTask.description && (
                    <p className="text-sm text-gray-500">{currentTask.description}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={() => handleDetail(currentTask)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  📖 详情
                </button>
                <button onClick={() => handleCheckIn(currentTask)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-opacity">
                  ✅ 打卡
                </button>
                {activeTab === 'coding' && (
                  <>
                    <button onClick={() => handleTomato(currentTask)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors">
                      🍅
                    </button>
                    {SUB_MODULE_PROJECT_MAP[activeSubTab]?.length > 0 && (
                      <button onClick={() => setProjectOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors">
                        🛠 项目实战
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskCheckInDialog open={checkInOpen} onClose={() => setCheckInOpen(false)}
        task={selectedTask} onConfirm={confirmCheckIn} />

      <TaskDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)}
        task={detailTask} />

      {tomatoOpen && tomatoTask && (
        <TomatoTimer
          taskName={tomatoTask.name}
          onCheckIn={confirmTomatoCheckIn}
          onClose={() => setTomatoOpen(false)}
        />
      )}

      {activeTab === 'coding' && (
        <ProjectPopup
          open={projectOpen}
          onClose={() => setProjectOpen(false)}
          subModuleId={activeSubTab}
          checkedInTaskIds={checkedInTaskIds}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
};
