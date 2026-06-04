import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  const theme = useSettingsStore((state) => state.settings.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl) {
      console.log('SW registered:', swUrl);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

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

      {needRefresh && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-500/40 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
            有新版本可用
          </span>
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            刷新
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            aria-label="关闭"
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};