package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.RevisionType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAuditWrapper {

    private Vehicle entity;
    private RevisionType revisionType;
    private LocalDateTime revisionTimeStamp;
}
