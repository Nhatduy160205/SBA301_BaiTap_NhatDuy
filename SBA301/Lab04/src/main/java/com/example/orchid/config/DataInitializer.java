package com.example.orchid.config;

import com.example.orchid.pojos.Orchid;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.IOrchidCategoryRepository;
import com.example.orchid.repositories.IOrchidRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final IOrchidCategoryRepository categoryRepository;
    private final IOrchidRepository orchidRepository;

    public DataInitializer(IOrchidCategoryRepository categoryRepository, IOrchidRepository orchidRepository) {
        this.categoryRepository = categoryRepository;
        this.orchidRepository = orchidRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding orchid categories according to instructor specifications...");
            // ID 1: Cattleya, ID 2: Dendrobium
            OrchidCategory cattleya = categoryRepository.save(new OrchidCategory("Cattleya"));
            OrchidCategory dendrobium = categoryRepository.save(new OrchidCategory("Dendrobium"));
            OrchidCategory phalaenopsis = categoryRepository.save(new OrchidCategory("Phalaenopsis"));
            OrchidCategory oncidium = categoryRepository.save(new OrchidCategory("Oncidium"));
            OrchidCategory vanda = categoryRepository.save(new OrchidCategory("Vanda"));

            if (orchidRepository.count() == 0) {
                log.info("Seeding initial orchids...");
                orchidRepository.saveAll(List.of(
                        new Orchid(null, "Ceasar 4N", true, "Dendrobium nổi bật với màu tím và form hoa cân đối.", dendrobium, true, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Mini Yaya", true, "Giống mini nhỏ gọn, phù hợp không gian trưng bày.", dendrobium, true, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Crystallinum", true, "Hoa sáng màu, cánh thanh và có tính trang trí cao.", dendrobium, true, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Damari", false, "Giống lai dễ quan sát đặc điểm hình thái.", dendrobium, false, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Taichung Beauty", true, "Cattleya có hoa lớn, màu sắc nổi bật.", cattleya, true, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Snow White", false, "Phalaenopsis trắng, phù hợp minh họa category khác.", phalaenopsis, false, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Golden Shower", false, "Chùm hoa vàng nhỏ, tạo khác biệt khi lọc category.", oncidium, false, "/images/orchid-placeholder.svg"),
                        new Orchid(null, "Blue Vanda", true, "Vanda màu xanh tím, dùng để kiểm tra filter và detail.", vanda, true, "/images/orchid-placeholder.svg")
                ));
            }
            log.info("Data seeding completed.");
        }
    }
}
