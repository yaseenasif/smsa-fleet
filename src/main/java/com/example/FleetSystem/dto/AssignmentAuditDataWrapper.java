package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.VehicleAssignment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.RevisionType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentAuditDataWrapper {

        private VehicleAssignment entity;
        private RevisionType revisionType;
        private LocalDateTime revisionTimeStamp;

}
