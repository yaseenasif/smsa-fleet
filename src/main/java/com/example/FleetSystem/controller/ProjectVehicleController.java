package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.service.ProjectVehicleService;
import com.example.FleetSystem.service.ProjectVehicleValuesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/add-project-vehicle")
    public ResponseEntity<ProjectVehicleDto> addProjectVehicle(@RequestBody ProjectVehicleDto projectVehicleDto) {
        return ResponseEntity.ok(projectVehicleService.save(projectVehicleDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-all-project-vehicle")
    public ResponseEntity<List<ProjectVehicleDto>> getAllProjectVehicle() {
        return ResponseEntity.ok(projectVehicleService.getAll());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> getByProjectVehicleId(@PathVariable Long id) {
        return ResponseEntity.ok(projectVehicleService.getByProjectVehicleId(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PatchMapping("/update-project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> updateProjectVehicleById(@PathVariable Long id, @RequestBody ProjectVehicle projectVehicle) {
        return ResponseEntity.ok(projectVehicleService.updateProjectVehicleById(id, projectVehicle));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @DeleteMapping("/delete-project-vehicle/{id}")
    public ResponseEntity<ProjectVehicleDto> deleteProjectVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(projectVehicleService.deleteProjectVehicleById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/get-all-by-searchSpecification-with/{projectVehicleId}")
    public ResponseEntity<List<ProjectVehicleValuesDto>> getAllProjectVehicleValuesBySearchSpecification(
            @PathVariable Long projectVehicleId,
            @RequestBody ProjectVehicleValuesDto projectVehicleValuesDto
    ) {
        List<ProjectVehicleValuesDto> result = projectVehicleValuesService.getAllBySearchSpecification(projectVehicleId, projectVehicleValuesDto);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/download-project-vehicle-values-excel")
    public ResponseEntity<byte[]> downloadVehicleExcel(@RequestBody List<ProjectVehicleValuesDto> projectVehicleValuesDtoList) {
        byte[] excelBytes = projectVehicleValuesService.downloadExcel(projectVehicleValuesDtoList);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "vehicles.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);
    }
}
