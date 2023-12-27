package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>,JpaSpecificationExecutor<Driver> {
    @Query("SELECT d FROM Driver d WHERE d.status = true")
    List<Driver> getActiveDrivers();

    @Query("SELECT COUNT(d) AS total_drivers FROM Driver d WHERE d.status = true")
    Long getActiveDriversCount();

    @Query("select d from Driver d \n" +
            "left outer join VehicleAssignment va\n" +
            "on d.empId = va.assignToEmpId\n" +
            "where va.assignToEmpId is null and d.status = true")
    List<Driver> getUnAssignedDriver();

    Optional<Driver> findByEmpId(Employee employee);
}
