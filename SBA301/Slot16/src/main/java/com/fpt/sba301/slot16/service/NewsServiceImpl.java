package com.fpt.sba301.slot16.service;

import com.fpt.sba301.slot16.exception.NewsNotFoundException;
import com.fpt.sba301.slot16.exception.ValidationException;
import com.fpt.sba301.slot16.model.News;
import com.fpt.sba301.slot16.model.NewsRequestDTO;
import com.fpt.sba301.slot16.model.NewsResponseDTO;
import com.fpt.sba301.slot16.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsServiceImpl implements NewsService {
    private final NewsRepository repository;

    public NewsServiceImpl(NewsRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<NewsResponseDTO> getAllNews(String search, String category) {
        List<News> list = repository.findAll();

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            list = list.stream()
                    .filter(n -> n.getCategory() != null && n.getCategory().equalsIgnoreCase(category.trim()))
                    .toList();
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            list = list.stream()
                    .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(q)) ||
                                 (n.getContent() != null && n.getContent().toLowerCase().contains(q)) ||
                                 (n.getAuthor() != null && n.getAuthor().toLowerCase().contains(q)))
                    .toList();
        }

        return list.stream().map(NewsResponseDTO::fromEntity).toList();
    }

    @Override
    public NewsResponseDTO getNewsById(Long id) {
        News news = repository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException("News article with ID #" + id + " does not exist."));
        return NewsResponseDTO.fromEntity(news);
    }

    @Override
    public NewsResponseDTO createNews(NewsRequestDTO dto) {
        // Business logic validation: duplicate title
        boolean exists = repository.findAll().stream()
                .anyMatch(n -> n.getTitle().equalsIgnoreCase(dto.getTitle().trim()));
        if (exists) {
            throw new ValidationException("An article with title '" + dto.getTitle() + "' already exists.");
        }

        News entity = new News();
        entity.setTitle(dto.getTitle().trim());
        entity.setContent(dto.getContent().trim());
        entity.setAuthor(dto.getAuthor().trim());
        entity.setCategory(dto.getCategory().trim());
        entity.setCreatedAt(LocalDateTime.now());

        News saved = repository.save(entity);
        return NewsResponseDTO.fromEntity(saved);
    }

    @Override
    public NewsResponseDTO updateNews(Long id, NewsRequestDTO dto) {
        News existing = repository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException("Cannot update: News article #" + id + " not found."));

        boolean duplicate = repository.findAll().stream()
                .anyMatch(n -> !n.getId().equals(id) && n.getTitle().equalsIgnoreCase(dto.getTitle().trim()));
        if (duplicate) {
            throw new ValidationException("Another article already exists with title '" + dto.getTitle() + "'.");
        }

        existing.setTitle(dto.getTitle().trim());
        existing.setContent(dto.getContent().trim());
        existing.setAuthor(dto.getAuthor().trim());
        existing.setCategory(dto.getCategory().trim());

        News updated = repository.save(existing);
        return NewsResponseDTO.fromEntity(updated);
    }

    @Override
    public void deleteNews(Long id) {
        if (!repository.existsById(id)) {
            throw new NewsNotFoundException("Cannot delete: News article #" + id + " not found.");
        }
        repository.deleteById(id);
    }
}
