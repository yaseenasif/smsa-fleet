package com.example.FleetSystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceActionPayload {

    private String status;
    private String invoiceType;
    private String supplierName;
    private YearMonth invoiceMonth;
    private String remarks;

}
