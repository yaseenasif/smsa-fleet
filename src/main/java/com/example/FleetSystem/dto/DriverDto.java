package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Employee;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DriverDto {

    private Long id;
    private Employee empId;
    private String empName;
    private String title;
    private String department;
    private String section ;
    private String region;
    private String city;
    private String nationality;
    private String contactNumber;
    private String emailAddress;
    private String grade;
    private String licenseNumber;
    private Integer vehicleBudget ;
    private String attachments;
    private boolean status;



}
