package com.example.FleetSystem.model;

import lombok.*;
import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String businessUnit;
    private String invoiceNumber;
    private Date invoiceDate;
    private YearMonth invoiceMonth;
    private String invoiceType;
    private String invoiceCategory;
    private String invoiceFrom;
    private String invoiceTo;
    private Float amountBeforeTax;
    private Float taxableAmount;
    private Float taxPercent;
    private Float VATAmount;
    private Float amountAfterVAT;
    private Long lineNumber;
    private String plateNumber;
    private String agreementNumber;
    private Integer monthlyRate;
    private Long supplierControlNumber;
    private Integer vendorAmount;
    private Date dateFrom;
    private Date dateTo;
    private Long vendorVehicleRefNumber;
    private Float lineAmountWithoutTax;
    private Float lineTaxRate;
    private Float lineTaxAmount;
    private Float lineAmountWithTax;
    private String uuid;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @ManyToOne
    private InvoiceFile invoiceFile;

    @ManyToOne
    private Vendor supplier;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;
}
