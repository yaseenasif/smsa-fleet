
package com.example.FleetSystem.controller;

import com.example.FleetSystem.model.Vendor;
import com.example.FleetSystem.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VendorController {

    @Autowired
    VendorService vendorService;

    @GetMapping("/get-active-vendors")
    public ResponseEntity<List<Vendor>> getActiveVendors(){
        return ResponseEntity.ok(vendorService.getAll());
    }

}
