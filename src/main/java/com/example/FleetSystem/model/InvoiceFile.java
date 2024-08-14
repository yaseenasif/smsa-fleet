package com.example.FleetSystem.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.YearMonth;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
public class InvoiceFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private String invoiceType;
    private YearMonth invoiceMonth;
    private String uuid;
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
