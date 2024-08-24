package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.InvoiceFileDto;
import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.service.InvoiceFileService;
import com.example.FleetSystem.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceFileController {

    @Autowired
    InvoiceFileService invoiceFileService;
    @Autowired
    StorageService storageService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-all-invoice-files")
    public ResponseEntity<List<InvoiceFileDto>> getAll() {
        return ResponseEntity.ok(invoiceFileService.getAll());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/search-invoice-files")
    public ResponseEntity<List<InvoiceFileDto>> searchInvoiceFile(@RequestParam(value = "invoiceType", required = false) String invoiceType,
                                                                  @RequestParam(value = "invoiceMonth", required = false) String invoiceMonth) {
        return ResponseEntity.ok(invoiceFileService.searchInvoiceFile(invoiceType, invoiceMonth));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/invoice-download/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
        byte[] data = storageService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

}
