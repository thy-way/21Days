import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Check, X, Settings, Flame, Clock, Calendar } from 'lucide-react';
import { useTomatoStore } from '@/store';
import { useCheckInStore } from '@/store';
import { cn } from '@/utils';

export const Tomato: React.FC = () => {
  const {
    sessions,
    settings,
    currentSession,
    isRunning,
    remainingTime,
    completedCount,
    loadSessions,
    loadSettings,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    updateRemainingTime,
    saveSettings,
  } = useTomatoStore();

  const { tasks } = useCheckInStore();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [note, setNote] = useState('');
  const [localCurrentType, setLocalCurrentType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const intervalRef = useRef<number>();

  // Initial load
  useEffect(() => {
    loadSessions();
    loadSettings();
  }, [loadSessions, loadSettings]);

  // Timer logic
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = window.setInterval(() => {
        updateRemainingTime(remainingTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      handleComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingTime, updateRemainingTime]);

  const handleStart = () => {
    startSession(selectedTaskId || undefined, localCurrentType);
  };

  const handlePause = () => {
    pauseSession();
  };

  const handleResume = () => {
    resumeSession();
  };

  const handleComplete = () => {
    completeSession(note);
    setNote('');
    setSelectedTaskId('');
  };

  const handleCancel = () => {
    if (confirm('确定要取消当前番茄钟吗？')) {
      cancelSession();
      setNote('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    const totalTime = currentSession.duration * 60;
    return ((totalTime - remainingTime) / totalTime) * 100;
  };

  const getTypeLabel = () => {
    switch (localCurrentType) {
      case 'focus':
        return '专注时间';
      case 'short-break':
        return '短休息';
      case 'long-break':
        return '长休息';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2.5 bg-orange-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="brand-text-gradient">21Days</span>
                <span className="text-gray-400 text-base font-normal ml-2">番茄工作法</span>
              </div>
            </h1>
            <p className="text-amber-600/60 mt-1 text-sm">专注时间，提高效率</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-amber-700">今日完成</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-1">{completedCount}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-amber-700">总时长</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {sessions.filter(s => s.completed).reduce((sum, s) => sum + (s.actualDuration || s.duration), 0)}
              <span className="text-sm font-normal text-gray-600 ml-1">分钟</span>
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="card-warm p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Timer Type Selection */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => {
                  if (!currentSession) {
                    setLocalCurrentType('focus');
                  }
                }}
                disabled={!!currentSession}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  !currentSession && localCurrentType === 'focus'
                    ? 'brand-gradient text-white shadow-warm'
                    : !currentSession
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                专注
              </button>
              <button
                onClick={() => {
                  if (!currentSession) {
                    setLocalCurrentType('short-break');
                  }
                }}
                disabled={!!currentSession}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  !currentSession && localCurrentType === 'short-break'
                    ? 'bg-amber-500 text-white shadow-warm'
                    : !currentSession
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                短休息
              </button>
              <button
                onClick={() => {
                  if (!currentSession) {
                    setLocalCurrentType('long-break');
                  }
                }}
                disabled={!!currentSession}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  !currentSession && localCurrentType === 'long-break'
                    ? 'bg-orange-500 text-white shadow-warm'
                    : !currentSession
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                长休息
              </button>
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    {localCurrentType === 'focus' && (
                      <>
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </>
                    )}
                    {localCurrentType === 'short-break' && (
                      <>
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </>
                    )}
                    {localCurrentType === 'long-break' && (
                      <>
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </>
                    )}
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-6xl font-bold text-gray-900">
                  {formatTime(remainingTime)}
                </div>
                <div className="text-sm text-gray-500 mt-2">{getTypeLabel()}</div>
              </div>
            </div>

            {/* Controls */}
            {!currentSession ? (
              <button
                onClick={handleStart}
                className="flex items-center space-x-2 px-8 py-4 brand-gradient text-white rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-warm-lg"
              >
                <Play className="w-6 h-6" />
                <span>开始</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                {!isRunning ? (
                    <button
                      onClick={handleResume}
                      className="flex items-center space-x-2 px-6 py-3 brand-gradient text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-warm-md"
                    >
                      <Play className="w-5 h-5" />
                      <span>继续</span>
                    </button>
                ) : (
                    <button
                      onClick={handlePause}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-warm-md"
                    >
                      <Pause className="w-5 h-5" />
                      <span>暂停</span>
                    </button>
                )}
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>取消</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-warm-md"
                >
                  <Check className="w-5 h-5" />
                  <span>完成</span>
                </button>
              </div>
            )}
          </div>

          {/* Task Selection */}
          {!currentSession && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择任务（可选）</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">不关联任务</option>
                {tasks.filter(t => t.enabled).map((task) => (
                  <option key={task.id} value={task.id}>{task.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Note */}
          {currentSession && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">备注（可选）</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="添加备注..."
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="card-warm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              设置
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">专注时长（分钟）</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.focusDuration}
                  onChange={(e) => saveSettings({ focusDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">短休息时长（分钟）</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => saveSettings({ shortBreakDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">长休息时长（分钟）</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => saveSettings({ longBreakDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">长休息间隔（番茄钟数）</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.longBreakInterval}
                  onChange={(e) => saveSettings({ longBreakInterval: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center space-x-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="autoStartBreaks"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => saveSettings({ autoStartBreaks: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
                <label htmlFor="autoStartBreaks" className="text-sm text-gray-700">自动开始休息</label>
              </div>
              <div className="flex items-center space-x-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={(e) => saveSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                />
                <label htmlFor="soundEnabled" className="text-sm text-gray-700">提示音效</label>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div className="card-warm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            今日记录
          </h3>
          {sessions.filter(s => new Date(s.startDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length === 0 ? (
            <div className="text-center py-8 text-gray-400">暂无记录</div>
          ) : (
            <div className="space-y-3">
              {sessions
                .filter(s => new Date(s.startDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
                .sort((a, b) => b.startDate - a.startDate)
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        session.type === 'focus' ? 'bg-blue-500' : 
                        session.type === 'short-break' ? 'bg-green-500' : 'bg-purple-500'
                      )} />
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {session.type === 'focus' ? '专注' : session.type === 'short-break' ? '短休息' : '长休息'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.startDate).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          {session.actualDuration && ` · ${session.actualDuration}分钟`}
                        </div>
                        {session.note && (
                          <div className="text-xs text-gray-600 mt-1">{session.note}</div>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      'text-sm font-medium',
                      session.completed ? 'text-green-600' : 'text-gray-400'
                    )}>
                      {session.completed ? '已完成' : '未完成'}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};