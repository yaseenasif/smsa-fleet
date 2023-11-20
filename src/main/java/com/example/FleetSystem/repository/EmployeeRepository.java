package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {

    @Query("SELECT e FROM Employee e WHERE e.deleteStatus = true")
    List<Employee> getActiveEmployees();

    Optional<Employee> findByEmployeeNumber(Long employeeNumber);

    @Query("SELECT e\n" +
            "FROM Employee e\n" +
            "LEFT OUTER JOIN VehicleAssignment va ON va.assignToEmpId = e.id\n" +
            "WHERE va.assignToEmpId IS NULL AND e.deleteStatus = true")
    List<Employee> getUnAssignedEmployee();
}
