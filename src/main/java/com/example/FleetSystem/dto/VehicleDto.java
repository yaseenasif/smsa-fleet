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

public class VehicleDto {
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
    private boolean registrationStatus;
    private String fuelType;
    private Vendor vendor;
    private Date insuranceExpiry;
    private boolean insuranceStatus;
    private Integer leaseCost;
    private Integer replaceLeaseCost;
    private Date leaseStartDate;
    private Date leaseExpiryDate;
    private String usageType;
    private String category;
    private String uuid;
    private boolean status;
    private VehicleReplacement vehicleReplacement;

}
