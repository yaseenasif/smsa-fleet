package com.example.FleetSystem.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  Long employeeNumber;
    private String empName;
    private Long svEmployeeNumber;
    private  String svEmployeeName;
    private Long iqamaNumber;
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
    private String portOfDestination;
    private String nationality;
    private String contactNumber;
    private String companyEmailAddress;
    private Integer age;
    private String grade;
    private String licenseNumber;
    private Integer vehicleBudget;
    private String budgetRef;
    private String attachments;
    private String uuid;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Character status;
    private boolean deleteStatus;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

}
