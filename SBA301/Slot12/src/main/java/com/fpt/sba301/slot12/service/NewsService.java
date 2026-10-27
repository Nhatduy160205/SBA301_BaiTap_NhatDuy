package com.fpt.sba301.slot12.service;

import com.fpt.sba301.slot12.model.News;
import com.fpt.sba301.slot12.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NewsService {
    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<News> getAllNews(String keyword, Long categoryId) {
        List<News> list = newsRepository.findAll();

        if (categoryId != null) {
            list = list.stream()
                    .filter(n -> categoryId.equals(n.getCategoryId()))
                    .toList();
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            String q = keyword.trim().toLowerCase();
            list = list.stream()
                    .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(q)) ||
                                 (n.getContent() != null && n.getContent().toLowerCase().contains(q)))
                    .toList();
        }

        return list;
    }

    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("News article with ID #" + id + " not found."));
    }

    public News createNews(News input) {
        // Business logic validations
        if (input.getTitle() == null || input.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("News title cannot be blank.");
        }
        if (input.getContent() == null || input.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("News content cannot be blank.");
        }
        if (input.getAuthor() == null || input.getAuthor().trim().isEmpty()) {
            input.setAuthor("Anonymous Contributor");
        }

        input.setId(null); // Ensure new ID generation
        return newsRepository.save(input);
    }

    public News updateNews(Long id, News input) {
        News existing = getNewsById(id);

        if (input.getTitle() != null && !input.getTitle().trim().isEmpty()) {
            existing.setTitle(input.getTitle().trim());
        }
        if (input.getContent() != null && !input.getContent().trim().isEmpty()) {
            existing.setContent(input.getContent().trim());
        }
        if (input.getAuthor() != null && !input.getAuthor().trim().isEmpty()) {
            existing.setAuthor(input.getAuthor().trim());
        }
        if (input.getCategoryId() != null) {
            existing.setCategoryId(input.getCategoryId());
        }
        if (input.getStatus() != null) {
            existing.setStatus(input.getStatus());
        }

        return newsRepository.save(existing);
    }

    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new NoSuchElementException("Cannot delete: News article #" + id + " not found.");
        }
        newsRepository.deleteById(id);
    }
}
