package com.example.FleetSystem.dto;

import lombok.*;
import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class InvoiceUploadRequest {
    private String invoiceType;
    private String invoiceMonth;
}
