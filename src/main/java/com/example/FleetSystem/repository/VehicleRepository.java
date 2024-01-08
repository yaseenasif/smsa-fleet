package com.example.FleetSystem.repository;

import com.example.FleetSystem.dto.VehicleCountPerVendorDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    @Query("SELECT v FROM Vehicle v WHERE v.status = true")
    List<Vehicle> getActiveVehicles();

    Optional<Vehicle> findByPlateNumber(String plateNumber);


    @Query("select v from VehicleAssignment va\n" +
            "right outer join Vehicle v\n" +
            "on va.vehicle = v.id\n" +
            "WHERE va.vehicle IS NULL OR va.status = false AND v.status = true")
    List<Vehicle> getNotAssignedVehicle();

    @Query("select v from Vehicle v\n" +
            "WHERE v.vehicleReplacement IS NULL AND v.status=1")
    List<Vehicle> availableForReplacement();

    @Query("SELECT COUNT(v) AS total_vehicles FROM Vehicle v WHERE v.status = true")
    Long getActiveVehicleCount();

    @Query("SELECT v.vendor.id AS id, v.vendor.vendorName AS name, COUNT(v) AS total_vehicles FROM Vehicle v GROUP BY v.vendor.id")
    List<Object[]> getActiveVehiclePerVendor();

    @Query("SELECT v FROM VehicleAssignment va\n" +
            "RIGHT OUTER JOIN Vehicle v ON va.vehicle = v.id\n" +
            "WHERE va.vehicle IS NULL OR va.status = false AND v.status = true AND v.leaseCost <= :value")
    List<Vehicle> getAllVehiclesUnderDriverVehicleBudget(@Param("value") Integer value);

    List<Vehicle> findByVehicleStatus(String status);

    @Query("SELECT v.usageType, COUNT(v) AS total_count FROM Vehicle v GROUP BY v.usageType")
    List<Object[]> getStatsCount();

    @Query("SELECT v.region, COUNT(v) AS total_count FROM Vehicle v GROUP BY v.region")
    List<Object[]> getRegionCounts();

}
