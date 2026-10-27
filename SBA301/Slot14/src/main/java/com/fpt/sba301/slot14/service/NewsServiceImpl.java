package com.fpt.sba301.slot14.service;

import com.fpt.sba301.slot14.dto.NewsCreateDTO;
import com.fpt.sba301.slot14.dto.NewsDTO;
import com.fpt.sba301.slot14.exception.NewsNotFoundException;
import com.fpt.sba301.slot14.exception.ValidationException;
import com.fpt.sba301.slot14.repository.NewsRepository;
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
    public List<NewsDTO> getAllNews(String search, String category) {
        List<NewsDTO> list = repository.findAll();

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

        return list;
    }

    @Override
    public NewsDTO getNewsById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException("News article with ID #" + id + " was not found."));
    }

    @Override
    public NewsDTO createNews(NewsCreateDTO dto) {
        // Business logic validation: verify unique title
        boolean exists = repository.findAll().stream()
                .anyMatch(n -> n.getTitle().equalsIgnoreCase(dto.getTitle().trim()));
        if (exists) {
            throw new ValidationException("An article with title '" + dto.getTitle() + "' already exists.");
        }

        NewsDTO entity = new NewsDTO(
                null,
                dto.getTitle().trim(),
                dto.getContent().trim(),
                dto.getAuthor().trim(),
                dto.getCategory().trim(),
                LocalDateTime.now()
        );

        return repository.save(entity);
    }

    @Override
    public NewsDTO updateNews(Long id, NewsCreateDTO dto) {
        NewsDTO existing = getNewsById(id);

        boolean duplicate = repository.findAll().stream()
                .anyMatch(n -> !n.getId().equals(id) && n.getTitle().equalsIgnoreCase(dto.getTitle().trim()));
        if (duplicate) {
            throw new ValidationException("Another article already exists with title '" + dto.getTitle() + "'.");
        }

        existing.setTitle(dto.getTitle().trim());
        existing.setContent(dto.getContent().trim());
        existing.setAuthor(dto.getAuthor().trim());
        existing.setCategory(dto.getCategory().trim());

        return repository.save(existing);
    }

    @Override
    public void deleteNews(Long id) {
        if (!repository.existsById(id)) {
            throw new NewsNotFoundException("Cannot delete: News article #" + id + " not found.");
        }
        repository.deleteById(id);
    }
}
