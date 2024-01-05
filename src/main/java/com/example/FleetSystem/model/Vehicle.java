package com.example.FleetSystem.model;

import lombok.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

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
    private String plateNumber;
    private String make;
    private Integer year;
    private String design;
    private String model;
    private String type;
    private String capacity;
    private String power;
    private Date registrationExpiry;
    private boolean registrationStatus;
    private String fuelType;
    private Date insuranceExpiry;
    private boolean insuranceStatus;
    private Integer leaseCost;
    private Date leaseStartDate;
    private Date leaseExpiryDate;
    private Integer replaceLeaseCost;
    private String usageType;
    private String region;
    private String category;
    private String uuid;
    private boolean status;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    private Vendor vendor;

    @OneToOne
    private VehicleReplacement vehicleReplacement;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

   }
