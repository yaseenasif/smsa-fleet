package com.example.FleetSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class GradeDto {

    private Long id;
    private Integer name;
    private Integer vehicleBudget;
    private boolean status;

}
