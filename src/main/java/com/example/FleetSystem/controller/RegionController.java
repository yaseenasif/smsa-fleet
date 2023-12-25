package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.dto.RegionDto;
import com.example.FleetSystem.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RegionController {
    @Autowired
    RegionService regionService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-region")
    public ResponseEntity<RegionDto> saveRegion(@RequestBody RegionDto regionDto) {
        return ResponseEntity.ok(regionService.save(regionDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-active-region")
    public ResponseEntity<List<RegionDto>> getActiveRegions() {
        return ResponseEntity.ok(regionService.getActiveRegion());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-region-by-country")
    public ResponseEntity<List<RegionDto>> getRegions(@RequestParam String country) {
        if (country == null || country.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(regionService.getAllRegions(country));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-cities-by-region")
    public ResponseEntity<RegionDto> getCitiesByRegion(@RequestParam String name) {
        return ResponseEntity.ok(regionService.getAllCitiesByRegion(name));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-region/{id}")
    public ResponseEntity<RegionDto> getRegionById(@PathVariable Long id) {
        return ResponseEntity.ok(regionService.getById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-region/{id}")
    public ResponseEntity<RegionDto> updateRegionById(@PathVariable Long id, @RequestBody RegionDto regionDto) {
        return ResponseEntity.ok(regionService.updateRegionById(id, regionDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-region/{id}")
    public ResponseEntity<RegionDto> deleteRegionById(@PathVariable Long id) {
        return ResponseEntity.ok(regionService.deleteById(id));
    }
}
