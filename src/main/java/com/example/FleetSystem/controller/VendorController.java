package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.VendorDto;
import com.example.FleetSystem.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.FleetSystem.model.Vendor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VendorController {
        @Autowired
        VendorService vendorService;

        @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
        @PostMapping("/add-vendor")
        public ResponseEntity<VendorDto> createVendor(@RequestBody VendorDto vendorDto) {
            return ResponseEntity.ok(vendorService.save(vendorDto));
        }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
        @GetMapping("/vendor/{id}")
        public ResponseEntity<VendorDto> getVehicleById(@PathVariable Long id) {
            return ResponseEntity.ok(vendorService.getById(id));
        }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
        @PatchMapping("/update-vendor/{id}")
        public ResponseEntity<VendorDto> updateVendorById(@PathVariable Long id, @RequestBody VendorDto vendorDto) {
            return ResponseEntity.ok(vendorService.updateById(id, vendorDto));
        }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
        @DeleteMapping("/delete-vendor/{id}")
        public ResponseEntity<VendorDto> deleteVendorById(@PathVariable Long id) {
            return ResponseEntity.ok(vendorService.deleteVendorById(id));
        }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
        @PatchMapping("/vendor-active/{id}")
        public ResponseEntity<VendorDto> makeVendorActive(@PathVariable Long id){
            return ResponseEntity.ok(vendorService.makeVendorActive(id));
        }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-active-vendors")
         public ResponseEntity<List<VendorDto>> getActiveVendors(){
         return ResponseEntity.ok(vendorService.getAll());
       }

}
