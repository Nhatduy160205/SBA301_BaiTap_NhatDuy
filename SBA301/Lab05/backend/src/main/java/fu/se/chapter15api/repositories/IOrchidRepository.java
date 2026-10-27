package fu.se.chapter15api.repositories;

import fu.se.chapter15api.pojos.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository layer purely extends Spring Data JpaRepository.
 * No business logic is processed here (strictly adhering to 3-Layer MVC Service pattern).
 */
@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Integer> {
}
