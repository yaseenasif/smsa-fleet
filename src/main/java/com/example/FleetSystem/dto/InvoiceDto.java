package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Vendor;
import lombok.*;

import javax.persistence.ManyToOne;
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
public class InvoiceDto {

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
    private String fileName;
    private LocalDateTime createdAt;
    private LocalDate updatedAt;
    private Vendor supplier;

}
