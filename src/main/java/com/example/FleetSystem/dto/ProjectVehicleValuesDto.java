package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.Vendor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProjectVehicleValuesDto {
    private Long id;
    private String plateNumber;
    private String type;
    private Integer leaseCost;
    private Integer duration;
    private String origin;
    private String destination;
    private String costCenter;
    private Date rentalDate;
    private Date rentalDateTo;
    private Date startLease;
    private Date expiryLease;
    private VendorDto vendor;
    private String vehicleType;
    private String month;
    private ProjectVehicleDto projectVehicleDto;
}

