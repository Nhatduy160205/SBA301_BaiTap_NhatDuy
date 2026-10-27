package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.dao.BookDAO;
import fu.edu.sba301.slot29.entity.Book;

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

    @Override
    public boolean delete(Long id) { return dao.delete(id); }
}