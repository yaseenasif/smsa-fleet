package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.Vendor;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProjectVehicleValuesDto {

    private Long id;
    private String plateNumber;
    private Boolean status;
    private Vendor vendor;
}
