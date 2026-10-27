package fu.edu.sba301.slot28.repository;

import fu.edu.sba301.slot28.dao.BookDAO;
import fu.edu.sba301.slot28.entity.Book;

import java.util.List;
import java.util.Optional;

public class BookRepository implements IBookRepository {

    private final BookDAO dao;

    public BookRepository(BookDAO dao) {
        this.dao = dao;
    }

    @Override
    public Book save(Book book) { return dao.save(book); }

    @Override
    public Optional<Book> findById(Long id) { return dao.findById(id); }

    @Override
    public Optional<Book> findByIsbn(String isbn) { return dao.findByIsbn(isbn); }

    @Override
    public List<Book> findAll() { return dao.findAll(); }
}