package com.fpt.sba301.slot15.service;

import com.fpt.sba301.slot15.dto.NewsV1DTO;
import com.fpt.sba301.slot15.dto.NewsV2DTO;
import com.fpt.sba301.slot15.model.NewsEntity;
import com.fpt.sba301.slot15.repository.NewsRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class NewsService {
    private static final int MAX_PAGE_SIZE = 50;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "title", "author", "category", "createdAt", "viewCount");

    private final NewsRepository repository;

    public NewsService(NewsRepository repository) {
        this.repository = repository;
    }

    /**
     * Business validation guard for Pageable: clamps page size and checks sort properties
     */
    public Pageable validateAndSanitizePageable(Pageable pageable) {
        int pageSize = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);

        Sort sanitizedSort = Sort.unsorted();
        if (pageable.getSort().isSorted()) {
            for (Sort.Order order : pageable.getSort()) {
                if (ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
                    sanitizedSort = sanitizedSort.and(Sort.by(order.getDirection(), order.getProperty()));
                }
            }
        } else {
            sanitizedSort = Sort.by(Sort.Direction.DESC, "id");
        }

        return PageRequest.of(pageable.getPageNumber(), pageSize, sanitizedSort);
    }

    public Page<NewsV1DTO> getNewsPage(Pageable pageable) {
        Pageable safePageable = validateAndSanitizePageable(pageable);
        return repository.findAll(safePageable).map(NewsV1DTO::fromEntity);
    }

    public Slice<NewsV1DTO> getActiveNewsSlice(Pageable pageable) {
        Pageable safePageable = validateAndSanitizePageable(pageable);
        return repository.findByActiveTrue(safePageable).map(NewsV1DTO::fromEntity);
    }

    public List<NewsV1DTO> getAllV1() {
        return repository.findAll().stream().map(NewsV1DTO::fromEntity).toList();
    }

    public List<NewsV2DTO> getAllV2() {
        return repository.findAll().stream().map(NewsV2DTO::fromEntity).toList();
    }

    public NewsV1DTO getV1ById(Long id) {
        NewsEntity entity = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("News #" + id + " not found"));
        return NewsV1DTO.fromEntity(entity);
    }

    public NewsV2DTO getV2ById(Long id) {
        NewsEntity entity = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("News #" + id + " not found"));
        return NewsV2DTO.fromEntity(entity);
    }
}
