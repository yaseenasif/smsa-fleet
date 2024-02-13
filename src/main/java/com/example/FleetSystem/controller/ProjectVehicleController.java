package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.service.ProjectVehicleService;
import com.example.FleetSystem.service.ProjectVehicleValuesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectVehicleController {

    @Autowired
    ProjectVehicleService projectVehicleService;
    @Autowired
    ProjectVehicleValuesService projectVehicleValuesService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-project-vehicle")
    public ResponseEntity<ProjectVehicleDto> addProjectVehicle(@RequestBody ProjectVehicleDto projectVehicleDto) {
        return ResponseEntity.ok(projectVehicleService.save(projectVehicleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-project-vehicle")
    public ResponseEntity<List<ProjectVehicleDto>> getAllProjectVehicle() {
        return ResponseEntity.ok(projectVehicleService.getAll());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> getByProjectVehicleId(@PathVariable Long id) {
        return ResponseEntity.ok(projectVehicleService.getByProjectVehicleId(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> updateProjectVehicleById(@PathVariable Long id, @RequestBody ProjectVehicle projectVehicle) {
        return ResponseEntity.ok(projectVehicleService.updateProjectVehicleById(id, projectVehicle));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> deleteProjectVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(projectVehicleService.deleteProjectVehicleById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-project-vehicle-by-{rentalDate}")
    public ResponseEntity<List<ProjectVehicleValuesDto>> getAllProjectVehicleValuesByRentalDate(@RequestParam String rentalDate) {
        return ResponseEntity.ok(projectVehicleValuesService.getAllByRentalDate(rentalDate));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-project-vehicle-by-leaseDates")
    public ResponseEntity<List<ProjectVehicleValuesDto>> getAllProjectVehicleValuesByLeaseDates(
            @RequestParam Date startLease,
            @RequestParam Date expiryLease
    ) {
        return ResponseEntity.ok(projectVehicleValuesService.getAllByLeaseDates(startLease,expiryLease));
    }
}
