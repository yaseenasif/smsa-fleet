package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.FileMetaDataDto;
import com.example.FleetSystem.model.FileMetaData;
import com.example.FleetSystem.service.FileMetaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FileMetaDataController {

    @Autowired
    FileMetaDataService fileMetaDataService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/file-meta-data-by-employee/{id}")
    public ResponseEntity<List<FileMetaDataDto>> getMetaDataByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(fileMetaDataService.getFileMetaDataByEmployee(id));
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/file-meta-data-by-vehicle/{id}")
    public ResponseEntity<List<FileMetaDataDto>> getMetaDataByVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(fileMetaDataService.getFileMetaDataByVehicle(id));
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/file-meta-data-by-vehicle-assignment/{id}")
    public ResponseEntity<List<FileMetaDataDto>> getMetaDataByVehicleAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(fileMetaDataService.getFileMetaDataByVehicleAssignment(id));
    }

}
