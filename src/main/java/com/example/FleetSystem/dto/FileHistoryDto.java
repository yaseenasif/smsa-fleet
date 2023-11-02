package com.example.FleetSystem.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class FileHistoryDto {

    private Long id;
    private String fileName;
    private String uuid;
}
