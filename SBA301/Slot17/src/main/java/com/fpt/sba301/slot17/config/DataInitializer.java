package com.fpt.sba301.slot17.config;

import com.fpt.sba301.slot17.entity.Category;
import com.fpt.sba301.slot17.entity.News;
import com.fpt.sba301.slot17.entity.Tag;
import com.fpt.sba301.slot17.repository.CategoryRepository;
import com.fpt.sba301.slot17.repository.NewsRepository;
import com.fpt.sba301.slot17.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final NewsRepository newsRepository;
    private final TagRepository tagRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           NewsRepository newsRepository,
                           TagRepository tagRepository) {
        this.categoryRepository = categoryRepository;
        this.newsRepository = newsRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial Categories for Slot 17...");
            Category tech = categoryRepository.save(new Category("Technology", "All tech innovations"));
            Category edu = categoryRepository.save(new Category("Education", "Academic and training news"));
            Category biz = categoryRepository.save(new Category("Business", "Corporate and market insights"));

            log.info("Seeding initial Tags for Slot 17...");
            Tag tagJava = tagRepository.save(new Tag("Java"));
            Tag tagSpring = tagRepository.save(new Tag("Spring Boot"));
            Tag tagJpa = tagRepository.save(new Tag("JPA"));

            log.info("Seeding initial News articles for Slot 17...");
            News news1 = new News("Spring Boot 3.3 Released", "Features and enhancements in Spring Boot 3.3", tech);
            news1.setTags(Set.of(tagJava, tagSpring));
            newsRepository.save(news1);

            News news2 = new News("JPA Entity Relationships Deep Dive", "Complete guide to One-to-Many and Many-to-Many in JPA", edu);
            news2.setTags(Set.of(tagSpring, tagJpa));
            newsRepository.save(news2);

            News news3 = new News("AI in Modern Business Strategy", "How enterprise businesses adapt to AI technologies", biz);
            news3.setTags(Set.of(tagJava));
            newsRepository.save(news3);

            log.info("Slot 17 Data seeding completed successfully.");
        }
    }
}
