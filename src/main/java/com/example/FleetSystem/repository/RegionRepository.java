package com.example.FleetSystem.repository;
import com.example.FleetSystem.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region,Long> {
    @Query("SELECT r FROM Region r WHERE r.status = true")
    List<Region> getActiveRegions();

    Optional<Region> findByNameAndStatusIsTrue(String name);

    List<Region> findByCountryAndStatusIsTrue(String country);

    Optional<Region> findByNameIgnoreCaseAndStatusIsTrue(String name);
}
