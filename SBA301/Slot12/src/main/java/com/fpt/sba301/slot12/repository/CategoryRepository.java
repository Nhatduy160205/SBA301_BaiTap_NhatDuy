package com.fpt.sba301.slot12.repository;

import com.fpt.sba301.slot12.model.Category;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class CategoryRepository {
    private final Map<Long, Category> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public CategoryRepository() {
        save(new Category(null, "Technology", "Software Engineering, AI, Cloud"));
        save(new Category(null, "Academic", "Courses, Curricula, Research Grants"));
        save(new Category(null, "Campus Life", "Student Events, Sports, Clubs"));
    }

    public List<Category> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<Category> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Category save(Category category) {
        if (category.getId() == null) {
            category.setId(idGenerator.incrementAndGet());
        }
        store.put(category.getId(), category);
        return category;
    }

    public boolean deleteById(Long id) {
        return store.remove(id) != null;
    }
}
