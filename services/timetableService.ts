
import { Course, Faculty, User, Day, CourseType, UserRole } from '../types';

// Using consistent IDs for linking data
const user_student_1 = { id: 's1', name: 'Alice Johnson', role: UserRole.Student };
const user_student_2 = { id: 's2', name: 'Bob Williams', role: UserRole.Student };
const user_faculty_1 = { id: 'f1', name: 'Dr. Evelyn Reed', role: UserRole.Faculty };
const user_faculty_2 = { id: 'f2', name: 'Prof. Samuel Chen', role: UserRole.Faculty };
const user_admin_1 = { id: 'a1', name: 'Admin User', role: UserRole.Admin };

const faculty_1 = { id: 'f1', name: 'Dr. Evelyn Reed' };
const faculty_2 = { id: 'f2', name: 'Prof. Samuel Chen' };

export const mockUsers: User[] = [user_student_1, user_student_2, user_faculty_1, user_faculty_2, user_admin_1];
export const mockFaculties: Faculty[] = [faculty_1, faculty_2];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'CS101',
    name: 'Introduction to Programming',
    description: 'A foundational course on programming principles using Python. Covers variables, control structures, functions, and basic data structures.',
    credits: 3,
    capacity: 50,
    enrolledStudentIds: ['s1'],
    slots: [
      { day: Day.Monday, start: 9, end: 11 },
      { day: Day.Wednesday, start: 9, end: 11 },
    ],
    type: CourseType.Major,
    facultyId: 'f1',
  },
  {
    id: 'c2',
    code: 'MA201',
    name: 'Calculus II',
    description: 'Advanced topics in differential and integral calculus. Includes sequences, series, and multivariate calculus.',
    credits: 4,
    capacity: 40,
    enrolledStudentIds: ['s1'],
    slots: [
      { day: Day.Tuesday, start: 13, end: 15 },
      { day: Day.Thursday, start: 13, end: 15 },
    ],
    type: CourseType.Major,
    facultyId: 'f2',
  },
  {
    id: 'c3',
    code: 'DS303',
    name: 'Data Structures & Algorithms',
    description: 'Study of fundamental data structures like arrays, linked lists, trees, and graphs, along with analysis of algorithms.',
    credits: 4,
    capacity: 35,
    enrolledStudentIds: ['s2'],
    slots: [
      { day: Day.Monday, start: 14, end: 16 },
      { day: Day.Wednesday, start: 14, end: 16 },
    ],
    type: CourseType.Major,
    facultyId: 'f1',
  },
  {
    id: 'c4',
    code: 'ENG102',
    name: 'Creative Writing Workshop',
    description: 'A workshop-based course focusing on the craft of writing fiction and poetry. Peer reviews and portfolio development.',
    credits: 3,
    capacity: 20,
    enrolledStudentIds: [],
    slots: [{ day: Day.Friday, start: 10, end: 13 }],
    type: CourseType.Minor,
    facultyId: 'f2',
  },
  {
    id: 'c5',
    code: 'PM101',
    name: 'Intro to Project Management',
    description: 'Learn the basics of project management, including project lifecycles, planning, execution, and closing.',
    credits: 2,
    capacity: 60,
    enrolledStudentIds: ['s2'],
    slots: [{ day: Day.Tuesday, start: 10, end: 12 }],
    type: CourseType.Skill,
    facultyId: 'f2',
  },
  {
    id: 'c6',
    code: 'VA001',
    name: 'Mindfulness and Well-being',
    description: 'Explore techniques for mindfulness, stress reduction, and improving overall mental well-being.',
    credits: 1,
    capacity: 100,
    enrolledStudentIds: [],
    slots: [{ day: Day.Thursday, start: 16, end: 17 }],
    type: CourseType.ValueAdded,
    facultyId: 'f1',
  },
];

export const getInitialData = (): Promise<{ courses: Course[]; faculties: Faculty[]; users: User[] }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        courses: JSON.parse(JSON.stringify(mockCourses)),
        faculties: JSON.parse(JSON.stringify(mockFaculties)),
        users: JSON.parse(JSON.stringify(mockUsers)),
      });
    }, 500); // Simulate network delay
  });
};
