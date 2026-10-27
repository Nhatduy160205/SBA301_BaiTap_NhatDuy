package fu.edu.sba301.slot30.app;

import fu.edu.sba301.slot30.dao.StudentDAO;
import fu.edu.sba301.slot30.entity.Student;
import fu.edu.sba301.slot30.repository.IStudentRepository;
import fu.edu.sba301.slot30.repository.StudentRepository;
import fu.edu.sba301.slot30.service.IStudentService;
import fu.edu.sba301.slot30.service.StudentService;
import fu.edu.sba301.slot30.util.HibernateUtil;
import org.hibernate.SessionFactory;

public class Main {
    public static void main(String[] args) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        StudentDAO dao = new StudentDAO(sf);
        IStudentRepository repo = new StudentRepository(dao);
        IStudentService service = new StudentService(repo);

        System.out.println("=== Slot 30: Hibernate CRUD Application with Layered Architecture ===");
        Student created = service.create(
                new Student("slot30@fu.edu.vn", "Slot", "Thirty", 8.5)
        );
        System.out.println("Created: " + created);

        Student found = service.getById(created.getId());
        System.out.println("Found by ID: " + found);

        service.getAll().forEach(System.out::println);

        HibernateUtil.shutdown();
    }
}