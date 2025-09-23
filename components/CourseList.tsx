
import React from 'react';
import { Course } from '../types';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: Course[];
  enrolledCourseIds: Set<string>;
  recommendedCourseIds: Set<string>;
  onEnroll: (courseId: string) => void;
  onDrop: (courseId: string) => void;
  isClashing: (courseId: string) => boolean;
  onViewDetails: (courseId: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  enrolledCourseIds,
  recommendedCourseIds,
  onEnroll,
  onDrop,
  isClashing,
  onViewDetails,
}) => {

  const recommended = courses.filter(c => recommendedCourseIds.has(c.id) && !enrolledCourseIds.has(c.id));
  const other = courses.filter(c => !recommendedCourseIds.has(c.id) && !enrolledCourseIds.has(c.id));
  
  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] overflow-y-auto pr-2">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-600">Recommended For You</h3>
        {recommended.length > 0 ? (
          <div className="space-y-3">
          {recommended.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.has(course.id)}
              onEnroll={onEnroll}
              onDrop={onDrop}
              isClashing={isClashing(course.id)}
              isRecommended={true}
              onViewDetails={onViewDetails}
            />
          ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No recommendations based on your free slots. Try dropping a course.</p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-slate-600">All Courses</h3>
        <div className="space-y-3">
        {other.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={enrolledCourseIds.has(course.id)}
            onEnroll={onEnroll}
            onDrop={onDrop}
            isClashing={isClashing(course.id)}
            isRecommended={false}
            onViewDetails={onViewDetails}
          />
        ))}
        </div>
      </div>
    </div>
  );
};
