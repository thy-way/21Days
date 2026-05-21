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
    <div className="min-h-screen brand-gradient-vertical flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="relative">
                <span className="text-6xl font-extrabold tracking-tight brand-text-gradient -skew-x-2">
                  21
                </span>
                <span className="absolute -bottom-3 -right-2 text-sm font-bold text-amber-500 tracking-widest">Days</span>
              </div>
            </div>
            <p className="text-amber-600/70 text-sm mt-1 font-medium">21 天习惯养成计划</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-6 h-px bg-orange-200" />
              <span className="text-xs font-medium text-orange-400 tracking-[0.2em]">坚持向上的生命力</span>
              <span className="w-6 h-px bg-orange-200" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">用户名</label>
              <div className="relative">
                <svg className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
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
                    'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none transition-all',
                    'placeholder-gray-400',
                    focusedField === 'username'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  )}
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">密码</label>
              <div className="relative">
                <svg className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
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
                    'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none transition-all',
                    'placeholder-gray-400',
                    focusedField === 'password'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
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
                'w-full py-2.5 rounded-lg font-semibold text-sm transition-colors duration-150',
                'bg-orange-500 text-white hover:bg-orange-600',
                'disabled:opacity-50 disabled:cursor-not-allowed'
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

          {/* Day indicator */}
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 text-sm text-orange-300 font-medium tracking-widest">
              <span className="w-8 h-px brand-gradient rounded-full" />
              <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse-soft">
                DAY {Math.min(loginDates.length + 1, 21)} / 21
              </span>
              <span className="w-8 h-px brand-gradient rounded-full" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 w-full brand-gradient" />
    </div>
  );
};

export default Login;