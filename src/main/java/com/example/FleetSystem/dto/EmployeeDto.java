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
    private  Long employeeNumber;
    private String empName;
    private Long svEmployeeNumber;
    private  String svEmployeeName;
    private Long nationalIdNumber;
    private String jobTitle;
    private Date joiningDate;
    private Date dateOfBirth;
    private String department;
    private Long deptCode;
    private String division;
    private String organization;
    private String section;
    private Character gender;
    private Character maritalStatus;
    private String region;
    private String city;
    private String location;
    private String costCenter;
    private String nationality;
    private String contactNumber;
    private String companyEmailAddress;
    private Integer age;
    private Integer grade;
    private String licenseNumber;
    private Integer vehicleBudget;
    private String budgetRef;
    private String attachments;
    private String uuid;
    private Character status;
    private boolean deleteStatus;

}
