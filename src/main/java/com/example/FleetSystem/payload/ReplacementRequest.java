package com.example.FleetSystem.payload;

import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleReplacementDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplacementRequest {

    private VehicleReplacementDto replacement;
    private VehicleAssignmentDto assignment;
}
