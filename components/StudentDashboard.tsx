
import React from 'react';
import { Course } from '../types';
import { Timetable } from './Timetable';
import { CourseList } from './CourseList';
import { StarIcon } from './icons/StarIcon';

interface StudentDashboardProps {
  allCourses: Course[];
  enrolledCourses: Course[];
  enrolledCourseIds: Set<string>;
  recommendedCourseIds: Set<string>;
  onEnroll: (courseId: string) => void;
  onDrop: (courseId: string) => void;
  isClashing: (courseId: string) => boolean;
  onViewDetails: (courseId: string) => void;
  onGenerateRecommendations: () => void;
  isGeneratingRecommendations: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  allCourses,
  enrolledCourses,
  enrolledCourseIds,
  recommendedCourseIds,
  onEnroll,
  onDrop,
  isClashing,
  onViewDetails,
  onGenerateRecommendations,
  isGeneratingRecommendations,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">My Timetable</h2>
        {enrolledCourses.length > 0 ? (
          <Timetable courses={enrolledCourses} />
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-slate-500">Your timetable is empty. Enroll in a course to get started!</p>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-700">Available Courses</h2>
            <button
                onClick={onGenerateRecommendations}
                disabled={isGeneratingRecommendations}
                className="flex items-center space-x-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:bg-green-300 disabled:cursor-wait"
            >
                <StarIcon className={`w-5 h-5 ${isGeneratingRecommendations ? 'animate-spin' : ''}`} />
                <span>{isGeneratingRecommendations ? 'Thinking...' : 'Recommend'}</span>
            </button>
        </div>
        <CourseList
          courses={allCourses}
          enrolledCourseIds={enrolledCourseIds}
          recommendedCourseIds={recommendedCourseIds}
          onEnroll={onEnroll}
          onDrop={onDrop}
          isClashing={isClashing}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
};
