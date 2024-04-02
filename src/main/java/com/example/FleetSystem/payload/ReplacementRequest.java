package com.example.FleetSystem.payload;

import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplacementRequest {

    private Vehicle replacementVehicle;
    private Employee changeAssignedEmployee;
}
