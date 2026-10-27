package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.entity.Book;
import java.util.List;
import java.util.Optional;

public interface IBookRepository {
    Book save(Book book);
    Optional<Book> findById(Long id);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findAll();
    boolean delete(Long id);
}