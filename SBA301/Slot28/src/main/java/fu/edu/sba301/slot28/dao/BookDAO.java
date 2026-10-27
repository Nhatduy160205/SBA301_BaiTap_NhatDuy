package fu.edu.sba301.slot28.dao;

import fu.edu.sba301.slot28.entity.Book;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import java.util.List;
import java.util.Optional;

public class BookDAO {

    private final SessionFactory sessionFactory;

    public BookDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Book save(Book book) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            try {
                session.persist(book);
                tx.commit();
                return book;
            } catch (RuntimeException ex) {
                if (tx.isActive()) tx.rollback();
                throw ex;
            }
        }
    }

    public Optional<Book> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("select distinct b from Book b left join fetch b.students where b.id = :id", Book.class)
                    .setParameter("id", id)
                    .uniqueResultOptional();
        }
    }

    public Optional<Book> findByIsbn(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book b where b.isbn = :isbn", Book.class)
                    .setParameter("isbn", isbn)
                    .uniqueResultOptional();
        }
    }

    public List<Book> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book b order by b.id", Book.class).getResultList();
        }
    }
}