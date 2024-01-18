package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.model.Vendor;
import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProjectVehicleDto {
    private Long id;
    private String projectName;
    private Date date;
    private LocalDate createdAt;
    private Boolean status;
    private List<ProjectVehicleValues> projectVehicleValuesList;
}
