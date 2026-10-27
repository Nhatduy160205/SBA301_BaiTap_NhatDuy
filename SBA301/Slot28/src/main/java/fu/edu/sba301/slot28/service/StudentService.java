package fu.edu.sba301.slot28.service;

import fu.edu.sba301.slot28.entity.Book;
import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.repository.IBookRepository;
import fu.edu.sba301.slot28.repository.IStudentRepository;

import java.util.List;

public class StudentService implements IStudentService {

    private final IStudentRepository studentRepository;
    private final IBookRepository bookRepository;

    public StudentService(IStudentRepository studentRepository, IBookRepository bookRepository) {
        this.studentRepository = studentRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public Student createStudent(Student student) {
        // Business logic strictly in Service layer
        validate(student);
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already exists: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findByIdWithBooks(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public List<Student> getStudentsPaged(int offset, int limit) {
        if (offset < 0 || limit <= 0) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }
        return studentRepository.findPage(offset, limit);
    }

    @Override
    public Student updateStudent(Student student) {
        validate(student);
        if (student.getId() == null) {
            throw new IllegalArgumentException("Student ID cannot be null for update");
        }
        studentRepository.findById(student.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + student.getId()));
        return studentRepository.update(student);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.delete(id)) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
    }

    @Override
    public void assignBookToStudent(Long studentId, Long bookId) {
        Student student = studentRepository.findByIdWithBooks(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + bookId));

        boolean alreadyAssigned = student.getBooks().stream().anyMatch(b -> b.getId().equals(bookId));
        if (alreadyAssigned) {
            throw new IllegalStateException("Book already assigned to this student");
        }

        student.addBook(book);
        studentRepository.update(student);
    }

    private void validate(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student object cannot be null");
        }
        if (student.getEmail() == null || student.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (student.getFirstName() == null || student.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (student.getLastName() == null || student.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (student.getMarks() < 0.0 || student.getMarks() > 10.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 10.0");
        }
    }
}