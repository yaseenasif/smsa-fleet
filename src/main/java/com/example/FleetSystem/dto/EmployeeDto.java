package com.example.FleetSystem.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class EmployeeDto {

    private Long id;
    private String empName;
    private String jobTitle;
    private Date joiningDate;
    private String department;
    private String section;
    private String region;
    private String city;
    private String nationality;
    private String contactNumber;
    private String companyEmailAddress;
    private String grade;
    private String licenseNumber;
    private Integer vehicleBudget;
    private String attachments;
    private boolean status;
    private boolean isDriver;

}
