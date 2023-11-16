package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.VehicleReplacementDto;
import com.example.FleetSystem.model.VehicleReplacement;
import com.example.FleetSystem.service.VehicleReplacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class VehicleReplacementController {

    @Autowired
    VehicleReplacementService vehicleReplacementService;


    @PatchMapping("/replace-vehicle/{id}")
    public ResponseEntity<VehicleReplacementDto> replaceVehicleById(@PathVariable Long id , @RequestBody VehicleReplacementDto vehicleReplacementDto){
        return ResponseEntity.ok(vehicleReplacementService.replaceVehicleById(id,vehicleReplacementDto));
    }

}
