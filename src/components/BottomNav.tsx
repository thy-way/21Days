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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center py-3 px-3 sm:px-4 text-xs sm:text-sm transition-colors duration-150',
                  isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 transition-all duration-150',
                    isActive ? 'text-orange-500' : 'text-gray-400'
                  )} />
                  <span className="font-medium mt-0.5">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center py-3 px-3 sm:px-4 text-xs sm:text-sm transition-colors duration-150',
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Settings className={cn(
                  'w-5 h-5 sm:w-6 sm:h-6 transition-all duration-150',
                  isActive ? 'text-orange-500' : 'text-gray-400'
                )} />
                <span className="font-medium mt-0.5">设置</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};