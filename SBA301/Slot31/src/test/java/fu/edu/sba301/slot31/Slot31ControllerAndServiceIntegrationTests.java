package fu.edu.sba301.slot31;

import fu.edu.sba301.slot31.dao.StudentDAO;
import fu.edu.sba301.slot31.entity.Student;
import fu.edu.sba301.slot31.repository.IStudentRepository;
import fu.edu.sba301.slot31.repository.StudentRepository;
import fu.edu.sba301.slot31.service.IStudentService;
import fu.edu.sba301.slot31.service.StudentService;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Slot31ControllerAndServiceIntegrationTests {

    private SessionFactory sessionFactory;
    private StudentDAO studentDAO;
    private IStudentRepository repository;
    private IStudentService studentService;

    @BeforeAll
    void init() {
        Configuration cfg = new Configuration();
        cfg.configure("hibernate-test.cfg.xml");
        sessionFactory = cfg.buildSessionFactory();
        studentDAO = new StudentDAO(sessionFactory);
        repository = new StudentRepository(studentDAO);
        studentService = new StudentService(repository);
    }

    @AfterAll
    void cleanup() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }

    @Test
    @Order(1)
    void g01_serviceCreatesValidStudent() {
        Student s = new Student("fx.student1@fu.edu.vn", "Alice", "FX", 8.8);
        Student created = studentService.create(s);
        assertNotNull(created.getId());
        assertEquals("fx.student1@fu.edu.vn", created.getEmail());
    }

    @Test
    @Order(2)
    void g02_duplicateEmailRejectedByService() {
        Student duplicate = new Student("fx.student1@fu.edu.vn", "Bob", "Duplicate", 7.5);
        assertThrows(IllegalStateException.class, () -> studentService.create(duplicate));
    }

    @Test
    @Order(3)
    void g03_getAllReturnsListForTableView() {
        List<Student> list = studentService.getAll();
        assertFalse(list.isEmpty());
        assertTrue(list.stream().anyMatch(st -> st.getEmail().equals("fx.student1@fu.edu.vn")));
    }

    @Test
    @Order(4)
    void g04_serviceUpdateModifiesEntity() {
        Student s = studentService.getById(1L);
        s.setMarks(9.5);
        Student updated = studentService.update(s);
        assertEquals(9.5, updated.getMarks());
    }

    @Test
    @Order(5)
    void g05_serviceDeleteRemovesEntity() {
        Student toDelete = studentService.create(new Student("to.delete@fu.edu.vn", "Del", "User", 6.0));
        Long id = toDelete.getId();
        studentService.delete(id);
        assertThrows(IllegalArgumentException.class, () -> studentService.getById(id));
    }

    @Test
    @Order(6)
    void g06_fxmlResourceExistsOnClasspath() {
        assertNotNull(getClass().getResource("/fu/edu/sba301/ui/student-view.fxml"), "student-view.fxml must be packaged in resources");
    }
}