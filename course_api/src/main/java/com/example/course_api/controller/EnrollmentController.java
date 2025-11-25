package com.example.course_api.controller;

import com.example.course_api.model.Enrollment;
import com.example.course_api.service.EnrollmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin("*")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Enrollment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Enrollment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> getByStudentId(@PathVariable Long studentId) {
        return service.getByStudentId(studentId);
    }

    @PostMapping("/course/{courseId}")
    public Enrollment create(@PathVariable Long courseId, @RequestBody Enrollment enrollment) {
        return service.save(courseId, enrollment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
