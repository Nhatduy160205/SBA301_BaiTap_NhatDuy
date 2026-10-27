package fu.edu.sba301.slot30.service;

import fu.edu.sba301.slot30.entity.Student;
import fu.edu.sba301.slot30.repository.IStudentRepository;

import java.util.List;

public class StudentService implements IStudentService {

    private final IStudentRepository repository;

    public StudentService(IStudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Student create(Student s) {
        // Business validation strictly in Service Layer
        validate(s);
        repository.findByEmail(s.getEmail()).ifPresent(existing -> {
            throw new IllegalStateException("Email already exists");
        });
        return repository.save(s);
    }

    @Override
    public List<Student> getAll() {
        return repository.findAll();
    }

    @Override
    public Student getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    }

    @Override
    public Student update(Student s) {
        validate(s);
        if (s.getId() == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        repository.findById(s.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return repository.update(s);
    }

    @Override
    public Student updateMarks(Long id, double marks) {
        if (marks < 0.0 || marks > 10.0) {
            throw new IllegalArgumentException("Marks must be 0..10");
        }
        return repository.updateMarks(id, marks);
    }

    @Override
    public void delete(Long id) {
        if (!repository.delete(id)) {
            throw new IllegalArgumentException("Student not found");
        }
    }

    @Override
    public List<Student> getPaged(int offset, int limit) {
        if (offset < 0 || limit <= 0) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }
        return repository.findPage(offset, limit);
    }

    private void validate(Student s) {
        if (s == null) {
            throw new IllegalArgumentException("Student is required");
        }
        if (s.getEmail() == null || s.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (s.getFirstName() == null || s.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (s.getLastName() == null || s.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (s.getMarks() < 0.0 || s.getMarks() > 10.0) {
            throw new IllegalArgumentException("Marks must be 0..10");
        }
    }
}