package com.fpt.sba301.slot16.service;

import com.fpt.sba301.slot16.exception.NewsNotFoundException;
import com.fpt.sba301.slot16.exception.ValidationException;
import com.fpt.sba301.slot16.model.News;
import com.fpt.sba301.slot16.model.NewsRequestDTO;
import com.fpt.sba301.slot16.model.NewsResponseDTO;
import com.fpt.sba301.slot16.repository.NewsRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsServiceTest {

    @Mock
    private NewsRepository repository;

    @InjectMocks
    private NewsServiceImpl newsService;

    @Test
    @DisplayName("Service: getAllNews filters correctly by search keyword")
    void testGetAllNews_SearchFilter() {
        News n1 = new News(1L, "React 18 Concurrent", "Deep dive into fibers", "Dan", "Frontend");
        News n2 = new News(2L, "Spring Boot Microservices", "3-layer CRUD", "Phuc", "Backend");
        when(repository.findAll()).thenReturn(List.of(n1, n2));

        List<NewsResponseDTO> result = newsService.getAllNews("React", null);

        assertEquals(1, result.size());
        assertEquals("React 18 Concurrent", result.get(0).getTitle());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Service: getNewsById returns DTO when entity exists")
    void testGetNewsById_Success() {
        News entity = new News(1L, "Title", "Content", "Author", "Tech");
        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        NewsResponseDTO dto = newsService.getNewsById(1L);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Title", dto.getTitle());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Service: getNewsById throws NewsNotFoundException when ID missing")
    void testGetNewsById_NotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NewsNotFoundException.class, () -> newsService.getNewsById(99L));
        verify(repository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("Service: createNews prevents duplicate titles")
    void testCreateNews_DuplicateTitleThrowsValidationException() {
        News existing = new News(1L, "Existing Headline", "Content", "Author", "Tech");
        when(repository.findAll()).thenReturn(List.of(existing));

        NewsRequestDTO request = new NewsRequestDTO("Existing Headline", "New body", "Author", "Tech");

        assertThrows(ValidationException.class, () -> newsService.createNews(request));
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Service: createNews saves and returns response DTO")
    void testCreateNews_Success() {
        when(repository.findAll()).thenReturn(List.of());
        when(repository.save(any(News.class))).thenAnswer(invocation -> {
            News saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        NewsRequestDTO request = new NewsRequestDTO("Fresh Breakthrough", "Body text", "Scientist", "Science");
        NewsResponseDTO response = newsService.createNews(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Fresh Breakthrough", response.getTitle());
        verify(repository, times(1)).save(any(News.class));
    }

    @Test
    @DisplayName("Service: deleteNews throws when ID not found")
    void testDeleteNews_NotFound() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThrows(NewsNotFoundException.class, () -> newsService.deleteNews(99L));
        verify(repository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Service: deleteNews calls repository when ID exists")
    void testDeleteNews_Success() {
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.deleteById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> newsService.deleteNews(1L));
        verify(repository, times(1)).deleteById(1L);
    }
}
