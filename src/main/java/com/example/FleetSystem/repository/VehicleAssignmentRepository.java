package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleAssignmentRepository extends JpaRepository<VehicleAssignment, Long> {
    @Query("SELECT v FROM VehicleAssignment v WHERE v.status = true")
    List<VehicleAssignment> getActiveVehicleAssignment();

    Optional<VehicleAssignment> findByPlateNumber(String plateNumber);
}