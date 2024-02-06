package com.example.FleetSystem.payload;

import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalReturnRequest {

    private VehicleDto replacementVehicle;
    private VehicleAssignmentDto changedAssignment;
}
