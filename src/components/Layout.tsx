import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  const theme = useSettingsStore((state) => state.settings.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-gray-950 dark:via-slate-900/50 dark:to-gray-950 flex flex-col">
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};