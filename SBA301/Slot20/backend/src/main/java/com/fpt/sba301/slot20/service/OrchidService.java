package com.fpt.sba301.slot20.service;

import com.fpt.sba301.slot20.entity.Orchid;
import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.exception.ResourceNotFoundException;
import com.fpt.sba301.slot20.repository.IOrchidCategoryRepository;
import com.fpt.sba301.slot20.repository.IOrchidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrchidService implements IOrchidService {

    private final IOrchidRepository orchidRepository;
    private final IOrchidCategoryRepository categoryRepository;

    public OrchidService(IOrchidRepository orchidRepository,
                         IOrchidCategoryRepository categoryRepository) {
        this.orchidRepository = orchidRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Orchid> getAllOrchids(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return orchidRepository.findByOrchidNameContainingIgnoreCase(keyword.trim());
        }
        return orchidRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Orchid getOrchidById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Orchid ID cannot be null");
        }
        return orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with id: " + id));
    }

    @Override
    public Orchid createOrchid(Orchid orchid) {
        validateOrchid(orchid);
        OrchidCategory category = resolveCategory(orchid.getOrchidCategory());
        orchid.setOrchidCategory(category);
        orchid.setOrchidID(null);
        return orchidRepository.save(orchid);
    }

    @Override
    public Orchid updateOrchid(Long id, Orchid orchidDetails) {
        if (id == null) {
            throw new IllegalArgumentException("Orchid ID cannot be null");
        }
        Orchid existing = orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with id: " + id));

        validateOrchid(orchidDetails);
        OrchidCategory category = resolveCategory(orchidDetails.getOrchidCategory());

        existing.setOrchidName(orchidDetails.getOrchidName().trim());
        existing.setIsNatural(orchidDetails.getIsNatural());
        existing.setIsAttractive(orchidDetails.getIsAttractive());
        existing.setOrchidDescription(orchidDetails.getOrchidDescription());
        existing.setOrchidURL(orchidDetails.getOrchidURL());
        existing.setOrchidCategory(category);

        return orchidRepository.save(existing);
    }

    @Override
    public void deleteOrchid(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Orchid ID cannot be null");
        }
        if (!orchidRepository.existsById(id)) {
            throw new ResourceNotFoundException("Orchid not found with id: " + id);
        }
        orchidRepository.deleteById(id);
    }

    private void validateOrchid(Orchid orchid) {
        if (orchid == null) {
            throw new IllegalArgumentException("Orchid payload cannot be null");
        }
        if (orchid.getOrchidName() == null || orchid.getOrchidName().trim().isEmpty()) {
            throw new IllegalArgumentException("orchidName is required and cannot be blank");
        }
        if (orchid.getOrchidCategory() == null || orchid.getOrchidCategory().getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId is required");
        }
    }

    private OrchidCategory resolveCategory(OrchidCategory ref) {
        Long catId = ref.getCategoryId();
        return categoryRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + catId));
    }
}
