package com.fpt.sba301.slot14.repository;

import com.fpt.sba301.slot14.dto.NewsDTO;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NewsRepository {
    private final Map<Long, NewsDTO> storage = new ConcurrentHashMap<>();
    private final AtomicLong idSeq = new AtomicLong(0);

    public NewsRepository() {
        save(new NewsDTO(null, "Documenting REST APIs with SpringDoc OpenAPI", "Interactive API discovery using Swagger UI.", "Prof. Phuc", "Development", LocalDateTime.now()));
        save(new NewsDTO(null, "Spring Boot 3 Web Layer Best Practices", "Building production-grade REST microservices.", "Editorial Team", "Architecture", LocalDateTime.now()));
        save(new NewsDTO(null, "University Tech Symposium Scheduled", "Annual conference showcasing undergraduate research.", "Campus Guild", "Events", LocalDateTime.now()));
    }

    public List<NewsDTO> findAll() {
        return new ArrayList<>(storage.values());
    }

    public Optional<NewsDTO> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    public NewsDTO save(NewsDTO news) {
        if (news.getId() == null) {
            news.setId(idSeq.incrementAndGet());
        }
        storage.put(news.getId(), news);
        return news;
    }

    public boolean deleteById(Long id) {
        return storage.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return storage.containsKey(id);
    }
}
