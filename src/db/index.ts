import Dexie, { Table } from 'dexie';
import { CheckIn, Category, Task, QuadrantTask, TomatoSession, TomatoSettings, DailySummary, UserPlan } from '../types';

class CheckInDatabase extends Dexie {
  checkIns!: Table<CheckIn, number>;
  categories!: Table<Category, string>;
  tasks!: Table<Task, string>;
  quadrants!: Table<QuadrantTask, number>;
  tomatoSessions!: Table<TomatoSession, number>;
  tomatoSettings!: Table<TomatoSettings, number>;
  dailySummaries!: Table<DailySummary, number>;
  userPlans!: Table<UserPlan, number>;

  constructor() {
    super('DailyCheckDB');

    this.version(10).stores({
      checkIns: '++id, taskId, categoryId, date, timestamp',
      categories: 'id, name, enabled',
      tasks: 'id, categoryId, name, enabled, order, quadrant',
      quadrants: '++id, urgency, importance, status, dueDate, createdAt',
      tomatoSessions: '++id, taskId, type, completed, startDate',
      tomatoSettings: '++id',
      dailySummaries: '++id, date',
      userPlans: '++id, categoryId, type, isActive, createdAt',
    });
  }
}

export const db = new CheckInDatabase();

export async function initializeDatabase() {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    const { DEFAULT_CATEGORIES } = await import('../types/categories');
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }

  const taskCount = await db.tasks.count();
  if (taskCount === 0) {
    const { DEFAULT_TASKS } = await import('../types/categories');
    await db.tasks.bulkAdd(DEFAULT_TASKS);
  }
}