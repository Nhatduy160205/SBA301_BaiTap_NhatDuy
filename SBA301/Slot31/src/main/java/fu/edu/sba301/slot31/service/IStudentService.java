package fu.edu.sba301.slot31.service;

import fu.edu.sba301.slot31.entity.Student;
import java.util.List;

public interface IStudentService {
    Student create(Student student);
    List<Student> getAll();
    Student getById(Long id);
    Student update(Student student);
    void delete(Long id);
}