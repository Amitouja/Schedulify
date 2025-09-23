
import React from 'react';
import { Course, Faculty, CourseType } from '../types';
import { Modal } from './Modal';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';
import { UserIcon } from './icons/UserIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface CourseDetailModalProps {
  course: Course | null;
  faculty: Faculty | null;
  onClose: () => void;
}

const typeColors: Record<CourseType, string> = {
    [CourseType.Major]: 'bg-blue-100 text-blue-800 border-blue-300',
    [CourseType.Minor]: 'bg-pink-100 text-pink-800 border-pink-300',
    [CourseType.Skill]: 'bg-green-100 text-green-800 border-green-300',
    [CourseType.ValueAdded]: 'bg-purple-100 text-purple-800 border-purple-300',
};

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, faculty, onClose }) => {
  if (!course) return null;

  const seatsLeft = course.capacity - course.enrolledStudentIds.length;

  return (
    <Modal isOpen={!!course} onClose={onClose} title={course.name}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-sm font-bold px-3 py-1 border rounded-full inline-block ${typeColors[course.type]}`}>{course.type}</p>
                <p className="text-lg text-slate-500 mt-2">{course.code} &bull; {course.credits} Credits</p>
            </div>
        </div>
        
        <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{course.description}</p>
        
        <div className="border-t border-slate-200 pt-4 space-y-4">
             <div className="flex items-center space-x-3 text-slate-600">
                <UserIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Taught by <span className="font-semibold text-slate-800">{faculty?.name || 'N/A'}</span></span>
            </div>
            <div className="flex items-start space-x-3 text-slate-600">
                <ClockIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                    <span className="font-semibold text-slate-800">Schedule</span>
                    <ul className="mt-1 space-y-1">
                        {course.slots.map((s, i) => <li key={i} className="text-sm">{s.day}, {s.start}:00 - {s.end}:00</li>)}
                    </ul>
                </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
                <UsersIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span><span className="font-semibold text-slate-800">{seatsLeft}</span> of <span className="font-semibold text-slate-800">{course.capacity}</span> seats available</span>
            </div>
        </div>
      </div>
    </Modal>
  );
};
