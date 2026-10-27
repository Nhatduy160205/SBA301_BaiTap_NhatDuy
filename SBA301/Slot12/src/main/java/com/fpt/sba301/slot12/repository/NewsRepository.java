package com.fpt.sba301.slot12.repository;

import com.fpt.sba301.slot12.model.News;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NewsRepository {
    private final Map<Long, News> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public NewsRepository() {
        // Seed initial records for testing
        save(new News(null, "Welcome to SBA301 Spring Boot", "Fundamentals of REST APIs and 3-layer architecture.", "Prof. Phuc", 1L));
        save(new News(null, "Modern Web Development with React and Java", "Building cohesive full-stack enterprise systems.", "Editorial Team", 1L));
        save(new News(null, "Campus Research Grants Announced", "Grant proposals for undergraduate AI research are now open.", "Academic Affairs", 2L));
    }

    public List<News> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<News> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public News save(News news) {
        if (news.getId() == null) {
            news.setId(idGenerator.incrementAndGet());
        }
        store.put(news.getId(), news);
        return news;
    }

    public boolean deleteById(Long id) {
        return store.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return store.containsKey(id);
    }
}
