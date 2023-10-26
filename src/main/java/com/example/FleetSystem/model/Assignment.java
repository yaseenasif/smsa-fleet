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
@Table(name = "vehicle_assignment")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String design;
    private String currentlyAssignedUnderName;
    private String make;
    private Long assignToEmpId;
    private String assignToEmpName;
    private String model;
    private String year;
    private LocalDate leaseExpiry;
    private String leaseCost;
    private String attachments;


    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

}
