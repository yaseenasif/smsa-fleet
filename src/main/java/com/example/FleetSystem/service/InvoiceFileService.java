package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.InvoiceFileDto;
import com.example.FleetSystem.model.InvoiceFile;
import com.example.FleetSystem.repository.InvoiceFileRepository;
import com.example.FleetSystem.specification.InvoiceFileSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class InvoiceFileService {

    @Autowired
    InvoiceFileRepository invoiceFileRepository;
    
    @Autowired
    ModelMapper modelMapper;
    
    public List<InvoiceFileDto> getAll(){
        return toDtoList(invoiceFileRepository.findAll());
    }

    public List<InvoiceFileDto> toDtoList(List<InvoiceFile> Invoices){
        return Invoices.stream().map(this::toDto).collect(Collectors.toList());
    }

    public InvoiceFileDto toDto(InvoiceFile Invoice){
        return modelMapper.map(Invoice, InvoiceFileDto.class);
    }

    private InvoiceFile toEntity(InvoiceFileDto InvoiceFileDto){
        return modelMapper.map(InvoiceFileDto , InvoiceFile.class);
    }

    public List<InvoiceFileDto> searchInvoiceFile(String invoiceType, String invoiceMonth) {
        YearMonth formattedInvoiceMonth = null;
        if (invoiceMonth != null && !invoiceMonth.isEmpty()) {
            DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM-yyyy", Locale.ENGLISH);
            formattedInvoiceMonth = YearMonth.parse(invoiceMonth, monthFormatter);
        }

        Specification<InvoiceFile> invoiceFileSpecification = InvoiceFileSpecification.getSearchSpecification(invoiceType, formattedInvoiceMonth);
        List<InvoiceFile> invoiceFiles = invoiceFileRepository.findAll(invoiceFileSpecification);
        return toDtoList(invoiceFiles);
    }
}
