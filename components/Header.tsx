
import React from 'react';
import { User } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-700">Course Planner</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-sm text-slate-500">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
