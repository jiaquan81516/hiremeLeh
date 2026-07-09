import { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [course, setCourse] = useState(() => {
    try {
      return localStorage.getItem('hiremeLeh_course') || 'scis';
    } catch {
      return 'is';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hiremeLeh_course', course);
    } catch {}
  }, [course]);

  return <CourseContext.Provider value={{ course, setCourse }}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  return useContext(CourseContext);
}
