package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.dao.StudentDAO;
import fu.edu.sba301.slot29.entity.Student;

import java.util.List;
import java.util.Optional;

public class StudentRepository implements IStudentRepository {

    private final StudentDAO dao;

    public StudentRepository(StudentDAO dao) {
        this.dao = dao;
    }

    @Override
    public Student save(Student student) { return dao.save(student); }

    @Override
    public List<Student> findAll() { return dao.findAll(); }

    @Override
    public Optional<Student> findById(Long id) { return dao.findById(id); }

    @Override
    public Optional<Student> findByIdWithBooks(Long id) { return dao.findByIdWithBooks(id); }

    @Override
    public Optional<Student> findByEmail(String email) { return dao.findByEmail(email); }

    @Override
    public List<Student> findStudentsByBook(Long bookId) { return dao.findStudentsByBook(bookId); }

    @Override
    public Student update(Student student) { return dao.update(student); }

    @Override
    public boolean delete(Long id) { return dao.delete(id); }
}