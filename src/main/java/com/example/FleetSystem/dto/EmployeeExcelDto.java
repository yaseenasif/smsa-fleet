package com.example.FleetSystem.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class EmployeeExcelDto {
    private Long id;
    private Long employeeNumber;
    private String budgetRef;
    private String empName;
    private Character gender;
    private Character maritalStatus;
    private Date dateOfBirth;
    private Date joiningDate;
    private String jobTitle;
    private Character status;
    private String region;
    private String country;
    private String location;
    private String organization;
    private String division;
    private Long deptCode;
    private String department;
    private String section;
    private Long nationalIdNumber;
    private Long svEmployeeNumber;
    private String svEmployeeName;
    private String city;
    private Integer age;
    private String costCentre;
    private String nationality;
    private String companyEmailAddress;
    private Integer grade;
    private String licenseNumber;
    private Integer vehicleBudget;
    private String contactNumber;
}
