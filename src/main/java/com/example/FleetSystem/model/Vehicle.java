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
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer processOrderNumber;
    private Integer plateNumber;
    private String make;
    private String year;
    private String design;
    private String model;
    private String type;
    private String capacity;
    private String power;
    private String registrationExpiry;
    private String fuelType;
    private String vendor;
    private Date insuranceExpiry;
    private String leaseCost;
    private Date leaseStartDate;
    private Date leaseExpiryDate;
    private String usageType;
    private String attachments;
    private boolean status;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

}
