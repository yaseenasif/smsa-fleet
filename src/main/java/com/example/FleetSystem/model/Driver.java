package com.example.FleetSystem.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @OneToOne
    @JoinColumn(name = "emp_id")
    private Employee empId;


    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

}
