package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.VehicleReplacement;
import com.example.FleetSystem.model.Vendor;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class VehicleExcelDto {
    private Long id;
    private Integer processOrderNumber;
    private String plateNumber;
    private String make;
    private Integer year;
    private String design;
    private String model;
    private String type;
    private String capacity;
    private String power;
    private Date registrationExpiry;
    private String fuelType;
    private String vendor;
    private Date insuranceExpiry;
    private Integer leaseCost;
    private Date leaseStartDate;
    private Date leaseExpiryDate;
    private String usageType;
    private String region;
    private String category;
    private String vehicleStatus;
    private Long assignToEmployeeNo;
    private String assignToEmployeeName;
    private String replacementVehicle;
    private String replacementVehicleStatus;
}
