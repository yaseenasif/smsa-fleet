package com.example.FleetSystem.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "project_vehicle")
public class ProjectVehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String projectName;
    private Date date;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Boolean status;

    @OneToMany(mappedBy = "projectVehicle", cascade = CascadeType.ALL)
    private List<ProjectVehicleValues> projectVehicleValuesList;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updateBy;
}
