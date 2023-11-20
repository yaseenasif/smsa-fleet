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

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @PostMapping("/add-vendor")
        public ResponseEntity<VendorDto> createVendor(@RequestBody VendorDto vendorDto) {
            return ResponseEntity.ok(vendorService.save(vendorDto));
        }

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @GetMapping("/vendor/{id}")
        public ResponseEntity<VendorDto> getVehicleById(@PathVariable Long id) {
            return ResponseEntity.ok(vendorService.getById(id));
        }

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @PatchMapping("/update-vendor/{id}")
        public ResponseEntity<VendorDto> updateVendorById(@PathVariable Long id, @RequestBody VendorDto vendorDto) {
            return ResponseEntity.ok(vendorService.updateById(id, vendorDto));
        }

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @DeleteMapping("/delete-vendor/{id}")
        public ResponseEntity<VendorDto> deleteVendorById(@PathVariable Long id) {
            return ResponseEntity.ok(vendorService.deleteVendorById(id));
        }

        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @PatchMapping("/vendor-active/{id}")
        public ResponseEntity<VendorDto> makeVendorActive(@PathVariable Long id){
            return ResponseEntity.ok(vendorService.makeVendorActive(id));
        }

       @GetMapping("/get-active-vendors")
         public ResponseEntity<List<Vendor>> getActiveVendors(){
         return ResponseEntity.ok(vendorService.getAll());
       }

}
