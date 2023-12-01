package com.example.FleetSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CityDto {
    private Long id;
    private String name;
    private String region;
    private boolean status;
}
