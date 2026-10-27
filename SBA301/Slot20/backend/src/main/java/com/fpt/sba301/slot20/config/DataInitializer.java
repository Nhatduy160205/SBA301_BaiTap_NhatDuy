package com.fpt.sba301.slot20.config;

import com.fpt.sba301.slot20.entity.Orchid;
import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.repository.IOrchidCategoryRepository;
import com.fpt.sba301.slot20.repository.IOrchidRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final IOrchidCategoryRepository categoryRepository;
    private final IOrchidRepository orchidRepository;

    public DataInitializer(IOrchidCategoryRepository categoryRepository,
                           IOrchidRepository orchidRepository) {
        this.categoryRepository = categoryRepository;
        this.orchidRepository = orchidRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            OrchidCategory cat1 = categoryRepository.save(new OrchidCategory(null, "Cattleya"));
            OrchidCategory cat2 = categoryRepository.save(new OrchidCategory(null, "Dendrobium"));
            categoryRepository.save(new OrchidCategory(null, "Phalaenopsis"));
            categoryRepository.save(new OrchidCategory(null, "Oncidium"));
            categoryRepository.save(new OrchidCategory(null, "Vanda"));

            if (orchidRepository.count() == 0) {
                Orchid o1 = new Orchid(null, "Cattleya Labiata Queen", true, true,
                        "Queen of orchids with fragrant purple-magenta bloom",
                        "https://images.unsplash.com/photo-1566999573210-9ecb5bc7f4ff?w=600&auto=format&fit=crop&q=80",
                        cat1);
                Orchid o2 = new Orchid(null, "Dendrobium Nobile Pearl", true, false,
                        "Hardy epiphyte with cascading white and violet petals",
                        "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80",
                        cat2);
                orchidRepository.save(o1);
                orchidRepository.save(o2);
            }
        }
    }
}
