package fu.edu.sba301.slot29.app;

import fu.edu.sba301.slot29.dao.BookDAO;
import fu.edu.sba301.slot29.dao.StudentDAO;
import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.repository.BookRepository;
import fu.edu.sba301.slot29.repository.IBookRepository;
import fu.edu.sba301.slot29.repository.IStudentRepository;
import fu.edu.sba301.slot29.repository.StudentRepository;
import fu.edu.sba301.slot29.service.IStudentService;
import fu.edu.sba301.slot29.service.StudentService;
import fu.edu.sba301.slot29.util.HibernateUtil;
import org.hibernate.SessionFactory;

public class Main {
    public static void main(String[] args) {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        StudentDAO studentDAO = new StudentDAO(sf);
        BookDAO bookDAO = new BookDAO(sf);
        IStudentRepository studentRepo = new StudentRepository(studentDAO);
        IBookRepository bookRepo = new BookRepository(bookDAO);
        IStudentService service = new StudentService(studentRepo, bookRepo);

        System.out.println("=== Slot 29: Student - Book Many-to-Many Layering ===");
        
        String email = "s29@fu.edu.vn";
        Student s = studentRepo.findByEmail(email).orElseGet(() ->
            service.createStudent(new Student(email, "Slot", "TwentyNine", 8.0))
        );

        Book b1 = bookRepo.findByIsbn("978-001").orElseGet(() ->
            bookRepo.save(new Book("978-001", "Hibernate Basics", "FPT"))
        );
        Book b2 = bookRepo.findByIsbn("978-002").orElseGet(() ->
            bookRepo.save(new Book("978-002", "ORM Design", "FPT"))
        );

        // Ensure clean state before borrowing
        Student current = service.getStudent(s.getId());
        if (current.getBooks().stream().anyMatch(b -> b.getId().equals(b1.getId()))) {
            service.returnBook(s.getId(), b1.getId());
        }
        if (current.getBooks().stream().anyMatch(b -> b.getId().equals(b2.getId()))) {
            service.returnBook(s.getId(), b2.getId());
        }

        service.borrowBook(s.getId(), b1.getId());
        service.borrowBook(s.getId(), b2.getId());

        Student loaded = service.getStudent(s.getId());
        System.out.println("Loaded student with books count: " + loaded.getBooks().size());

        service.returnBook(s.getId(), b1.getId());
        System.out.println("Returned book 1, remaining books: " + service.getStudent(s.getId()).getBooks().size());

        System.out.println("=== Finished Slot 29 Main Demo Successfully! ===");
        HibernateUtil.shutdown();
    }
}
