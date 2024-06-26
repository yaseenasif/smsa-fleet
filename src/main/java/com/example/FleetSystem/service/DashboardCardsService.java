package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.VehicleCountPerVendorDto;
import com.example.FleetSystem.dto.VehiclePerRegionCountDto;
import com.example.FleetSystem.model.Region;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleAssignmentRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardCardsService {

    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;
    @Autowired
    UserRepository userRepository;

    public Map<String, Object> getCounts() {
        Map<String, Object> counts = new HashMap<>();
        // Get total count of active vehicles

        List<String> userRegions = Objects.requireNonNull(getUserRegions()).stream().map(Region::getName).collect(Collectors.toList());

        Long totalActiveVehicles = vehicleRepository.getActiveVehicleCount(userRegions);
        counts.put("totalActiveVehicles", totalActiveVehicles);

        // Get count of active vehicles per vendor
        List<Object[]> activeVehiclesPerVendor = vehicleRepository.getActiveVehiclePerVendor();
        List<VehicleCountPerVendorDto> vehicleCountPerVendorDtoList = activeVehiclesPerVendor.stream()
                .map(objects -> new VehicleCountPerVendorDto((Long) objects[0], (String) objects[1], (Long) objects[2]))
                .collect(Collectors.toList());
        counts.put("activeVehiclesPerVendor", vehicleCountPerVendorDtoList);

        List<Object[]> totalVehiclesPerRegion = vehicleAssignmentRepository.getActiveVehiclePerRegionCount();
        List<VehiclePerRegionCountDto> vehiclePerRegionCountDtoList = totalVehiclesPerRegion.stream()
                .map(objects -> new VehiclePerRegionCountDto((String) objects[0], (Long) objects[1]))
                .collect(Collectors.toList());
        counts.put("totalVehiclesPerRegion", vehiclePerRegionCountDtoList);

        List<Vehicle> unassignedVehicles = vehicleRepository.getNotAssignedVehicle();
        counts.put("unassignedVehicles", unassignedVehicles.size());

        return counts;
    }

    public Map<String, Object> getStatsCount() {
        Map<String, Object> counts = new HashMap<>();

        List<Object[]> usageTypeCounts = vehicleRepository.getStatsCount();
        Map<String, Object> usageTypeMap = new HashMap<>();

        for(Object[] stat: usageTypeCounts) {
            String usageType = (String) stat[0];
            Object totalCount = stat[1];
            if(usageType != null) {
                usageTypeMap.put(usageType, totalCount);
            }
        }
        counts.put("usageTypeCounts", usageTypeMap);
        List<String> userRegions = Objects.requireNonNull(getUserRegions()).stream().map(Region::getName).collect(Collectors.toList());

        Long totalVehicleCounts = vehicleRepository.getActiveVehicleCount(userRegions);
        counts.put("totalVehicleCount", totalVehicleCounts);

        List<Object[]> regionCounts = vehicleRepository.getRegionCounts();
        Map<String, Object> regionMap = new HashMap<>();

        for (Object[] re: regionCounts) {
            String region = (String) re[0];
            Object totalRegionCount = re[1];
            if(region != null) {
                regionMap.put(region, totalRegionCount);
            }
        }
        counts.put("regionCounts", regionMap);

        List<Object[]> departmentCounts = vehicleAssignmentRepository.getVehiclePerDepartmentCount();
        Map<String, Object> departmentMap = new HashMap<>();

        for(Object[] dep: departmentCounts) {
            String department = (String) dep[0];
            Object totalDepCounts = dep[1];
            if(department != null) {
                departmentMap.put(department, totalDepCounts);
            }
        }
        counts.put("departmentCounts", departmentMap);

        return counts;
    }

    private Set<Region> getUserRegions() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            return user.getRegions();
        } else {
            return null;
        }
    }
}
