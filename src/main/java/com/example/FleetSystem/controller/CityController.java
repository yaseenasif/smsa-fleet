package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.CityDto;
import com.example.FleetSystem.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CityController {

    @Autowired
    CityService cityService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PostMapping("/add-city")
    public ResponseEntity<CityDto> addCity(@RequestBody CityDto cityDto){
        return ResponseEntity.ok(cityService.addCity(cityDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/get-active-city")
    public ResponseEntity<List<CityDto>> getActiveCities(){
        return ResponseEntity.ok(cityService.getActiveCities());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/get-city/{id}")
    public ResponseEntity<CityDto> getCitiesById(@PathVariable Long id){
        return ResponseEntity.ok(cityService.getById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PatchMapping("/update-city/{id}")
    public ResponseEntity<CityDto> updateCityById(@PathVariable Long id, @RequestBody CityDto cityDto){
        return ResponseEntity.ok(cityService.updateCityById(id,cityDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @DeleteMapping("/delete-city/{id}")
    public ResponseEntity<CityDto> deleteCityById(@PathVariable Long id){
        return ResponseEntity.ok(cityService.deleteById(id));
    }
}
