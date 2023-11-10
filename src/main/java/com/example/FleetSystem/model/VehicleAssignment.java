package com.example.FleetSystem.model;


import lombok.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

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
@Audited
@Table(name = "vehicle_assignment")
public class VehicleAssignment{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String design;
    private String make;
    private String assignToEmpName;
    private String model;
    private String year;
    private Date leaseExpiry;
    private Integer leaseCost;
    private String plateNumber;
    private String attachments;
    private boolean status;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "assign_to_emp_id")
    @NotAudited
    private Employee assignToEmpId;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    @NotAudited
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @NotAudited
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    @NotAudited
    private User updatedBy;

}
