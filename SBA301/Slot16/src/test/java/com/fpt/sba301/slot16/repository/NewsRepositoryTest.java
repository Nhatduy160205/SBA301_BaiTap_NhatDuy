package com.fpt.sba301.slot16.repository;

import com.fpt.sba301.slot16.model.News;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class NewsRepositoryTest {

    private NewsRepository repository;

    @BeforeEach
    void setUp() {
        repository = new NewsRepository();
    }

    @Test
    @DisplayName("Repository: findAll returns initial seeded articles")
    void testFindAll() {
        List<News> list = repository.findAll();
        assertTrue(list.size() >= 2);
    }

    @Test
    @DisplayName("Repository: save assigns auto-increment ID and persists record")
    void testSaveNew() {
        News news = new News(null, "Test Title", "Test Content", "Author", "Tech");
        News saved = repository.save(news);

        assertNotNull(saved.getId());
        assertTrue(saved.getId() > 0);

        Optional<News> fetched = repository.findById(saved.getId());
        assertTrue(fetched.isPresent());
        assertEquals("Test Title", fetched.get().getTitle());
    }

    @Test
    @DisplayName("Repository: deleteById removes existing record")
    void testDelete() {
        News news = new News(null, "Temporary News", "To delete", "Author", "General");
        News saved = repository.save(news);
        Long id = saved.getId();

        assertTrue(repository.existsById(id));
        boolean deleted = repository.deleteById(id);

        assertTrue(deleted);
        assertFalse(repository.existsById(id));
    }
}
