package com.fpt.sba301.slot15.config;

import com.fpt.sba301.slot15.model.NewsEntity;
import com.fpt.sba301.slot15.repository.NewsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final NewsRepository repository;

    public DataInitializer(NewsRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        List<NewsEntity> sampleList = new ArrayList<>();
        String[] categories = {"Technology", "Academic", "Campus Life", "Career", "Research"};
        String[] authors = {"Prof. Phuc", "Dr. Alan", "Elena Rostova", "Editorial Board", "Student Union"};

        for (int i = 1; i <= 35; i++) {
            String category = categories[i % categories.length];
            String author = authors[i % authors.length];
            boolean active = (i % 7 != 0); // Most active, some inactive for slice test
            int views = i * 15;

            sampleList.add(new NewsEntity(
                    "Article #" + i + " - Innovations in " + category,
                    "Detailed technical exploration and insights regarding modern " + category + " advances and campus impacts.",
                    author,
                    category,
                    active,
                    views
            ));
        }

        repository.saveAll(sampleList);
        System.out.println("Slot 15 DataInitializer: Successfully populated 35 news articles in H2 Database.");
    }
}
