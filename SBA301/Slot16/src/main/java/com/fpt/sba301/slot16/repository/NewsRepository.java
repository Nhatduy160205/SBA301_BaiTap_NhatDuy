package com.fpt.sba301.slot16.repository;

import com.fpt.sba301.slot16.model.News;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NewsRepository {
    private final Map<Long, News> store = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(0);

    public NewsRepository() {
        save(new News(null, "MockMvc Testing Guide", "Testing controllers with WebMvcTest and MockMvc.", "Prof. Phuc", "Testing"));
        save(new News(null, "Mockito Unit Testing Essentials", "Mocking dependencies to isolate business units.", "John Doe", "Testing"));
    }

    public List<News> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<News> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public News save(News news) {
        if (news.getId() == null) {
            news.setId(idGen.incrementAndGet());
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
