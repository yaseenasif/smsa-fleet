package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.VehicleAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VehicleAssignmentController {

    @Autowired
    VehicleAssignmentService vehicleAssignmentService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-vehicle-assignment")
    public ResponseEntity<VehicleAssignmentDto> saveVehicleAssignment(@RequestBody VehicleAssignmentDto vehicleAssignmentDto) {
        return ResponseEntity.ok(vehicleAssignmentService.save(vehicleAssignmentDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment")
    public ResponseEntity<List<VehicleAssignmentDto>> getAll() {
        return ResponseEntity.ok(vehicleAssignmentService.getActiveVehicleAssignment());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment/{id}")
    public ResponseEntity<VehicleAssignmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleAssignmentService.getById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/vehicle-assignment/{id}")
    public ResponseEntity<ResponseMessage> deleteVehicleAssignmentById(@PathVariable Long id) {
        vehicleAssignmentService.deleteVehicleAssignmentById(id);
        return ResponseEntity.ok(new ResponseMessage(Arrays.asList("Record deleted Successfully")));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/vehicle-assignment/{id}")
    public ResponseEntity<VehicleAssignmentDto> updateVehicleAssignmentById(@PathVariable Long id, @RequestBody VehicleAssignmentDto vehicleAssignmentDto) {
        return ResponseEntity.ok(vehicleAssignmentService.updateById(id, vehicleAssignmentDto));
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PatchMapping("/vehicle-assignment-active/{id}")
//    public ResponseEntity<VehicleAssignmentDto> makeVehicleAssignmentActive(@PathVariable Long id) {
//        return ResponseEntity.ok(vehicleAssignmentService.makeVehicleAssignmentActive(id));
//    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment-plateNumber/{plateNumber}")
    public ResponseEntity<VehicleAssignmentDto> getByPlateNumber(@PathVariable String plateNumber){
        return ResponseEntity.ok(vehicleAssignmentService.getByPlateNumber(plateNumber));
    }

}
