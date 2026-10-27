package fu.edu.sba301.slot28.service;

import fu.edu.sba301.slot28.entity.Student;
import java.util.List;

public interface IStudentService {
    Student createStudent(Student student);
    Student getStudentById(Long id);
    List<Student> getAllStudents();
    List<Student> getStudentsPaged(int offset, int limit);
    Student updateStudent(Student student);
    void deleteStudent(Long id);
    void assignBookToStudent(Long studentId, Long bookId);
}