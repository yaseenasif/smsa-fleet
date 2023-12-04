package com.example.FleetSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class VehiclePerRegionCountDto {
    private String name;
    private Long totalVehicles;
}
