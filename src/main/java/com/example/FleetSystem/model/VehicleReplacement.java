package com.example.FleetSystem.model;

import lombok.*;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.time.LocalDate;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Audited
@Entity
public class VehicleReplacement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reason;
    private LocalDate replacedAt;

    @OneToOne
    @Audited(targetAuditMode = NOT_AUDITED)
    private Vehicle vehicle;

    @ManyToOne
    @Audited(targetAuditMode = NOT_AUDITED)
    private User replacedBy;
}
