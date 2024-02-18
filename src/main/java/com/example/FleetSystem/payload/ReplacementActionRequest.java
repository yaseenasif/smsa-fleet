package com.example.FleetSystem.payload;

import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplacementActionRequest {

    private Employee changedAssignedEmployee;
    private VehicleDto permanentVehicle;
    private String action;
}
