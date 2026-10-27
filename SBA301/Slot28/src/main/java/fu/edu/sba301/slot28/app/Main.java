package fu.edu.sba301.slot28.app;

import fu.edu.sba301.slot28.dao.BookDAO;
import fu.edu.sba301.slot28.dao.StudentDAO;
import fu.edu.sba301.slot28.entity.Book;
import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.repository.BookRepository;
import fu.edu.sba301.slot28.repository.StudentRepository;
import fu.edu.sba301.slot28.service.IStudentService;
import fu.edu.sba301.slot28.service.StudentService;
import fu.edu.sba301.slot28.util.HibernateUtil;
import org.hibernate.SessionFactory;

public class Main {
    public static void main(String[] args) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        StudentDAO studentDAO = new StudentDAO(sf);
        BookDAO bookDAO = new BookDAO(sf);
        StudentRepository studentRepo = new StudentRepository(studentDAO);
        BookRepository bookRepo = new BookRepository(bookDAO);
        IStudentService studentService = new StudentService(studentRepo, bookRepo);

        System.out.println("=== Demo Slot 28 Hibernate Persistence ===");
        Student s = new Student("alice.slot28@fu.edu.vn", "Alice", "Nguyen", 9.2);
        Student created = studentService.createStudent(s);
        System.out.println("Created Student: " + created);

        Book b = new Book("978-0134685991", "Effective Java", "Joshua Bloch");
        bookDAO.save(b);
        System.out.println("Saved Book: " + b);

        studentService.assignBookToStudent(created.getId(), b.getId());
        System.out.println("Assigned Book to Student!");

        Student retrieved = studentService.getStudentById(created.getId());
        System.out.println("Retrieved Student with Books: " + retrieved.getBooks());

        HibernateUtil.shutdown();
    }
}