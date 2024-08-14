package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.model.InvoiceFile;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class InvoiceUploadResponse {

    private InvoiceFile invoiceFile;
    private Invoice invoice;
}
