
import { useState, useEffect, useMemo } from 'react';
import { Course, Faculty, User, UserRole, TimeSlot, NewCourseData, Day } from '../types';
import { getInitialData } from '../services/timetableService';
import { GoogleGenAI, Type } from "@google/genai";

export const useTimetable = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [recommendedCourseIds, setRecommendedCourseIds] = useState<Set<string>>(new Set());
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { courses, faculties, users } = await getInitialData();
        setAllCourses(courses);
        setFaculties(faculties);
        setUsers(users);
      } catch (err) {
        setError('Failed to load timetable data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if(user.role === UserRole.Student) {
        const studentCourses = allCourses.filter(c => c.enrolledStudentIds.includes(user.id));
        setEnrolledCourseIds(new Set(studentCourses.map(c => c.id)));
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setEnrolledCourseIds(new Set());
    setRecommendedCourseIds(new Set());
  };
  
  const enrolledCourses = useMemo(() => {
      return allCourses.filter(course => enrolledCourseIds.has(course.id));
  }, [allCourses, enrolledCourseIds]);

  const isClashing = (courseId: string): boolean => {
    const targetCourse = allCourses.find(c => c.id === courseId);
    if (!targetCourse) return false;

    for (const enrolledCourse of enrolledCourses) {
      for (const targetSlot of targetCourse.slots) {
        for (const enrolledSlot of enrolledCourse.slots) {
          if (targetSlot.day === enrolledSlot.day) {
            // Check for time overlap
            if (targetSlot.start < enrolledSlot.end && targetSlot.end > enrolledSlot.start) {
              return true; // Clash detected
            }
          }
        }
      }
    }
    return false;
  };

  const handleEnroll = (courseId: string) => {
    if (!currentUser || currentUser.role !== UserRole.Student) return;
    
    setAllCourses(prevCourses => prevCourses.map(c => {
        if (c.id === courseId) {
            return { ...c, enrolledStudentIds: [...c.enrolledStudentIds, currentUser.id] };
        }
        return c;
    }));
    setEnrolledCourseIds(prev => new Set(prev).add(courseId));
  };

  const handleDrop = (courseId: string) => {
    if (!currentUser || currentUser.role !== UserRole.Student) return;

    setAllCourses(prevCourses => prevCourses.map(c => {
        if (c.id === courseId) {
            return { ...c, enrolledStudentIds: c.enrolledStudentIds.filter(id => id !== currentUser.id) };
        }
        return c;
    }));

    setEnrolledCourseIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(courseId);
      return newSet;
    });
  };

  const handleViewDetails = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourse(null);
  };
  
  const handleAddNewCourse = (courseData: NewCourseData) => {
    const newCourse: Course = {
      ...courseData,
      id: `c${allCourses.length + 1}`, // simple ID generation
      enrolledStudentIds: [],
    };
    setAllCourses(prev => [...prev, newCourse]);
    setIsAddCourseModalOpen(false);
  };

  const getFreeSlots = (): TimeSlot[] => {
    const busySlots: TimeSlot[] = enrolledCourses.flatMap(c => c.slots);
    const freeSlots: TimeSlot[] = [];
    const days = [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday];
    const timeHours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 to 17

    for (const day of days) {
        for (const hour of timeHours) {
            const isBusy = busySlots.some(slot => slot.day === day && hour >= slot.start && hour < slot.end);
            if (!isBusy) {
                freeSlots.push({ day: day, start: hour, end: hour + 1 });
            }
        }
    }
    return freeSlots;
  }
  
  const generateRecommendations = async () => {
    if (!process.env.API_KEY) {
        alert("API_KEY environment variable not set.");
        return;
    }
    setIsGeneratingRecommendations(true);
    setRecommendedCourseIds(new Set());

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const freeSlots = getFreeSlots();
        const availableCourses = allCourses.filter(c => !enrolledCourseIds.has(c.id));
        
        const prompt = `Based on the user's free time slots and the list of available courses, recommend up to 3 courses. The user is free during these slots: ${JSON.stringify(freeSlots)}. Here are the available courses with their schedules: ${JSON.stringify(availableCourses.map(c => ({id: c.id, name: c.name, slots: c.slots})))}. Only recommend courses that fit perfectly into the free slots without causing any clashes. Return a JSON object with a single key "recommended_course_ids" which is an array of strings representing the course IDs.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommended_course_ids: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ["recommended_course_ids"],
                },
            },
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        
        if (result.recommended_course_ids && Array.isArray(result.recommended_course_ids)) {
             setRecommendedCourseIds(new Set(result.recommended_course_ids));
        }

    } catch (e) {
        console.error("Error generating recommendations:", e);
        alert("Failed to get recommendations from Gemini.");
    } finally {
        setIsGeneratingRecommendations(false);
    }
  };

  return {
    allCourses,
    faculties,
    users,
    currentUser,
    isLoading,
    error,
    login,
    logout,
    enrolledCourseIds,
    enrolledCourses,
    recommendedCourseIds,
    isClashing,
    handleEnroll,
    handleDrop,
    isDetailModalOpen,
    selectedCourse,
    handleViewDetails,
    handleCloseDetailModal,
    isAddCourseModalOpen,
    setIsAddCourseModalOpen,
    handleAddNewCourse,
    generateRecommendations,
    isGeneratingRecommendations
  };
};
