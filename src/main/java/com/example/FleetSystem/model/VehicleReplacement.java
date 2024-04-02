//package com.example.FleetSystem.model;
//
//import lombok.*;
//import org.hibernate.envers.Audited;
//
//import javax.persistence.*;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@ToString
//@Builder
//@Entity
//public class VehicleReplacement {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String reason;
//    private String remarks;
//    private LocalDateTime replacedAt;
//
//    @OneToOne
//    private Vehicle vehicle;
//
//    @ManyToOne
//    private User replacedBy;
//}
