package com.example.FleetSystem.model;

import lombok.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

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
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean status;
    private boolean isDriver;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;



}
