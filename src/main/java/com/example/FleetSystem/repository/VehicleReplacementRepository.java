package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.VehicleReplacement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleReplacementRepository extends JpaRepository<VehicleReplacement,Long> {
}
