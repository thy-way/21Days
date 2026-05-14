import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginDates = useAuthStore((state) => state.loginDates);
  const usernameRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('请输入用户名'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username && password) {
      login(username);
      navigate('/');
    } else {
      setError('用户名或密码错误');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Warm glow from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-100/60 via-amber-50/30 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Top clean space */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center mb-4">
              {/* Ring decoration */}
              <svg className="absolute w-28 h-28" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="8 4" opacity="0.2" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="2.5"
                  strokeDasharray="326.7" strokeDashoffset="310" strokeLinecap="round" className="origin-center -rotate-90" />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-6xl font-black tracking-tight bg-gradient-to-br from-orange-500 via-orange-500 to-rose-500 bg-clip-text text-transparent -skew-x-2">
                21
              </span>
              <span className="absolute -bottom-3 -right-2 text-sm font-bold text-orange-500 tracking-widest">Days</span>
            </div>
            <p className="text-gray-400 text-sm mt-1 tracking-wide">21 天习惯养成计划</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
                <div className="relative">
                  <svg className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
                    focusedField === 'username' ? 'text-orange-500' : 'text-gray-400'
                  )} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="username"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 text-gray-900 text-sm outline-none transition-all',
                      'placeholder-gray-400',
                      focusedField === 'username' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'
                    )}
                    placeholder="请输入用户名"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
                <div className="relative">
                  <svg className={cn(
                    'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
                    focusedField === 'password' ? 'text-orange-500' : 'text-gray-400'
                  )} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 text-gray-900 text-sm outline-none transition-all',
                      'placeholder-gray-400',
                      focusedField === 'password' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'
                    )}
                    placeholder="请输入密码"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-600 text-sm text-center py-2 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-200',
                  'bg-orange-500 text-white',
                  'hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25',
                  'active:bg-orange-700 active:translate-y-0',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:hover:translate-y-0 disabled:hover:shadow-none'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    登录中...
                  </span>
                ) : '开始 21 天'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 tracking-wider">DEMO</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Demo hint */}
            <p className="text-center text-xs text-gray-400">
              任意用户名密码即可登录
            </p>
          </div>

          {/* Day indicator */}
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 text-sm text-gray-300 font-medium tracking-widest">
              <span className="w-4 h-px bg-gray-200" />
              DAY {Math.min(loginDates.length + 1, 21)} / 21
              <span className="w-4 h-px bg-gray-200" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line — the starting line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500" />
    </div>
  );
};

export default Login;