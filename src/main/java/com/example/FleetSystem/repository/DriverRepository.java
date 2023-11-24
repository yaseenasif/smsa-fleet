package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>,JpaSpecificationExecutor<Driver> {
    @Query("SELECT d FROM Driver d WHERE d.status = true")
    List<Driver> getActiveDrivers();
}
