import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore, ToastType } from '@/store/toastStore';
import { cn } from '@/utils';

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const STYLE_MAP: Record<ToastType, string> = {
  success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30',
  error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30',
  info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30',
};

export const Toast: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up',
            STYLE_MAP[toast.type]
          )}
        >
          {ICON_MAP[toast.type]}
          <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
