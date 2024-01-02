package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Employee;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DriverDto {

    private Long id;
    private Employee empId;
    private String assignedVehicle;
    private boolean status;

}
