
import React from 'react';
import { Course, Faculty, User } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface AdminDashboardProps {
  users: User[];
  courses: Course[];
  faculties: Faculty[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string, color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, courses, faculties }) => {
  const studentCount = users.filter(u => u.role === 'Student').length;
  const facultyCount = users.filter(u => u.role === 'Faculty').length;
  const courseCount = courses.length;

  return (
    <div className="space-y-8">
       <h2 className="text-2xl font-bold text-slate-700">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<UsersIcon className="w-8 h-8 text-blue-500" />} 
          title="Total Students" 
          value={studentCount}
          color="border-blue-500"
        />
        <StatCard 
          icon={<UserIcon className="w-8 h-8 text-green-500" />} 
          title="Total Faculty" 
          value={facultyCount}
          color="border-green-500"
        />
        <StatCard 
          icon={<BookOpenIcon className="w-8 h-8 text-purple-500" />} 
          title="Total Courses" 
          value={courseCount}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2" /> All Users</h3>
              <ul className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                  {users.map(user => (
                      <li key={user.id} className="py-3 flex justify-between items-center">
                          <div>
                              <p className="font-medium text-slate-800">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.role}</p>
                          </div>
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{user.id}</span>
                      </li>
                  ))}
              </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center"><BookOpenIcon className="w-5 h-5 mr-2" /> All Courses</h3>
              <ul className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                  {courses.map(course => (
                       <li key={course.id} className="py-3">
                           <p className="font-medium text-slate-800">{course.name} <span className="text-sm font-normal text-slate-500">({course.code})</span></p>
                           <p className="text-sm text-slate-600">{course.enrolledStudentIds.length} / {course.capacity} students</p>
                       </li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
};
