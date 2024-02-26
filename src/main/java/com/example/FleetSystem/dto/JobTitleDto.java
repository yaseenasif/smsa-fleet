package com.example.FleetSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class JobTitleDto {

    private Long id;
    private String jobTitle;
    private String division;
    private String department;
    private String section;
    private String fleetClassification;
    private String vehicleEligible;
    private Boolean status;
}
