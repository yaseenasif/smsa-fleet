package com.example.FleetSystem.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
public class VehicleReplacement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reason;
    private LocalDate replacedAt;

    @OneToOne
    private Vehicle vehicle;

    @ManyToOne
    private User replacedBy;
}
