import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CourseContext = createContext();
export const useCourses = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const { user, setUser } = useAuth();

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ==========================
  // FETCH ALL COURSES
  // ==========================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://course-api-9imo.onrender.com/api/courses");
      const data = await res.json();

      // ⭐ FIXED: NORMALIZE COURSE OBJECTS FOR UI
      setCourses(
        (data || []).map((c) => ({
          ...c,
          id: c.id || c.course_id || c.courseId,

          // 🔥 CRITICAL FIX: Map backend fields → UI fields
          title: c.title || c.name || "",
          category: c.category || c.type || "General",
          difficulty: c.difficulty || c.level || "Beginner",
          description: c.description || "",
          duration: c.duration || "",
          thumbnail: c.thumbnail || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // ADD COURSE
  // ==========================
  const addCourse = async (courseData) => {
    try {
      setActionLoading(true);

      const payload = {
        name: courseData.title,
        duration: courseData.duration,
        type: courseData.category,
        level: courseData.difficulty,
        description: courseData.description,
      };

      const res = await fetch("https://course-api-9imo.onrender.com/api/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to add course");
        return null;
      }

      const newCourse = await res.json();

      // Add to UI immediately
      setCourses((prev) => [
        ...prev,
        {
          id: newCourse.id,
          title: newCourse.name,
          duration: newCourse.duration,
          category: newCourse.type,
          difficulty: newCourse.level,
          description: newCourse.description,
          thumbnail: "",
          lessons: [],
          teachers: [],
          students: [],
        },
      ]);

      alert("Course added successfully!");
      return newCourse;
    } catch (err) {
      console.error("Add course error:", err);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================
  // DELETE COURSE
  // ==========================
  const deleteCourse = async (id) => {
    try {
      setActionLoading(true);

      const response = await fetch(
        `https://course-api-9imo.onrender.com/api/courses/delete/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        alert("Delete failed");
        return null;
      }

      setCourses((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error("Delete course error:", err);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================
  // FETCH STUDENT ENROLLMENTS
  // ==========================
  const fetchEnrolledCourses = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `https://course-api-9imo.onrender.com/api/enrollments/student/${user.id}`
      );

      const data = await res.json();
      setEnrolledCourses(data || []);

      // ⭐ keep enrolledCourses updated
      setUser((prev) =>
        prev
          ? {
              ...prev,
              enrolledCourses: (data || []).map((c) => c.courseId),
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user]);

  // ==========================
  // ENROLL IN COURSE
  // ==========================
  const enrollInCourse = async (courseId, payload) => {
    try {
      setActionLoading(true);

      const res = await fetch(
        `https://course-api-9imo.onrender.com/api/enrollments/course/${courseId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Enrollment failed");
        return null;
      }

      await res.json();

      alert("Enrolled Successfully!");
      await fetchEnrolledCourses();

      return true;
    } catch (err) {
      console.error("Enroll error:", err);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourses,
        loading,
        actionLoading,
        enrollInCourse,
        fetchEnrolledCourses,
        deleteCourse,
        addCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
