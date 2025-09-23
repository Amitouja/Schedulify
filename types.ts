
export enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
}

export interface TimeSlot {
  day: Day;
  start: number; // Hour (e.g., 9 for 9:00 AM)
  end: number;   // Hour (e.g., 10 for 10:00 AM)
}

export enum CourseType {
  Major = 'Major',
  Minor = 'Minor',
  Skill = 'Skill',
  ValueAdded = 'Value Added',
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  capacity: number;
  enrolledStudentIds: string[];
  slots: TimeSlot[];
  type: CourseType;
  facultyId: string;
}

export type NewCourseData = Omit<Course, 'id' | 'enrolledStudentIds'>;

export interface Faculty {
    id: string;
    name: string;
}

export enum UserRole {
    Student = 'Student',
    Faculty = 'Faculty',
    Admin = 'Admin',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}
