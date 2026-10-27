package com.fpt.sba301.slot13.repository;

import com.fpt.sba301.slot13.model.News;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NewsRepository {
    private final Map<Long, News> database = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public NewsRepository() {
        save(new News(null, "Spring Boot 3 REST Best Practices", "Exploring 3-layer architecture and unified exception handling.", "Prof. Phuc", "Education"));
        save(new News(null, "React 18 Concurrent Rendering", "How React 18 transitions and batching optimize client rendering.", "Dan A.", "Frontend"));
        save(new News(null, "Campus Hackathon 2026", "Join 300+ students in developing high-impact full-stack solutions.", "Campus Board", "Events"));
    }

    public List<News> findAll() {
        return new ArrayList<>(database.values());
    }

    public Optional<News> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    public News save(News news) {
        if (news.getId() == null) {
            news.setId(idCounter.incrementAndGet());
        }
        database.put(news.getId(), news);
        return news;
    }

    public boolean deleteById(Long id) {
        return database.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return database.containsKey(id);
    }
}
