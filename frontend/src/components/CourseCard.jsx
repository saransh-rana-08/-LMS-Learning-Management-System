import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

// 🔥 CATEGORY → IMAGE MAP
const categoryImages = {
  "Programming": "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
  "Web Development": "https://img.freepik.com/free-vector/gradient-web-hosting-illustration_23-2149237109.jpg",
  "Design": "https://img.freepik.com/free-vector/flat-design-illustration-ux-ui-design_23-2149032053.jpg",
  "Business": "https://img.freepik.com/free-vector/flat-design-business-communication-concept_23-2149154244.jpg",
  "Data Science": "https://img.freepik.com/free-vector/data-scientist-illustration_23-2148785638.jpg",
};

const getCourseImage = (course) => {
  return (
    (course.thumbnail && course.thumbnail.trim()) ||
    categoryImages[course.category] ||
    "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg"
  );
};

const CourseCard = ({ course }) => {
  const { user, addEnrolledCourse } = useAuth()

  // FIX: using enrolledCourses from CourseContext
  const { enrollInCourse, enrolledCourses, actionLoading } = useCourses()

  // FIX: Your backend gives name/type/level, but UI needs title/category/difficulty
  const title = course.title || course.name
  const category = course.category || course.type
  const difficulty = course.difficulty || course.level

  // FIX: isEnrolled working
  const isEnrolled =
    (enrolledCourses || []).some(
      (c) => c.courseId == course.id || c.id == course.id
    ) ||
    (user?.enrolledCourses?.includes(course.id))

  const handleEnroll = async () => {
    if (!user) {
      alert("Please login to enroll in courses")
      return
    }

    const payload = {
      studentId: user.id,
      studentName: user.name,
      name: title,
      duration: course.duration,
      type: category,
      level: difficulty,
      description: course.description
    }

    const result = await enrollInCourse(course.id, payload)
    if (result) addEnrolledCourse(course.id)
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">

      {/* IMAGE */}
      <img
        src={getCourseImage(course)}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Category + Difficulty */}
      <div className="flex justify-between items-start mb-2">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
          {category}
        </span>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
          {difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Rating + Duration */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {course.rating || 4.5}
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {course.duration}
        </span>
      </div>

      {/* Enroll Button */}
      <button
        onClick={handleEnroll}
        disabled={isEnrolled || actionLoading}
        className={`w-full ${
          isEnrolled ? "btn-secondary cursor-not-allowed" : "btn-primary"
        }`}
      >
        {actionLoading
          ? "Enrolling..."
          : isEnrolled
          ? "Enrolled"
          : "Enroll Now"}
      </button>
    </div>
  )
}

export default CourseCard
