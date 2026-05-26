import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, UserSettings, CategoryId, ExportData, CheckIn } from '../types';
import { DEFAULT_CATEGORIES } from '../types/categories';
import { db } from '../db';

interface SettingsState {
  categories: Category[];
  settings: UserSettings;

  initialize: () => Promise<void>;
  updateCategoryGoal: (id: CategoryId, goal: number) => Promise<void>;
  toggleCategory: (id: CategoryId) => Promise<void>;
  setReminder: (enabled: boolean, time: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      settings: {
        reminderEnabled: false,
        reminderTime: '09:00',
        theme: 'light',
      },

      initialize: async () => {
        let categories = await db.categories.toArray();
        if (categories.length === 0) {
          await db.categories.bulkAdd(DEFAULT_CATEGORIES);
          categories = DEFAULT_CATEGORIES;
        }
        set({ categories });
        const { settings } = get();
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },

      updateCategoryGoal: async (id: CategoryId, goal: number) => {
        await db.categories.update(id, { dailyGoal: goal } as any);
        const categories = await db.categories.toArray();
        set({ categories });
      },

      toggleCategory: async (id: CategoryId) => {
        const cat = get().categories.find((c) => c.id === id);
        if (cat) {
          await db.categories.update(id, { enabled: !cat.enabled });
          const categories = await db.categories.toArray();
          set({ categories });
        }
      },

      setReminder: (enabled, time) => {
        set((state) => ({
          settings: { ...state.settings, reminderEnabled: enabled, reminderTime: time },
        }));
      },

  setTheme: (theme) => {
    set((state) => ({
      settings: { ...state.settings, theme },
    }));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

      exportData: async () => {
        const { settings } = get();
        const categories = await db.categories.toArray();
        const tasks = await db.tasks.toArray();
        const checkIns = await db.checkIns.toArray();

        const exportData: ExportData = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          settings,
          categories,
          tasks,
          checkIns,
        };

        return JSON.stringify(exportData, null, 2);
      },

      importData: async (json: string) => {
        try {
          const data: ExportData = JSON.parse(json);

          if (data.categories && Array.isArray(data.categories)) {
            await db.categories.clear();
            await db.categories.bulkAdd(data.categories as Category[]);
          }

          if (data.checkIns && Array.isArray(data.checkIns)) {
            await db.checkIns.clear();
            const checkIns = data.checkIns.map((ci: CheckIn) => ({
              ...ci,
              id: undefined,
            }));
            await db.checkIns.bulkAdd(checkIns);
          }

          if (data.settings) {
            set({ settings: data.settings });
          }

          const categories = await db.categories.toArray();
          set({ categories });
        } catch (error) {
          console.error('Import failed:', error);
          throw new Error('导入数据格式错误');
        }
      },

      resetToDefaults: async () => {
        await db.categories.clear();
        await db.categories.bulkAdd(DEFAULT_CATEGORIES);
        await db.checkIns.clear();

        set({
          categories: DEFAULT_CATEGORIES,
          settings: {
            reminderEnabled: false,
            reminderTime: '09:00',
            theme: 'light',
          },
        });
      },
    }),
    {
      name: 'dailycheck-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);