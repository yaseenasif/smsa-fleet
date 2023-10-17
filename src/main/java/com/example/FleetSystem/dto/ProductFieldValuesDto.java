package com.example.FleetSystem.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProductFieldValuesDto {

    private Long id;

    private String name;
    private String status;

}
