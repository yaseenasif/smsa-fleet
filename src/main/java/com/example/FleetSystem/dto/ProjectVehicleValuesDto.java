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
    private String origin;
    private String destination;
    private String rentalDate;
    private Date startLease;
    private Date expiryLease;
    private Boolean status;
    private VendorDto vendorDto;
    private ProjectVehicleDto projectVehicleDto;
}

