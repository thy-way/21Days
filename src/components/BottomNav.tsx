import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CheckSquare, LayoutGrid, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/utils';

const navItems = [
  { to: '/', icon: BookOpen, label: '计划' },
  { to: '/checkin', icon: CheckSquare, label: '打卡' },
  { to: '/categories', icon: LayoutGrid, label: '任务' },
  { to: '/stats', icon: BarChart2, label: '复盘' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav aria-label="主要导航" className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center py-2.5 px-3 sm:px-4 text-xs sm:text-sm transition-all duration-200 relative',
                  isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full brand-gradient" />
                  )}
                  <div className={cn(
                    'rounded-xl p-1.5 transition-all duration-200',
                    isActive ? 'bg-orange-50 brand-glow' : ''
                  )}>
                    <Icon className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200',
                      isActive ? 'text-orange-500' : 'text-gray-400'
                    )} />
                  </div>
                  <span className={cn(
                    'font-medium mt-0.5 transition-all duration-200',
                    isActive ? 'text-orange-600' : ''
                  )}>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center py-2.5 px-3 sm:px-4 text-xs sm:text-sm transition-all duration-200 relative',
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full brand-gradient" />
                )}
                <div className={cn(
                  'rounded-xl p-1.5 transition-all duration-200',
                  isActive ? 'bg-orange-50 brand-glow' : ''
                )}>
                  <Settings className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200',
                    isActive ? 'text-orange-500' : 'text-gray-400'
                  )} />
                </div>
                <span className={cn(
                  'font-medium mt-0.5 transition-all duration-200',
                  isActive ? 'text-orange-600' : ''
                )}>设置</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};