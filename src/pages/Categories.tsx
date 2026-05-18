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
  Monitor,
} from 'lucide-react';
import { useCheckInStore, usePlanStore } from '@/store';
import { Task, UserPlanTask, UserPlan } from '@/types';
import { cn } from '@/utils';
import { getCategoryStyles, CATEGORY_STYLES } from '@/utils/categoryStyles';

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

// ===================== ProjectPopup =====================

interface ProjectPopupProps {
  open: boolean;
  onClose: () => void;
  subModuleId: string;
  checkedInTaskIds: string[];
  onCheckIn: (task: Task) => void;
}

const ProjectPopup: React.FC<ProjectPopupProps> = ({ open, onClose, subModuleId, checkedInTaskIds, onCheckIn }) => {
  const { tasks } = useCheckInStore();
  if (!open) return null;

  const projectTaskIds = SUB_MODULE_PROJECT_MAP[subModuleId] || [];
  const projectTasks = tasks.filter(t => projectTaskIds.includes(t.id));

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
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
  const { todayCheckIns, tasks, streak, addCheckIn, initialize } = useCheckInStore();
  const { plans, loadPlans } = usePlanStore();
  const [activeTab, setActiveTab] = useState('coding');
  const [activeSubTab, setActiveSubTab] = useState('coding-cs');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [planDetailTask, setPlanDetailTask] = useState<{ plan: UserPlan; task: UserPlanTask } | null>(null);
  const [planDetailOpen, setPlanDetailOpen] = useState(false);
  const [selectedPlanTask, setSelectedPlanTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);

  const today = new Date();

  useEffect(() => {
    initialize();
    loadPlans();
  }, [initialize, loadPlans]);

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

  const currentTask = useMemo(
    () => tasks.find(t => t.id === activeSubTab && t.enabled) || null,
    [activeSubTab, tasks]
  );

  const activePlansForTab = useMemo(
    () => plans.filter(p => p.isActive && p.categoryId === activeTab),
    [plans, activeTab]
  );

  const handleCheckIn = (task: Task) => {
    setSelectedTask(task);
    setSelectedPlanTask(null);
    setCheckInOpen(true);
  };

  const handlePlanCheckIn = (plan: UserPlan, task: UserPlanTask) => {
    setSelectedPlanTask({ planId: plan.id!, categoryId: plan.categoryId, name: task.name });
    setSelectedTask(null);
    setCheckInOpen(true);
  };

  const handleDetail = (task: Task) => {
    setDetailTask(task);
    setDetailOpen(true);
  };

  const handlePlanDetail = (plan: UserPlan, task: UserPlanTask) => {
    setPlanDetailTask({ plan, task });
    setPlanDetailOpen(true);
  };

  const confirmCheckIn = async (duration?: number, quantity?: number, note?: string, photo?: string) => {
    if (selectedTask) {
      await addCheckIn(selectedTask.id, selectedTask.categoryId, duration, quantity, note, photo);
    } else if (selectedPlanTask) {
      await addCheckIn(`plan-${selectedPlanTask.planId}-${selectedPlanTask.name}`, selectedPlanTask.categoryId as any, duration, quantity, note, photo);
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
            <span className="font-bold text-gray-800">{completedPlanTasks}/{totalPlanTasks} {'项'}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700"
              style={{ width: `${totalPlanTasks > 0 ? (completedPlanTasks / totalPlanTasks) * 100 : 0}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{'已完成'} {Math.round(totalPlanTasks > 0 ? (completedPlanTasks / totalPlanTasks) * 100 : 0)}%</span>
            <span>{totalPlanTasks > 0 && completedPlanTasks >= totalPlanTasks ? '🎉 全部完成！' : '加油！'}</span>
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

          {/* Built-in Task Card */}
          {currentTask && (
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 mb-4">
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

          {/* Plan Tasks Inline */}
          {activePlansForTab.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-500 flex items-center gap-2 px-1">
                <BookOpen className="w-4 h-4" />
                来自我的计划
              </h4>
              {activePlansForTab.map(plan => {
                const style = CATEGORY_STYLES[plan.categoryId] || CATEGORY_STYLES.coding;
                return (
                  <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={cn('px-5 py-3 flex items-center gap-2', style.bgLight)}>
                      <BookOpen className={cn('w-4 h-4', style.text)} />
                      <span className={cn('font-semibold text-sm', style.text)}>{plan.title}</span>
                      <span className="ml-auto text-xs text-gray-400">{plan.tasks.length} 个任务</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {plan.tasks.map(task => {
                        const taskCheckInId = `plan-${plan.id}-${task.name}`;
                        const isCheckedIn = checkedInTaskIds.includes(taskCheckInId);
                        return (
                          <div key={task.id}
                            className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
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
                                <button onClick={() => handlePlanCheckIn(plan, task)}
                                  className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition-opacity">
                                  打卡
                                </button>
                              )}
                              <button onClick={() => handlePlanDetail(plan, task)}
                                className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                详情
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TaskCheckInDialog open={checkInOpen} onClose={() => setCheckInOpen(false)}
        task={selectedTask} planTaskName={selectedPlanTask?.name} onConfirm={confirmCheckIn} />

      <TaskDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)}
        task={detailTask} />

      <PlanTaskDetailDialog open={planDetailOpen} onClose={() => setPlanDetailOpen(false)}
        plan={planDetailTask?.plan || null} task={planDetailTask?.task || null} />

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
