import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Check, Clock } from 'lucide-react';
import { cn } from '@/utils';

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

export const TomatoTimer: React.FC<TomatoTimerProps> = ({ taskName, onCheckIn, onClose }) => {
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="bg-orange-500 p-6 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <Clock className="w-8 h-8 mx-auto mb-1" />
          <h3 className="text-lg font-bold">番茄专注</h3>
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
                <Check className="w-5 h-5" /><span className="font-medium">专注完成！</span>
              </div>
              <button onClick={handleFinish}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                记录并打卡
              </button>
            </div>
          ) : isRunning ? (
            <div className="flex gap-3">
              <button onClick={pauseTimer}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" />暂停
              </button>
              <button onClick={handleFinish}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                完成
              </button>
            </div>
          ) : (
            <button onClick={startTimer}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />开始专注
            </button>
          )}
        </div>
      </div>
    </div>
  );
};