package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.InvoiceDto;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/save-invoice-excel")
    public ResponseEntity<ResponseMessage> saveInvoiceExcelData(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ResponseMessage(invoiceService.saveInvoiceExcelData(file)));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-all-invoices")
    public ResponseEntity<List<InvoiceDto>> getAll() {
        return ResponseEntity.ok(invoiceService.getAll());
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-invoice/{id}")
    public ResponseEntity<InvoiceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }
}
