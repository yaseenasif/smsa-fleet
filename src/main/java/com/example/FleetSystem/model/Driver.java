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
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String assignedVehicle;
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
