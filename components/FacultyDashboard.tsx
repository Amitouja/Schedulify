import React from 'react';
import { Course } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface FacultyDashboardProps {
  facultyId: string;
  allCourses: Course[];
  onAddNewCourse: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ facultyId, allCourses, onAddNewCourse }) => {
  const myCourses = allCourses.filter(course => course.facultyId === facultyId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-700">My Courses</h2>
        <button
          onClick={onAddNewCourse}
          className="flex items-center space-x-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg">
        {myCourses.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {myCourses.map(course => (
              <li key={course.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">{course.name} <span className="text-sm font-normal text-slate-500">({course.code})</span></p>
                  <p className="text-sm text-slate-600">{course.credits} Credits &bull; {course.enrolledStudentIds.length} / {course.capacity} students</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Manage
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-8">You haven't created any courses yet.</p>
        )}
      </div>
    </div>
  );
};