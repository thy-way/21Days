export type CategoryId = 'fitness' | 'coding' | 'english' | 'exam' | 'side';

export interface Task {
  id: string;
  categoryId: CategoryId;
  name: string;
  icon: string;
  unit?: string;
  defaultDuration?: number;
  enabled: boolean;
  order: number;
  group?: string;
  groupOrder?: number;
  description?: string;
  learningRoute?: string[];
  resources?: { name: string; url?: string }[];
  projects?: {
    name: string;
    learningRoute: string[];
    resources?: { name: string; url?: string }[];
  }[];
  quadrant?: QuadrantType;
}

export interface CheckIn {
  id?: number;
  taskId: string;
  categoryId: CategoryId;
  date: string;
  timestamp: number;
  note?: string;
  duration?: number;
  quantity?: number;
  photo?: string;
  comment?: string;
  createdAt: number;
}



export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  enabled: boolean;
  dailyGoal?: number;
}

export interface UserSettings {
  reminderEnabled: boolean;
  reminderTime: string;
  theme: 'light' | 'dark' | 'system';
}

export interface DailyStats {
  date: string;
  totalCheckIns: number;
  byCategory: Record<CategoryId, number>;
  byTask: Record<string, number>;
  isCompleted: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  days: DailyStats[];
  totalCheckIns: number;
  averagePerDay: number;
  bestDay: string;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  settings: UserSettings;
  categories: Category[];
  tasks: Task[];
  checkIns: CheckIn[];
}

// ============ 四象限法则 ============

export interface QuadrantTask {
  id?: number;
  title: string;
  description?: string;
  urgency: 'high' | 'low';
  importance: 'high' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  relatedTaskId?: string;
  createdAt: number;
  updatedAt: number;
}

export type QuadrantType = 
  | 'urgent-important'
  | 'urgent-not-important'
  | 'not-urgent-important'
  | 'not-urgent-not-important';

// ============ 番茄工作法 ============

export interface TomatoSession {
  id?: number;
  taskId?: string;
  type: 'focus' | 'short-break' | 'long-break';
  duration: number;
  actualDuration?: number;
  completed: boolean;
  note?: string;
  startDate: number;
  endDate?: number;
  createdAt: number;
}

export interface TomatoSettings {
  id?: number;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

// ============ 每日复盘 ============

export interface DailySummary {
  id?: number;
  date: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// ============ 用户计划 ============

export interface UserPlanTask {
  id: string;
  name: string;
  learningRoute: string[];
  resources?: { name: string; url?: string }[];
  quadrant?: QuadrantType;
}

export interface UserPlan {
  id?: number;
  title: string;
  categoryId: string;
  type: 'ai-generated' | 'custom';
  description: string;
  isActive: boolean;
  tasks: UserPlanTask[];
  createdAt: number;
  updatedAt: number;
}

export interface AIQuestion {
  key: string;
  question: string;
  type: 'single' | 'multi';
  options: { label: string; value: string }[];
}

export interface AITemplate {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  questions: AIQuestion[];
  generatePlan: (answers: Record<string, string>) => { title: string; tasks: UserPlanTask[] };
}