package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.service.ProjectVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectVehicleController {

    @Autowired
    ProjectVehicleService projectVehicleService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-project-vehicle")
    public ResponseEntity<List<ProjectVehicleDto>> addProjectVehicle(@RequestBody List<ProjectVehicleDto> projectVehicleDtoList) {
        List<ProjectVehicleDto> savedProjectVehicles = projectVehicleService.save(projectVehicleDtoList);
        return ResponseEntity.ok(projectVehicleService.save(savedProjectVehicles));
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
    public ResponseEntity<ProjectVehicleDto> updateProjectVehicleById(@PathVariable Long id, @RequestBody ProjectVehicleDto projectVehicleDto) {
        return ResponseEntity.ok(projectVehicleService.updateProjectVehicleById(id, projectVehicleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> deleteProjectVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(projectVehicleService.deleteProjectVehicleById(id));
    }
}
