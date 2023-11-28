package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleAssignmentRepository extends JpaRepository<VehicleAssignment, Long>, JpaSpecificationExecutor<VehicleAssignment> {
//    @Query("SELECT v FROM VehicleAssignment v WHERE v.status = true")
//    List<VehicleAssignment> getActiveVehicleAssignment();

    Optional<VehicleAssignment> findByVehicle(Vehicle vehicle);

    @Query
    Optional<VehicleAssignment> findHistoryByVehicle(Vehicle vehicle);
}
