package com.fpt.sba301.slot17.service;

import com.fpt.sba301.slot17.dto.CategoryDTO;
import com.fpt.sba301.slot17.dto.NewsCreateDTO;
import com.fpt.sba301.slot17.dto.NewsDTO;
import com.fpt.sba301.slot17.dto.TagDTO;
import com.fpt.sba301.slot17.entity.Category;
import com.fpt.sba301.slot17.entity.News;
import com.fpt.sba301.slot17.entity.Tag;
import com.fpt.sba301.slot17.exception.ResourceNotFoundException;
import com.fpt.sba301.slot17.repository.CategoryRepository;
import com.fpt.sba301.slot17.repository.NewsRepository;
import com.fpt.sba301.slot17.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class NewsService {

    private final NewsRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public NewsService(NewsRepository newsRepository,
                       CategoryRepository categoryRepository,
                       TagRepository tagRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public List<NewsDTO> getAllNews() {
        return newsRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public NewsDTO getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with ID: " + id));
        return toDTO(news);
    }

    public List<NewsDTO> searchByTitle(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllNews();
        }
        return newsRepository.findByTitleContainingIgnoreCase(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NewsDTO> getNewsByCategory(Long categoryId) {
        return newsRepository.findByCategory_Id(categoryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public NewsDTO createNews(NewsCreateDTO createDTO) {
        if (createDTO.getTitle() == null || createDTO.getTitle().isBlank()) {
            throw new IllegalArgumentException("News title is required and cannot be blank");
        }
        if (createDTO.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId is required");
        }

        // Business Rule: Category must exist and must be active
        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + createDTO.getCategoryId()));

        if (!category.isActive()) {
            throw new IllegalArgumentException("Cannot create news in an inactive category: " + category.getName());
        }

        News news = new News(createDTO.getTitle().trim(), createDTO.getContent(), category);

        // Resolve and link tags
        if (createDTO.getTagNames() != null) {
            Set<Tag> tags = resolveTags(createDTO.getTagNames());
            news.setTags(tags);
        }

        News saved = newsRepository.save(news);
        return toDTO(saved);
    }

    @Transactional
    public NewsDTO updateNews(Long id, NewsCreateDTO updateDTO) {
        News existing = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with ID: " + id));

        if (updateDTO.getTitle() == null || updateDTO.getTitle().isBlank()) {
            throw new IllegalArgumentException("News title is required and cannot be blank");
        }

        Category category = categoryRepository.findById(updateDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + updateDTO.getCategoryId()));

        existing.setTitle(updateDTO.getTitle().trim());
        existing.setContent(updateDTO.getContent());
        existing.setCategory(category);

        if (updateDTO.getTagNames() != null) {
            Set<Tag> tags = resolveTags(updateDTO.getTagNames());
            existing.setTags(tags);
        }

        return toDTO(newsRepository.save(existing));
    }

    @Transactional
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News not found with ID: " + id);
        }
        newsRepository.deleteById(id);
    }

    private Set<Tag> resolveTags(List<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            if (tagName != null && !tagName.isBlank()) {
                String normalized = tagName.trim();
                Tag tag = tagRepository.findByNameIgnoreCase(normalized)
                        .orElseGet(() -> tagRepository.save(new Tag(normalized)));
                tags.add(tag);
            }
        }
        return tags;
    }

    public NewsDTO toDTO(News news) {
        CategoryDTO catDTO = new CategoryDTO(
                news.getCategory().getId(),
                news.getCategory().getName(),
                news.getCategory().getDescription(),
                news.getCategory().isActive()
        );

        List<TagDTO> tagDTOs = news.getTags().stream()
                .map(t -> new TagDTO(t.getId(), t.getName()))
                .collect(Collectors.toList());

        return new NewsDTO(news.getId(), news.getTitle(), news.getContent(), catDTO, tagDTOs);
    }
}
