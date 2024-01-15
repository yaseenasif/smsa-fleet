package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Vendor;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProjectVehicleDto {
    private Long id;
    private String projectName;
    private LocalDate date;
    private String plateNumber;
    private Boolean status;
    private Vendor vendor;
}
