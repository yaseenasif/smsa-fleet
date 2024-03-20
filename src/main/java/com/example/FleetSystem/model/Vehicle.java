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
@Audited
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotAudited
    private Integer processOrderNumber;
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
    private String category;
    @NotAudited
    private String uuid;
    private String vehicleStatus;
    private String replacementVehicleStatus;
    @NotAudited
    private LocalDate createdAt;
    @NotAudited
    private LocalDate updatedAt;

    @NotAudited
    @ManyToOne
    private Vendor vendor;

    @Audited(targetAuditMode = NOT_AUDITED)
    @OneToOne
    private VehicleReplacement vehicleReplacement;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

   }
