package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.EmployeeService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-bulk-employee")
    public ResponseEntity<ResponseMessage> addBulkEmployee(@RequestParam("file") MultipartFile file){
        return ResponseEntity.ok(new ResponseMessage(employeeService.addBulkEmployee(file)));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-unassigned-employee")
    public ResponseEntity<List<EmployeeDto>> getAllUnAssignedEmployee(){
        return ResponseEntity.ok(employeeService.getAllUnAssignedEmployee());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-employee")
    public ResponseEntity<Page<EmployeeDto>> searchEmployee(@RequestParam(value = "value",required = false) Long value,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
        employeeSearchCriteria.setValue(value);
        return ResponseEntity.ok(employeeService.searchEmployee(employeeSearchCriteria,page, size));
    }
}
