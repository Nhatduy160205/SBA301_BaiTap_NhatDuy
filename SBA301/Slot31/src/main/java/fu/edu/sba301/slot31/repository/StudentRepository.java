package fu.edu.sba301.slot31.repository;

import fu.edu.sba301.slot31.dao.StudentDAO;
import fu.edu.sba301.slot31.entity.Student;

import java.util.List;
import java.util.Optional;

public class StudentRepository implements IStudentRepository {

    private final StudentDAO dao;

    public StudentRepository(StudentDAO dao) {
        this.dao = dao;
    }

    @Override
    public Student save(Student s) { return dao.save(s); }

    @Override
    public List<Student> findAll() { return dao.findAll(); }

    @Override
    public Optional<Student> findById(Long id) { return dao.findById(id); }

    @Override
    public Optional<Student> findByEmail(String email) { return dao.findByEmail(email); }

    @Override
    public Student update(Student s) { return dao.update(s); }

    @Override
    public boolean delete(Long id) { return dao.delete(id); }
}