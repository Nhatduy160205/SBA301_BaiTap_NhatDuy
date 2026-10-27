package fu.edu.sba301.slot28.repository;

import fu.edu.sba301.slot28.entity.Book;
import java.util.List;
import java.util.Optional;

public interface IBookRepository {
    Book save(Book book);
    Optional<Book> findById(Long id);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findAll();
}