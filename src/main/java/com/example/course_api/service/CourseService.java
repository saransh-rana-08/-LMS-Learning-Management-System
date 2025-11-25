package com.example.course_api.service;

import com.example.course_api.model.Course;
import com.example.course_api.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    // Add Course
    public Course addCourse(Course course) {
        return repo.save(course);
    }

    // Get All Courses
    public List<Course> getAllCourses() {
        return repo.findAll();
    }

    // Get Course by ID
    public Course getCourseById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Update Course
    public Course updateCourse(Long id, Course newData) {
        Course c = repo.findById(id).orElse(null);
        if (c != null) {
            c.setName(newData.getName());
            c.setDuration(newData.getDuration());
            c.setType(newData.getType());
            c.setLevel(newData.getLevel());
            c.setDescription(newData.getDescription());
            return repo.save(c);
        }
        return null;
    }

    // Delete Course
    public String deleteCourse(Long id) {
        repo.deleteById(id);
        return "Course deleted";
    }
}
