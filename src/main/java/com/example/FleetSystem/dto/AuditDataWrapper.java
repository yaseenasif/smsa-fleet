package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.VehicleAssignment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.RevisionType;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.function.ToIntFunction;
import java.util.function.ToLongFunction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditDataWrapper {

        private VehicleAssignment entity;
        private RevisionType revisionType;
        private LocalDateTime revisionTimeStamp;

}
