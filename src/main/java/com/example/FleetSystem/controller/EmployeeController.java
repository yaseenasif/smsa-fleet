package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EmployeeController {


    @Autowired
    EmployeeService employeeService;


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-employee")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.save(employeeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-employee")
    public ResponseEntity<List<EmployeeDto>> getAllEmployee() {
        return ResponseEntity.ok(employeeService.getAll());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/employee/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.findById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-employee/{id}")
    public ResponseEntity<EmployeeDto> updateEmployeeById(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id,employeeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-employee/{id}")
    public ResponseEntity<EmployeeDto> deleteEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.deleteEmployeeById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/employee-active/{id}")
    public ResponseEntity<EmployeeDto> makeEmployeeActive(@PathVariable Long id){
        return ResponseEntity.ok(employeeService.makeEmployeeActive(id));
    }

}
