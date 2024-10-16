package com.example.FleetSystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailApprovalRequest {

    private String supplier;
    private YearMonth invoiceMonth;
    private String invoiceType;

}
