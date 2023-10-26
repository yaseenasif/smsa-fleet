package com.example.FleetSystem.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class AssignmentDto {

    private Long id;
    private String design;
    private String currentlyAssignedUnderName;
    private String make;
    private Long assignToEmpId;
    private String assignToEmpName;
    private String model;
    private String year;
    private LocalDate leaseExpiry;
    private String leaseCost;
    private String attachments;

    private DriverDto driver;
    private VehicleDto vehicle;
}
