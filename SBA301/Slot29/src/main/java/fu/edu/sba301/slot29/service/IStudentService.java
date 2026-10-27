package fu.edu.sba301.slot29.service;

import fu.edu.sba301.slot29.entity.Student;
import java.util.List;

public interface IStudentService {
    List<Student> getStudents();
    Student getStudent(Long id);
    Student createStudent(Student student);
    Student updateStudent(Student student);
    void deleteStudent(Long id);
    void borrowBook(Long studentId, Long bookId);
    void returnBook(Long studentId, Long bookId);
    List<Student> getStudentsByBook(Long bookId);
}