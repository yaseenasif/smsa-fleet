package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.StorageService;
import com.example.FleetSystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VehicleController {

    @Autowired
    VehicleService vehicleService;
    @Autowired
    StorageService storageService;


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-vehicle")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.ok(vehicleService.save(vehicleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-vehicle")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        List<VehicleDto> vehicleDtoList = vehicleService.getActiveVehicles();
        return ResponseEntity.ok(vehicleDtoList);
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

    @PostMapping("/add-vehicle-attachments/{id}/{attachmentType}")
    public ResponseEntity<ResponseMessage> addAttachments(@PathVariable Long id, @PathVariable String attachmentType, @RequestParam("file") MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(vehicleService.addAttachment(id, attachmentType, multipartFile));
    }

    @GetMapping("/vehicle-download/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
        byte[] data = storageService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

}
