package com.example.FleetSystem.dto;

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
    private String year;
    private String design;
    private String model;
    private String type;
    private String capacity;
    private String power;
    private Date registrationExpiry;
    private boolean registrationStatus;
    private String fuelType;
    private String vendor;
    private Date insuranceExpiry;
    private boolean insuranceStatus;
    private String leaseCost;
    private Date leaseStartDate;
    private Date leaseExpiryDate;
    private String usageType;
    private String attachments;
    private boolean status;


}
