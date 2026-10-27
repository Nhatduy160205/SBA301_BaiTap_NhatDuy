package fu.edu.sba301.slot30;

import fu.edu.sba301.slot30.dao.StudentDAO;
import fu.edu.sba301.slot30.entity.Student;
import fu.edu.sba301.slot30.repository.IStudentRepository;
import fu.edu.sba301.slot30.repository.StudentRepository;
import fu.edu.sba301.slot30.service.IStudentService;
import fu.edu.sba301.slot30.service.StudentService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Slot30CrudApplicationTests {

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
    void c01_createValidStudent_createsRowAndGeneratesId() {
        Student s = new Student("c01@fu.edu.vn", "Valid", "Student", 8.5);
        Student created = studentService.create(s);
        assertNotNull(created.getId());
        assertEquals("c01@fu.edu.vn", created.getEmail());
    }

    @Test
    @Order(2)
    void c02_createDuplicateEmail_rejectedByService() {
        Student duplicate = new Student("c01@fu.edu.vn", "Duplicate", "Person", 7.0);
        assertThrows(IllegalStateException.class, () -> studentService.create(duplicate));
    }

    @Test
    @Order(3)
    void r01_getExistingId_returnsStudent() {
        Student s = studentService.getById(1L);
        assertNotNull(s);
        assertEquals("c01@fu.edu.vn", s.getEmail());
    }

    @Test
    @Order(4)
    void r02_getMissingId_throwsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> studentService.getById(999999L));
    }

    @Test
    @Order(5)
    void r03_listStudents_returnsOrderedList() {
        List<Student> list = studentService.getAll();
        assertFalse(list.isEmpty());
    }

    @Test
    @Order(6)
    void u01_updateValidMarks_updatesRow() {
        Student updated = studentService.updateMarks(1L, 9.2);
        assertEquals(9.2, updated.getMarks());
    }

    @Test
    @Order(7)
    void u02_updateInvalidMarks_rejectedByService() {
        assertThrows(IllegalArgumentException.class, () -> studentService.updateMarks(1L, -1.0));
        assertThrows(IllegalArgumentException.class, () -> studentService.updateMarks(1L, 11.0));
    }

    @Test
    @Order(8)
    void u03_updateMissingId_throwsException() {
        Student missing = new Student(888888L, "missing@fu.edu.vn", "No", "One", 8.0);
        assertThrows(IllegalArgumentException.class, () -> studentService.update(missing));
    }

    @Test
    @Order(9)
    void d01_deleteExisting_removesRow() {
        Student temp = studentService.create(new Student("delete.me@fu.edu.vn", "To", "Delete", 5.0));
        Long tempId = temp.getId();
        studentService.delete(tempId);
        assertThrows(IllegalArgumentException.class, () -> studentService.getById(tempId));
    }

    @Test
    @Order(10)
    void d02_deleteMissing_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> studentService.delete(999999L));
    }

    @Test
    @Order(11)
    void t01_transactionRollback_atomicNoPartialCommit() {
        assertThrows(Exception.class, () -> {
            try (Session session = sessionFactory.openSession()) {
                Transaction tx = session.beginTransaction();
                try {
                    session.persist(new Student("tx.a@fu.edu.vn", "A", "A", 8.0));
                    session.persist(new Student("tx.a@fu.edu.vn", "B", "B", 9.0)); // duplicate
                    tx.commit();
                } catch (Exception ex) {
                    tx.rollback();
                    throw ex;
                }
            }
        });

        assertTrue(studentDAO.findByEmail("tx.a@fu.edu.vn").isEmpty());
    }

    @Test
    @Order(12)
    void l01_pagingQuery_returnsBoundedResults() {
        for (int i = 2; i <= 5; i++) {
            studentService.create(new Student("page" + i + "@fu.edu.vn", "P" + i, "L" + i, 8.0));
        }
        List<Student> paged = studentService.getPaged(0, 2);
        assertEquals(2, paged.size());
    }
}