package com.example.FleetSystem.dto;

import lombok.*;

import java.sql.Date;

@Data
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectVehicleExcelDto {

    private Long id;
    private String plateNumber;
    private String type;
    private Integer leaseCost;
    private Integer duration;
    private String origin;
    private String destination;
    private Date rentalDate;
    private Date rentalDateTo;
    private Date startLease;
    private Date expiryLease;
    private String vehicleType;
    private Boolean status;
    private String vendor;
    private String month;
}
