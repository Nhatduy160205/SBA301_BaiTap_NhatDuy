package fu.edu.sba301.slot29.service;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.repository.IBookRepository;
import fu.edu.sba301.slot29.repository.IStudentRepository;

import java.util.List;

public class StudentService implements IStudentService {

    private final IStudentRepository studentRepository;
    private final IBookRepository bookRepository;

    public StudentService(IStudentRepository studentRepository, IBookRepository bookRepository) {
        this.studentRepository = studentRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudent(Long id) {
        return studentRepository.findByIdWithBooks(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    }

    @Override
    public Student createStudent(Student student) {
        // Business logic validation strictly in Service layer
        validate(student);
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already exists: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Student student) {
        validate(student);
        if (student.getId() == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        studentRepository.findById(student.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return studentRepository.update(student);
    }

    @Override
    public void deleteStudent(Long id) {
        // Business check: delete student does not delete shared books!
        if (!studentRepository.delete(id)) {
            throw new IllegalArgumentException("Student not found");
        }
    }

    @Override
    public void borrowBook(Long studentId, Long bookId) {
        // Business rules check in Service
        Student student = studentRepository.findByIdWithBooks(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        boolean alreadyBorrowed = student.getBooks().stream()
                .anyMatch(b -> b.getId().equals(bookId));
        if (alreadyBorrowed) {
            throw new IllegalStateException("Book already associated");
        }

        student.addBook(book);
        studentRepository.update(student);
    }

    @Override
    public void returnBook(Long studentId, Long bookId) {
        Student student = getStudent(studentId);
        Book book = student.getBooks().stream()
                .filter(b -> b.getId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Association not found"));

        student.removeBook(book);
        studentRepository.update(student);
    }

    @Override
    public List<Student> getStudentsByBook(Long bookId) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        return studentRepository.findStudentsByBook(bookId);
    }

    private void validate(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
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