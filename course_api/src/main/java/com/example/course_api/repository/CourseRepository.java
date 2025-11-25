package com.example.course_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.course_api.model.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
