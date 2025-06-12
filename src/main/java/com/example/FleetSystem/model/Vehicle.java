package com.example.FleetSystem.model;

import lombok.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Audited
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotAudited
    private String processOrderNumber;
    @NotAudited
    private String plateNumber;
    @NotAudited
    private String make;
    @NotAudited
    private Integer year;
    @NotAudited
    private String design;
    @NotAudited
    private String model;
    @NotAudited
    private String type;
    @NotAudited
    private String capacity;
    @NotAudited
    private String power;
    @NotAudited
    private Date registrationExpiry;
    @NotAudited
    private boolean registrationStatus;
    @NotAudited
    private String fuelType;
    @NotAudited
    private Date insuranceExpiry;
    @NotAudited
    private boolean insuranceStatus;
    @NotAudited
    private Integer leaseCost;
    @NotAudited
    private Date leaseStartDate;
    @NotAudited
    private Date leaseExpiryDate;
    @NotAudited
    private Integer replaceLeaseCost;
    @NotAudited
    private Date replacementDate;
    @NotAudited
    private String usageType;
    @NotAudited
    private String region;
    @NotAudited
    private String location;
    @NotAudited
    private String country;
    @NotAudited
    private String category;
    @NotAudited
    private String costCenter;
    @NotAudited
    private String uuid;
    private String vehicleStatus;
    private String replacementVehicleStatus;
    private String historyStatus;
    private String replacementReason;
    private String replacementRemarks;
    private Integer monthlyRate;

    @NotAudited
    private LocalDateTime createdAt;
    @NotAudited
    private LocalDate updatedAt;

    @OneToOne()
    private Vehicle replacementVehicle;

    @ManyToOne
    @NotAudited
    private Vendor vendor;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

   }
