
import React from 'react';
import { useTimetable } from './hooks/useTimetable';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { UserRole } from './types';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AddCourseModal } from './components/AddCourseModal';

function App() {
  const {
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
  } = useTimetable();

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case UserRole.Student:
        return <StudentDashboard
          allCourses={allCourses}
          enrolledCourses={enrolledCourses}
          enrolledCourseIds={enrolledCourseIds}
          recommendedCourseIds={recommendedCourseIds}
          isClashing={isClashing}
          onEnroll={handleEnroll}
          onDrop={handleDrop}
          onViewDetails={handleViewDetails}
          onGenerateRecommendations={generateRecommendations}
          isGeneratingRecommendations={isGeneratingRecommendations}
        />;
      case UserRole.Faculty:
        return <FacultyDashboard 
          facultyId={currentUser.id} 
          allCourses={allCourses} 
          onAddNewCourse={() => setIsAddCourseModalOpen(true)}
        />;
      case UserRole.Admin:
        return <AdminDashboard users={users} courses={allCourses} faculties={faculties} />;
      default:
        return <p>Unknown user role.</p>;
    }
  };

  const selectedFaculty = selectedCourse ? faculties.find(f => f.id === selectedCourse.facultyId) : null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {currentUser && <Header user={currentUser} onLogout={logout} />}
      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : !currentUser ? (
          <LoginPage users={users} onLogin={login} />
        ) : (
          renderDashboard()
        )}
      </main>
      
      <CourseDetailModal
        course={selectedCourse}
        faculty={selectedFaculty}
        onClose={handleCloseDetailModal}
      />
      
      {currentUser?.role === UserRole.Faculty && (
        <AddCourseModal
          isOpen={isAddCourseModalOpen}
          onClose={() => setIsAddCourseModalOpen(false)}
          onSubmit={handleAddNewCourse}
          facultyId={currentUser.id}
        />
      )}
    </div>
  );
}

export default App;
