import Dexie, { Table } from 'dexie';
import { CheckIn, Category, Task, QuadrantTask, TomatoSession, TomatoSettings, DailySummary } from '../types';

class CheckInDatabase extends Dexie {
  checkIns!: Table<CheckIn, number>;
  categories!: Table<Category, string>;
  tasks!: Table<Task, string>;
  quadrants!: Table<QuadrantTask, number>;
  tomatoSessions!: Table<TomatoSession, number>;
  tomatoSettings!: Table<TomatoSettings, number>;
  dailySummaries!: Table<DailySummary, number>;

  constructor() {
    super('DailyCheckDB');

    this.version(9).stores({
      checkIns: '++id, taskId, categoryId, date, timestamp',
      categories: 'id, name, enabled',
      tasks: 'id, categoryId, name, enabled, order, quadrant',
      quadrants: '++id, urgency, importance, status, dueDate, createdAt',
      tomatoSessions: '++id, taskId, type, completed, startDate',
      tomatoSettings: '++id',
      dailySummaries: '++id, date',
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