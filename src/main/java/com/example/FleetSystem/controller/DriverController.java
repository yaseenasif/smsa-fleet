package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.dto.DriverDto;
import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.service.DriverService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DriverController {

    @Autowired
    DriverService driverService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/driver")
    public ResponseEntity<DriverDto> addDriver(@RequestBody DriverDto driverDto){
        return ResponseEntity.ok(driverService.addDriver(driverDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/driver")
    public ResponseEntity<List<DriverDto>> getAll(){
        return ResponseEntity.ok(driverService.getActiveDrivers());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/driver/{id}")
    public ResponseEntity<DriverDto> getById(@PathVariable Long id){
        return ResponseEntity.ok(driverService.getById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/driver/{id}")
    public ResponseEntity<DriverDto> deleteDriverById(@PathVariable Long id){
        return ResponseEntity.ok(driverService.deleteDriverById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/driver/{id}")
    public ResponseEntity<DriverDto> updateDriverById(@PathVariable Long id, @RequestBody DriverDto driverDto){
        return  ResponseEntity.ok(driverService.updateById(id, driverDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/driver-active/{id}")
    public ResponseEntity<DriverDto> makeDriverActive(@PathVariable Long id){
        return ResponseEntity.ok(driverService.makeDriverActive(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-driver")
    public ResponseEntity<Page<DriverDto>> searchDriver(@RequestParam(value = "value",required = false) Long value,
                                                            @RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
        employeeSearchCriteria.setValue(value);
        return ResponseEntity.ok(driverService.searchDriver(employeeSearchCriteria,page, size));
    }
}
