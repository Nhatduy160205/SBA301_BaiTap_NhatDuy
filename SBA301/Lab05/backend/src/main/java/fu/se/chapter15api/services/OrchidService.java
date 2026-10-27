package fu.se.chapter15api.services;

import fu.se.chapter15api.pojos.Orchid;
import fu.se.chapter15api.repositories.IOrchidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer: Xử lý TOÀN BỘ logic nghiệp vụ, validation và dirty checking
 * theo chuẩn mô hình 3 lớp MVC Service Layer.
 */
@Service
@Transactional
public class OrchidService implements IOrchidService {

    private final IOrchidRepository repository;

    public OrchidService(IOrchidRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Orchid> getAllOrchids() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Orchid> getOrchidByID(int orchidID) {
        return repository.findById(orchidID);
    }

    @Override
    public Orchid insertOrchid(Orchid orchid) {
        validateOrchid(orchid);
        orchid.setOrchidId(null);
        return repository.save(orchid);
    }

    @Override
    public Orchid updateOrchid(int orchidID, Orchid input) {
        validateOrchid(input);
        Orchid current = repository.findById(orchidID)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + orchidID));

        current.setOrchidName(input.getOrchidName().trim());
        current.setNatural(input.isNatural());
        current.setOrchidDescription(input.getOrchidDescription());
        current.setOrchidCategory(input.getOrchidCategory());
        current.setAttractive(input.isAttractive());
        current.setOrchidURL(input.getOrchidURL());

        return repository.save(current);
    }

    @Override
    public void deleteOrchid(int orchidID) {
        if (!repository.existsById(orchidID)) {
            throw new IllegalArgumentException("Orchid not found with ID: " + orchidID);
        }
        repository.deleteById(orchidID);
    }

    private void validateOrchid(Orchid orchid) {
        if (orchid == null) {
            throw new IllegalArgumentException("Orchid payload cannot be null");
        }
        if (orchid.getOrchidName() == null || orchid.getOrchidName().trim().isEmpty()) {
            throw new IllegalArgumentException("orchidName is required and cannot be blank");
        }
    }
}
