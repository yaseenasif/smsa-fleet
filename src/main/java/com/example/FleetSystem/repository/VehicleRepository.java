package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("SELECT v FROM Vehicle v WHERE v.status = true")
    List<Vehicle> getActiveVehicles();

    Optional<Vehicle> findByPlateNumber(String plateNumber);
}
