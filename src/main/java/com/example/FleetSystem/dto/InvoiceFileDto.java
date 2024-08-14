package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.User;
import lombok.*;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDate;
import java.time.YearMonth;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class InvoiceFileDto {

    private Long id;
    private String fileName;
    private String invoiceType;
    private YearMonth invoiceMonth;
    private String uuid;
    private LocalDate createdAt;
    private User createdBy;

}
