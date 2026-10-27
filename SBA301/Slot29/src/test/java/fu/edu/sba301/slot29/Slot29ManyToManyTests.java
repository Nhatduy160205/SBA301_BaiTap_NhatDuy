package fu.edu.sba301.slot29;

import fu.edu.sba301.slot29.dao.BookDAO;
import fu.edu.sba301.slot29.dao.StudentDAO;
import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.repository.BookRepository;
import fu.edu.sba301.slot29.repository.StudentRepository;
import fu.edu.sba301.slot29.service.IStudentService;
import fu.edu.sba301.slot29.service.StudentService;
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
class Slot29ManyToManyTests {

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
    void t01_persistStudentWithTwoBooks_createsTwoJoinRows() {
        Student s = new Student("s29@fu.edu.vn", "Slot", "TwentyNine", 8.0);
        studentService.createStudent(s);

        Book b1 = new Book("978-001", "Hibernate Basics", "FPT");
        Book b2 = new Book("978-002", "ORM Design", "FPT");
        bookDAO.save(b1);
        bookDAO.save(b2);

        studentService.borrowBook(s.getId(), b1.getId());
        studentService.borrowBook(s.getId(), b2.getId());

        Student loaded = studentService.getStudent(s.getId());
        assertEquals(2, loaded.getBooks().size());
    }

    @Test
    @Order(2)
    void t02_addExistingBook_addsJoinRow() {
        Student s2 = studentService.createStudent(new Student("another@fu.edu.vn", "Another", "Student", 9.0));
        Book b1 = bookDAO.findByIsbn("978-001").orElseThrow();

        studentService.borrowBook(s2.getId(), b1.getId());

        Student loaded = studentService.getStudent(s2.getId());
        assertEquals(1, loaded.getBooks().size());
    }

    @Test
    @Order(3)
    void t03_addSameBookTwice_throwsIllegalStateException() {
        Student s = studentDAO.findByEmail("s29@fu.edu.vn").orElseThrow();
        Book b = bookDAO.findByIsbn("978-001").orElseThrow();

        assertThrows(IllegalStateException.class, () -> studentService.borrowBook(s.getId(), b.getId()));
    }

    @Test
    @Order(4)
    void t04_loadWithBooks_collectionAvailableAfterDaoReturn() {
        Student s = studentService.getStudent(1L);
        assertNotNull(s.getBooks());
        assertFalse(s.getBooks().isEmpty());
    }

    @Test
    @Order(5)
    void t05_removeAssociation_deletesJoinRowOnly() {
        Student s = studentDAO.findByEmail("s29@fu.edu.vn").orElseThrow();
        Book b2 = bookDAO.findByIsbn("978-002").orElseThrow();

        studentService.returnBook(s.getId(), b2.getId());

        Student reloaded = studentService.getStudent(s.getId());
        assertEquals(1, reloaded.getBooks().size());

        // Verify book still exists in BOOKS table!
        Optional<Book> bookStillExists = bookDAO.findById(b2.getId());
        assertTrue(bookStillExists.isPresent(), "Book must not be deleted when removed from student");
    }

    @Test
    @Order(6)
    void t06_deleteStudent_booksRemainInDatabase() {
        Student temp = studentService.createStudent(new Student("temp@fu.edu.vn", "Temp", "User", 6.5));
        Book b = bookDAO.findByIsbn("978-001").orElseThrow();
        studentService.borrowBook(temp.getId(), b.getId());

        studentService.deleteStudent(temp.getId());

        assertTrue(studentDAO.findById(temp.getId()).isEmpty());
        assertTrue(bookDAO.findById(b.getId()).isPresent(), "Shared books must remain when student is deleted");
    }

    @Test
    @Order(7)
    void t07_findStudentsByBook_returnsCorrectStudents() {
        Book b1 = bookDAO.findByIsbn("978-001").orElseThrow();
        List<Student> students = studentService.getStudentsByBook(b1.getId());
        assertFalse(students.isEmpty());
        assertTrue(students.stream().anyMatch(s -> s.getEmail().equals("s29@fu.edu.vn")));
    }

    @Test
    @Order(8)
    void t08_returnNonAssociatedBook_throwsIllegalStateException() {
        Student s = studentDAO.findByEmail("s29@fu.edu.vn").orElseThrow();
        Book b2 = bookDAO.findByIsbn("978-002").orElseThrow(); // was returned earlier

        assertThrows(IllegalStateException.class, () -> studentService.returnBook(s.getId(), b2.getId()));
    }

    @Test
    @Order(9)
    void t09_transactionRollback_maintainsAtomicity() {
        assertThrows(Exception.class, () -> {
            try (Session session = sessionFactory.openSession()) {
                Transaction tx = session.beginTransaction();
                try {
                    Student failStudent = new Student("fail.tx@fu.edu.vn", "Fail", "Tx", 5.0);
                    session.persist(failStudent);
                    if (true) throw new RuntimeException("Forced rollback");
                    tx.commit();
                } catch (Exception e) {
                    tx.rollback();
                    throw e;
                }
            }
        });

        assertTrue(studentDAO.findByEmail("fail.tx@fu.edu.vn").isEmpty());
    }
}