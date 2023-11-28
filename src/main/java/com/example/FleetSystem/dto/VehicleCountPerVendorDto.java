package com.example.FleetSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class VehicleCountPerVendorDto {
    private Long id;
    private String name;
    private Long totalVehicles;
}
