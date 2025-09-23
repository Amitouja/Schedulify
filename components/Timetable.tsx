
import React from 'react';
import { Course, Day } from '../types';

const daysOfWeek = [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday];
const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM (17:00)

const courseColors = [
  'bg-blue-200 border-blue-400 text-blue-800',
  'bg-pink-200 border-pink-400 text-pink-800',
  'bg-green-200 border-green-400 text-green-800',
  'bg-purple-200 border-purple-400 text-purple-800',
  'bg-yellow-200 border-yellow-400 text-yellow-800',
  'bg-indigo-200 border-indigo-400 text-indigo-800',
];

export const Timetable: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const courseColorMap = new Map<string, string>();
  let colorIndex = 0;

  courses.forEach(course => {
    if (!courseColorMap.has(course.id)) {
      courseColorMap.set(course.id, courseColors[colorIndex % courseColors.length]);
      colorIndex++;
    }
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg overflow-x-auto">
      <div className="grid grid-cols-[auto_repeat(5,1fr)] grid-rows-[auto_repeat(11,auto)] gap-1 relative" style={{ minWidth: '700px' }}>
        {/* Headers */}
        <div className="sticky left-0 bg-white z-20 col-start-1 row-start-1"></div> {/* Corner */}
        {daysOfWeek.map((day, index) => (
          <div key={day} className="text-center font-bold text-slate-600 p-2 col-start-2 row-start-1" style={{gridColumnStart: index + 2}}>
            {day}
          </div>
        ))}

        {/* Time slots labels and grid lines */}
        {timeSlots.map((time, index) => (
          <React.Fragment key={time}>
            <div className="text-right text-sm text-slate-500 pr-2 sticky left-0 bg-white z-20 flex items-start pt-1" style={{gridRow: index + 2}}>
              {time}:00
            </div>
            {daysOfWeek.map((day, dayIndex) => (
              <div
                key={`${day}-${time}`}
                className="h-16 border-t border-l border-slate-100"
                style={{ gridRow: index + 2, gridColumn: dayIndex + 2 }}
              ></div>
            ))}
          </React.Fragment>
        ))}

        {/* Course Blocks */}
        {courses.map(course => {
          const color = courseColorMap.get(course.id);
          return course.slots.map((slot, slotIndex) => {
            const dayIndex = daysOfWeek.indexOf(slot.day);
            const startIndex = timeSlots.indexOf(slot.start);
            const duration = slot.end - slot.start;

            if (dayIndex === -1 || startIndex === -1) return null;

            return (
              <div
                key={`${course.id}-${slotIndex}`}
                className={`p-2 rounded-lg border-l-4 overflow-hidden ${color} shadow-sm z-10 m-px`}
                style={{
                  gridColumn: `${dayIndex + 2}`,
                  gridRow: `${startIndex + 2} / span ${duration}`,
                }}
              >
                <p className="font-bold text-sm">{course.code}</p>
                <p className="text-xs">{course.name}</p>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
