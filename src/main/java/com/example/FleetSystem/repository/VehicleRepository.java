package com.example.FleetSystem.repository;

import com.example.FleetSystem.dto.VehicleCountPerVendorDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
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


    @Query("select v from VehicleAssignment va\n" +
            "right outer join Vehicle v\n" +
            "on va.vehicle = v.id\n" +
            "WHERE va.vehicle IS NULL AND v.status = true")
    List<Vehicle> getNotAssignedVehicle();

    @Query("SELECT COUNT(v) AS total_vehicles FROM Vehicle v WHERE v.status = true")
    Long getActiveVehicleCount();

    @Query("SELECT v.vendor.id, COUNT(v) AS total_vehicles FROM Vehicle v GROUP BY v.vendor.id")
    List<Object[]> getActiveVehiclePerVendor();
}
