import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};