import { create } from 'zustand';
import { db, initializeDatabase } from '../db';
import { CheckIn, DailyStats, WeeklyStats, Category, Task, QuadrantType, DailySummary } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_TASKS } from '../types/categories';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  parseISO,
  differenceInDays,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CheckInState {
  todayCheckIns: CheckIn[];
  categories: Category[];
  tasks: Task[];
  loading: boolean;
  streak: number;

  initialize: () => Promise<void>;
  loadTodayCheckIns: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadTasks: () => Promise<void>;
  loadDateCheckIns: (date: string) => Promise<CheckIn[]>;
  addCheckIn: (taskId: string, categoryId: string, duration?: number, quantity?: number, note?: string, photo?: string) => Promise<CheckIn>;
  removeCheckIn: (id: number) => Promise<void>;
  getDailyStats: (date: string) => Promise<DailyStats>;
  getWeeklyStats: (date?: Date) => Promise<WeeklyStats>;
  calculateStreak: () => Promise<number>;
  updateTaskQuadrant: (taskId: string, quadrant: QuadrantType | undefined) => Promise<void>;
  loadDailySummary: (date: string) => Promise<DailySummary[]>;
  saveDailySummary: (date: string, content: string) => Promise<void>;
  loadAllSummaries: () => Promise<DailySummary[]>;
  updateCheckInComment: (checkInId: number, comment: string) => Promise<void>;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  todayCheckIns: [],
  categories: DEFAULT_CATEGORIES,
  tasks: DEFAULT_TASKS,
  loading: false,
  streak: 0,

  initialize: async () => {
    set({ loading: true });
    await initializeDatabase();
    await get().loadCategories();
    await get().loadTasks();
    await get().loadTodayCheckIns();
    const streak = await get().calculateStreak();
    set({ streak, loading: false });
  },

  loadTodayCheckIns: async () => {
    const today = format(Date.now(), 'yyyy-MM-dd');
    const checkIns = await db.checkIns.where('date').equals(today).toArray();
    set({ todayCheckIns: checkIns });
  },

  loadCategories: async () => {
    let categories = await db.categories.toArray();
    if (categories.length === 0) {
      await db.categories.bulkAdd(DEFAULT_CATEGORIES);
      categories = DEFAULT_CATEGORIES;
    }
    set({ categories });
  },

  loadDateCheckIns: async (date: string) => {
    return await db.checkIns.where('date').equals(date).toArray();
  },

  addCheckIn: async (taskId: string, categoryId: string, duration?: number, quantity?: number, note?: string, photo?: string) => {
    const now = Date.now();
    const date = format(now, 'yyyy-MM-dd');

    const checkIn: CheckIn = {
      taskId,
      categoryId,
      date,
      timestamp: now,
      duration,
      quantity,
      note,
      photo,
      createdAt: now,
    };

    const id = await db.checkIns.add(checkIn);
    checkIn.id = id;

    await get().loadTodayCheckIns();
    const streak = await get().calculateStreak();
    set({ streak });

    return checkIn;
  },

  loadTasks: async () => {
    let tasks = await db.tasks.toArray();
    if (tasks.length === 0) {
      await db.tasks.bulkAdd(DEFAULT_TASKS);
      tasks = DEFAULT_TASKS;
    }
    set({ tasks });
  },

  removeCheckIn: async (id: number) => {
    await db.checkIns.delete(id);
    await get().loadTodayCheckIns();
    const streak = await get().calculateStreak();
    set({ streak });
  },

  getDailyStats: async (date: string) => {
    const checkIns = await db.checkIns.where('date').equals(date).toArray();
    const categories = get().categories;

    const byCategory: Record<string, number> = {};
    const byTask: Record<string, number> = {};

    categories.forEach((cat) => {
      byCategory[cat.id] = 0;
    });

    checkIns.forEach((ci) => {
      byCategory[ci.categoryId] = (byCategory[ci.categoryId] || 0) + 1;
      byTask[ci.taskId] = (byTask[ci.taskId] || 0) + 1;
    });

    const enabledCategories = categories.filter((c) => c.enabled);
    const isCompleted = enabledCategories.length > 0 && enabledCategories.every((cat) => byCategory[cat.id] > 0);

    return {
      date,
      totalCheckIns: checkIns.length,
      byCategory,
      byTask,
      isCompleted,
    };
  },

  getWeeklyStats: async (date: Date = new Date()) => {
    const start = startOfWeek(date, { locale: zhCN });
    const end = endOfWeek(date, { locale: zhCN });
    const days = eachDayOfInterval({ start, end });

    const dailyStatsList: DailyStats[] = [];
    let totalCheckIns = 0;
    let bestDay = format(days[0], 'yyyy-MM-dd');
    let bestDayCount = 0;

    for (const day of days) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const stats = await get().getDailyStats(dateStr);
      dailyStatsList.push(stats);
      totalCheckIns += stats.totalCheckIns;
      if (stats.totalCheckIns > bestDayCount) {
        bestDayCount = stats.totalCheckIns;
        bestDay = dateStr;
      }
    }

    return {
      weekStart: format(start, 'yyyy-MM-dd'),
      weekEnd: format(end, 'yyyy-MM-dd'),
      days: dailyStatsList,
      totalCheckIns,
      averagePerDay: totalCheckIns / 7,
      bestDay,
    };
  },

  calculateStreak: async () => {
    const allCheckIns = await db.checkIns.orderBy('date').toArray();
    if (allCheckIns.length === 0) return 0;

    const uniqueDates = [...new Set(allCheckIns.map((c) => c.date))]
      .sort()
      .reverse();

    const today = format(Date.now(), 'yyyy-MM-dd');
    const yesterday = format(subDays(Date.now(), 1), 'yyyy-MM-dd');

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = parseISO(uniqueDates[i - 1]);
      const prevDate = parseISO(uniqueDates[i]);
      const diff = differenceInDays(currentDate, prevDate);

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  updateTaskQuadrant: async (taskId: string, quadrant: QuadrantType | undefined) => {
    await db.tasks.update(taskId, { quadrant });
    await get().loadTasks();
  },

  loadDailySummary: async (date: string) => {
    return await db.dailySummaries.where('date').equals(date).reverse().toArray();
  },

  saveDailySummary: async (date: string, content: string) => {
    const now = Date.now();
    await db.dailySummaries.add({ date, content, createdAt: now, updatedAt: now });
  },

  loadAllSummaries: async () => {
    return await db.dailySummaries.orderBy('date').reverse().toArray();
  },

  updateCheckInComment: async (checkInId: number, comment: string) => {
    await db.checkIns.update(checkInId, { comment });
    await get().loadTodayCheckIns();
  },
}));