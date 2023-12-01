package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.VehicleCountPerVendorDto;
import com.example.FleetSystem.repository.DriverRepository;
import com.example.FleetSystem.repository.VehicleAssignmentRepository;
import com.example.FleetSystem.repository.VehicleReplacementRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardCardsService {

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    DriverRepository driverRepository;

    @Autowired
    VehicleReplacementRepository vehicleReplacementRepository;

    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;

    public Map<String, Object> getCounts() {
        Map<String, Object> counts = new HashMap<>();
        // Get total count of active vehicles
        Long totalActiveVehicles = vehicleRepository.getActiveVehicleCount();
        counts.put("totalActiveVehicles", totalActiveVehicles);

        // Get count of active vehicles per vendor
        List<Object[]> activeVehiclesPerVendor = vehicleRepository.getActiveVehiclePerVendor();
        List<VehicleCountPerVendorDto> vehicleCountPerVendorDtoList = activeVehiclesPerVendor.stream()
                .map(objects -> new VehicleCountPerVendorDto((Long) objects[0], (String) objects[1], (Long) objects[2]))
                .collect(Collectors.toList());
        counts.put("activeVehiclesPerVendor", vehicleCountPerVendorDtoList);

        Long totalActiveDrivers = driverRepository.getActiveDriversCount();
        counts.put("totalActiveDrivers", totalActiveDrivers);

        Long totalVehicleReplacement = vehicleReplacementRepository.getVehicleReplacementCount();
        counts.put("totalVehicleReplacement", totalVehicleReplacement);

        Long totalVehiclesPerRegion = vehicleAssignmentRepository.getActiveVehiclePerRegionCount();
        counts.put("totalVehiclesPerRegion", totalVehiclesPerRegion);

        return counts;
    }
}
