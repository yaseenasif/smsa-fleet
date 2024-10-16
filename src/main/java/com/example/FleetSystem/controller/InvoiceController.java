package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.InvoiceSearchCriteria;
import com.example.FleetSystem.dto.InvoiceDto;
import com.example.FleetSystem.dto.InvoiceFileDto;
import com.example.FleetSystem.dto.InvoiceUploadRequest;
import com.example.FleetSystem.dto.VendorDto;
import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.model.Vendor;
import com.example.FleetSystem.payload.*;
import com.example.FleetSystem.service.InvoiceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/save-invoice-excel")
    public ResponseEntity<?> saveInvoiceExcelData(@RequestParam("file") MultipartFile file,
                                                                       @RequestParam("invoiceUploadRequest") String invoiceUploadRequest) throws JsonProcessingException {

        InvoiceUploadRequest invoiceUploadRequest1 = new ObjectMapper().readValue(invoiceUploadRequest, InvoiceUploadRequest.class);
        UploadDataFileResponse response = invoiceService.saveInvoiceExcelData(file, invoiceUploadRequest1);

        if (response.getByteArrayResource() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice-errors.xlsx\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(response.getByteArrayResource());
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response.getMessage());
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

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-supplier-separated-invoices/{fileId}")
    public ResponseEntity<HashMap<String, List<Invoice>>> getSupplierSeparatedInvoices(@PathVariable Long fileId) {
        return ResponseEntity.ok(invoiceService.getSupplierSeparatedInvoices(fileId));
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-invoices-by-supplier-and-file/{fileId}/{supplierName}")
    public ResponseEntity<List<InvoiceDto>> getInvoicesBySupplierAndFileId(@PathVariable Long fileId,@PathVariable String supplierName) {
        return ResponseEntity.ok(invoiceService.getInvoicesBySupplierAndFileId(fileId, supplierName));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-invoices-suppliers-by-file/{fileId}")
    public ResponseEntity<List<Invoice>> getInvoicesSuppliersByFileId(@PathVariable Long fileId) {
        return ResponseEntity.ok(invoiceService.getInvoicesSuppliersByFileId(fileId));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/search-invoice")
    public ResponseEntity<List<InvoiceDto>> searchInvoice(@RequestParam(value = "invoiceType", required = false) String invoiceType,
                                                      @RequestParam(value = "invoiceCategory", required = false) String invoiceCategory,
                                                      @RequestParam(value = "invoiceMonth",required = false) String invoiceMonth,
                                                      @RequestParam(value = "supplierName", required = false) String supplierName,
                                                      @RequestParam(value = "invoiceNumber", required = false) String invoiceNumber) {
        return ResponseEntity.ok(invoiceService.searchInvoice(invoiceType, invoiceCategory, invoiceMonth, supplierName, invoiceNumber));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/get-validated-invoices")
    public ResponseEntity<HashMap<Long, VehicleAssignment>> getValidatedInvoices(@RequestBody List<Invoice> invoices) {
        return ResponseEntity.ok(invoiceService.getValidatedInvoices(invoices));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/send-for-approval")
    public ResponseEntity<ResponsePayload> getValidatedInvoices(@RequestBody EmailApprovalRequest emailApprovalRequest) {
        invoiceService.sendForApproval(emailApprovalRequest);
        return ResponseEntity.ok(new ResponsePayload("Email sent for approval successfully."));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-waiting-invoices")
    public ResponseEntity<List<Invoice>> getWaitingForApprovalInvoices() {
         return ResponseEntity.ok(invoiceService.getWaitingForApprovalInvoices());
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/send-invoice-action")
    public ResponseEntity<ResponsePayload> actionOnInvoice(@RequestBody InvoiceActionPayload invoiceActionPayload) {
         return ResponseEntity.ok(invoiceService.actionOnInvoice(invoiceActionPayload));
    }

}
