package com.example.FleetSystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHistoryResponse {

    private String type;
    private LocalDateTime createdAt;
    private String createdBy;
    private Long empNo;
    private String empName;
    private String plateNumber;
}
