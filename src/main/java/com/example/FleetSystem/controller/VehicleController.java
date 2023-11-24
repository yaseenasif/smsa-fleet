package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.VehicleService;
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
public class VehicleController {

    @Autowired
    VehicleService vehicleService;


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-vehicle")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.ok(vehicleService.save(vehicleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicle")
    public ResponseEntity<Page<VehicleDto>> searchVehicles(@RequestParam(value = "value",required = false) String value,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicles(vehicleSearchCriteria,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-vehicle")
    public ResponseEntity<List<VehicleDto>> getAllVehicle() {
        return ResponseEntity.ok(vehicleService.getActiveVehicles());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        VehicleDto vehicleDto = vehicleService.findById(id);
        return ResponseEntity.ok(vehicleDto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-vehicle/{id}")
    public ResponseEntity<VehicleDto> updateVehicleById(@PathVariable Long id, @RequestBody VehicleDto vehicleDto) {
        VehicleDto updateVehicleDto = vehicleService.updateVehicle(id, vehicleDto);
        return ResponseEntity.ok(updateVehicleDto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-vehicle/{id}")
    public ResponseEntity<VehicleDto> deleteVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.deleteVehicleById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/vehicle-active/{id}")
    public ResponseEntity<VehicleDto> makeDriverActive(@PathVariable Long id){
        return ResponseEntity.ok(vehicleService.makeVehicleActive(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-bulk-vehicle")
    public ResponseEntity<ResponseMessage> addBulkVehicle(@RequestParam("file") MultipartFile file){
        return ResponseEntity.ok(new ResponseMessage(vehicleService.addBulkVehicle(file)));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/not-assigned-vehicle")
    public ResponseEntity<List<VehicleDto>> getAllNotAssignedVehicle(){
        return ResponseEntity.ok(vehicleService.getAllNotAssignedVehicle());
    }

}
