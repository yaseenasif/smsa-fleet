package com.example.FleetSystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHistoryResponse {

    private String type;
    private LocalDate createdAt;
    private String createdBy;
    private Long EmpNo;
    private String EmpName;
    private String plateNumber;
}
