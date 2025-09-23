
import React, { useState } from 'react';
import { User } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface LoginPageProps {
  users: User[];
  onLogin: (userId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onLogin(selectedUserId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <BookOpenIcon className="w-12 h-12 mx-auto text-blue-500" />
            <h2 className="mt-4 text-3xl font-bold text-slate-800">Welcome to Course Planner</h2>
            <p className="mt-2 text-slate-600">Please select your profile to sign in.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium text-slate-700">
              Select User
            </label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!selectedUserId}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
