package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import lombok.*;

import java.sql.Date;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class VehicleAssignmentDto {

    private Long id;
    private String design;
    private String make;
    private Employee assignToEmpId;
    private String assignToEmpName;
    private String model;
    private String year;
    private Date leaseExpiry;
    private Integer leaseCost;
    private String attachments;
    private boolean status;
    private Vehicle vehicle;
}
