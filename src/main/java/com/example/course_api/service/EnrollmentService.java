package com.example.course_api.service;

import com.example.course_api.model.Course;
import com.example.course_api.model.Enrollment;
import com.example.course_api.repository.CourseRepository;
import com.example.course_api.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Enrollment> getAll() {
        return enrollmentRepository.findAll();
    }

    public Enrollment getById(Long id) {
        return enrollmentRepository.findById(id).orElse(null);
    }

    public List<Enrollment> getByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public Enrollment save(Long courseId, Enrollment enrollment) {
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course != null) {
            enrollment.setCourse(course);
        }
        return enrollmentRepository.save(enrollment);
    }

    public void delete(Long id) {
        enrollmentRepository.deleteById(id);
    }
}
