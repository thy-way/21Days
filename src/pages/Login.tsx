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
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full bg-green-50/25 border border-green-300/30 flex items-center justify-center">
                <span className="text-6xl font-extrabold italic skew-x-3 tracking-tight text-amber-300 inline-flex items-center justify-center w-full h-full leading-none">
                  21
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0 text-[11px] font-bold text-white bg-orange-500 px-2.5 py-0.5 rounded-full">
                Days
              </span>
            </div>
            <div className="text-sm text-orange-100/80 tracking-wide">习惯养成计划</div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-6 h-px bg-orange-200/50" />
              <span className="text-xs font-medium text-orange-300 tracking-[0.2em]">坚持向上的生命力</span>
              <span className="w-6 h-px bg-orange-200/50" />
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">用户名</label>
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
                    'w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-all',
                    'placeholder-gray-400',
                    focusedField === 'username'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800'
                  )}
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">密码</label>
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
                    'w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-all',
                    'placeholder-gray-400',
                    focusedField === 'password'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800'
                  )}
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 rounded-lg font-semibold text-sm transition-colors duration-150',
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


          {/* Day indicator */}
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 text-sm text-orange-300 font-medium tracking-widest">
              <span className="w-8 h-px brand-gradient rounded-full" />
              <span className="bg-orange-50 dark:bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse-soft">
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
