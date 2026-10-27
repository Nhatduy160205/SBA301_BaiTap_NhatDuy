package fu.edu.sba301.slot28;

import fu.edu.sba301.slot28.dao.BookDAO;
import fu.edu.sba301.slot28.dao.StudentDAO;
import fu.edu.sba301.slot28.entity.Book;
import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.repository.BookRepository;
import fu.edu.sba301.slot28.repository.StudentRepository;
import fu.edu.sba301.slot28.service.IStudentService;
import fu.edu.sba301.slot28.service.StudentService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Slot28HibernateTests {

    private SessionFactory sessionFactory;
    private StudentDAO studentDAO;
    private BookDAO bookDAO;
    private IStudentService studentService;

    @BeforeAll
    void init() {
        Configuration cfg = new Configuration();
        cfg.configure("hibernate-test.cfg.xml");
        sessionFactory = cfg.buildSessionFactory();
        studentDAO = new StudentDAO(sessionFactory);
        bookDAO = new BookDAO(sessionFactory);
        studentService = new StudentService(new StudentRepository(studentDAO), new BookRepository(bookDAO));
    }

    @AfterAll
    void cleanup() {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
    }

    @Test
    @Order(1)
    void t01_persistStudent_createsRowAndGeneratesId() {
        Student s = new Student("student1@fu.edu.vn", "John", "Doe", 8.5);
        Student created = studentService.createStudent(s);
        assertNotNull(created.getId());
        assertEquals("student1@fu.edu.vn", created.getEmail());
    }

    @Test
    @Order(2)
    void t02_duplicateEmail_throwsIllegalStateException() {
        Student s = new Student("student1@fu.edu.vn", "Duplicate", "Person", 7.0);
        assertThrows(IllegalStateException.class, () -> studentService.createStudent(s));
    }

    @Test
    @Order(3)
    void t03_firstLevelCache_resolvesSameInstanceInSameSession() {
        try (Session session = sessionFactory.openSession()) {
            Student s1 = session.get(Student.class, 1L);
            Student s2 = session.get(Student.class, 1L);
            assertSame(s1, s2, "First-level cache returns same reference");
        }
    }

    @Test
    @Order(4)
    void t04_dirtyChecking_updatesEntityOnCommit() {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Student s = session.get(Student.class, 1L);
            s.setMarks(9.5);
            tx.commit();
        }

        try (Session session = sessionFactory.openSession()) {
            Student reloaded = session.get(Student.class, 1L);
            assertEquals(9.5, reloaded.getMarks());
        }
    }

    @Test
    @Order(5)
    void t05_detachedMerge_updatesState() {
        Student detached = studentDAO.findById(1L).orElseThrow();
        detached.setMarks(10.0);
        Student managed = studentDAO.update(detached);
        assertEquals(10.0, managed.getMarks());
    }

    @Test
    @Order(6)
    void t06_assignBook_createsManyToManyJoin() {
        Book b1 = new Book("ISBN-001", "Hibernate In Action", "Christian Bauer");
        bookDAO.save(b1);

        studentService.assignBookToStudent(1L, b1.getId());

        Student s = studentService.getStudentById(1L);
        assertEquals(1, s.getBooks().size());
        assertTrue(s.getBooks().stream().anyMatch(b -> b.getIsbn().equals("ISBN-001")));
    }

    @Test
    @Order(7)
    void t07_duplicateBookAssignment_throwsException() {
        Book b = bookDAO.findByIsbn("ISBN-001").orElseThrow();
        assertThrows(IllegalStateException.class, () -> studentService.assignBookToStudent(1L, b.getId()));
    }

    @Test
    @Order(8)
    void t08_pagingQuery_returnsBoundedResults() {
        for (int i = 2; i <= 6; i++) {
            studentService.createStudent(new Student("stu" + i + "@fu.edu.vn", "F" + i, "L" + i, 7.5));
        }
        List<Student> page1 = studentService.getStudentsPaged(0, 3);
        assertEquals(3, page1.size());
    }

    @Test
    @Order(9)
    void t09_transactionRollback_noPartialCommit() {
        assertThrows(Exception.class, () -> {
            try (Session session = sessionFactory.openSession()) {
                Transaction tx = session.beginTransaction();
                try {
                    Student s = new Student("fail@fu.edu.vn", "Fail", "User", 5.0);
                    session.persist(s);
                    // trigger failure
                    if (true) throw new RuntimeException("Simulated error");
                    tx.commit();
                } catch (Exception e) {
                    tx.rollback();
                    throw e;
                }
            }
        });

        Optional<Student> notFound = studentDAO.findByEmail("fail@fu.edu.vn");
        assertTrue(notFound.isEmpty(), "Rolled back entity must not be persisted in database");
    }
}