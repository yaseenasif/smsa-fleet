package com.example.FleetSystem.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "project_vehicle_values")
public class ProjectVehicleValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String plateNumber;
    private String type;
    private Integer leaseCost;
    private String origin;
    private String destination;
    private String rentalDate;
    private Date startLease;
    private Date expiryLease;
    private Boolean status;

    @ManyToOne
    private Vendor vendor;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_vehicle_id")
    private ProjectVehicle projectVehicle;
}
