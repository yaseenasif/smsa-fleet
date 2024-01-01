package com.example.FleetSystem.controller;

import com.example.FleetSystem.service.DashboardCardsService;
import com.example.FleetSystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardCardsController {

    @Autowired
    DashboardCardsService dashboardCardsService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Object>> getVehicleCounts() {
        Map<String, Object> counts = dashboardCardsService.getCounts();
        return new ResponseEntity<>(counts, HttpStatus.OK);
    }
}
