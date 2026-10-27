package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.entity.Student;
import java.util.List;
import java.util.Optional;

public interface IStudentRepository {
    Student save(Student student);
    List<Student> findAll();
    Optional<Student> findById(Long id);
    Optional<Student> findByIdWithBooks(Long id);
    Optional<Student> findByEmail(String email);
    List<Student> findStudentsByBook(Long bookId);
    Student update(Student student);
    boolean delete(Long id);
}