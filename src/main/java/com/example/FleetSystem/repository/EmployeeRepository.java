package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.ProductField;
import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long>, JpaSpecificationExecutor<Employee> {

    @Query("SELECT e FROM Employee e WHERE e.deleteStatus = true")
    List<Employee> getActiveEmployees();

    Optional<Employee> findByEmployeeNumber(Long employeeNumber);

    @Query("SELECT e\n" +
            "FROM Employee e\n" +
            "LEFT OUTER JOIN VehicleAssignment va ON va.assignToEmpId = e.id\n" +
            "WHERE e.deleteStatus = true AND e.vehicleEligible = 'L VEH' AND va.assignToEmpId is null")
    List<Employee> getUnAssignedEmployee();
    @Query("SELECT e\n" +
            "FROM Employee e\n" +
            "LEFT OUTER JOIN VehicleAssignment va ON va.assignToEmpId = e.id\n" +
            "WHERE e.deleteStatus = true AND e.vehicleEligible = 'L VEH' AND e.employeeNumber = :empNo")
    Optional<Employee> findEligibleEmployee(Long empNo);

    List<Employee> findByDeleteStatusTrue();
}
