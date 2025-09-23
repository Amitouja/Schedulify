
import React from 'react';
import { Course, CourseType } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';
import { StarIcon } from './icons/StarIcon';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onDrop: (courseId: string) => void;
  isClashing: boolean;
  isRecommended: boolean;
  onViewDetails: (courseId: string) => void;
}

const typeColors: Record<CourseType, string> = {
  [CourseType.Major]: 'bg-blue-100 text-blue-800',
  [CourseType.Minor]: 'bg-pink-100 text-pink-800',
  [CourseType.Skill]: 'bg-green-100 text-green-800',
  [CourseType.ValueAdded]: 'bg-purple-100 text-purple-800',
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onDrop,
  isClashing,
  isRecommended,
  onViewDetails,
}) => {
  const seatsLeft = course.capacity - course.enrolledStudentIds.length;
  const isFull = seatsLeft <= 0;

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEnrolled && !isClashing && !isFull) {
      onEnroll(course.id);
    }
  };

  const handleDrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled) {
      onDrop(course.id);
    }
  };

  const buttonDisabled = isClashing || isFull;

  return (
    <div 
      className={`bg-white p-4 rounded-xl shadow-md border-l-4 transition-all duration-300 ${isRecommended ? 'border-green-400' : 'border-slate-300'} hover:shadow-lg hover:border-blue-400 cursor-pointer`}
      onClick={() => onViewDetails(course.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewDetails(course.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${typeColors[course.type]}`}>{course.type}</p>
          <h4 className="font-bold mt-1">{course.name}</h4>
          <p className="text-sm text-slate-500">{course.code} &bull; {course.credits} Credits</p>
        </div>
        {isRecommended && !isEnrolled && <StarIcon className="w-5 h-5 text-green-500" />}
      </div>

      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-3">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4" />
          <span>{course.slots.map(s => `${s.day} ${s.start}:00-${s.end}:00`).join(', ')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <UsersIcon className="w-4 h-4" />
          <span>{seatsLeft} / {course.capacity} seats left</span>
        </div>
      </div>

      <div className="mt-4">
        {isEnrolled ? (
          <button
            onClick={handleDrop}
            className="w-full bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
          >
            Drop
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={buttonDisabled}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
              buttonDisabled
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isClashing ? 'Clash' : isFull ? 'Full' : 'Enroll'}
          </button>
        )}
      </div>
    </div>
  );
};
