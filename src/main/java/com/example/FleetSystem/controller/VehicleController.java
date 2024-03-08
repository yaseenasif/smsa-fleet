package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.payload.FinalReturnRequest;
import com.example.FleetSystem.payload.ReplacementActionRequest;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.payload.VehicleHistoryResponse;
import com.example.FleetSystem.service.ExcelExportService;
import com.example.FleetSystem.service.StorageService;
import com.example.FleetSystem.service.VehicleService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VehicleController {

    @Autowired
    VehicleService vehicleService;
    @Autowired
    StorageService storageService;

    @Autowired
    ExcelExportService excelExportService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-vehicle")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.ok(vehicleService.save(vehicleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicle")
    public ResponseEntity<Page<VehicleDto>> searchVehicles(@RequestParam(value = "value", required = false) String value,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicles(vehicleSearchCriteria, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-unassigned-vehicle")
    public ResponseEntity<Page<VehicleDto>> searchUnassignedVehicles(@RequestParam(value = "value", required = false) String value,
                                                                     @RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchUnAssignedVehicles(vehicleSearchCriteria, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-vehicle")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        List<VehicleDto> vehicleDtoList = vehicleService.getActiveVehicles();
        return ResponseEntity.ok(vehicleDtoList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        VehicleDto vehicleDto = vehicleService.findById(id);
        return ResponseEntity.ok(vehicleDto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-vehicle/{id}")
    public ResponseEntity<VehicleDto> updateVehicleById(@PathVariable Long id, @RequestBody VehicleDto vehicleDto) {
        VehicleDto updateVehicleDto = vehicleService.updateVehicle(id, vehicleDto);
        return ResponseEntity.ok(updateVehicleDto);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/final-return-vehicle/{id}")
    public ResponseEntity<VehicleDto> finalReturnVehicleById(@PathVariable Long id, @RequestBody FinalReturnRequest finalReturnRequest) {
        return ResponseEntity.ok(vehicleService.finalReturnVehicleById(id, finalReturnRequest));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/activate-vehicle/{id}")
    public ResponseEntity<VehicleDto> activateVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.activateVehicle(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-bulk-vehicle")
    public ResponseEntity<ResponseMessage> addBulkVehicle(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new ResponseMessage(vehicleService.addBulkVehicle(file)));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/not-assigned-vehicle")
    public ResponseEntity<List<VehicleDto>> getAllNotAssignedVehicle() {
        return ResponseEntity.ok(vehicleService.getAllNotAssignedVehicle());
    }

    @PostMapping("/add-vehicle-attachments/{id}/{attachmentType}")
    public ResponseEntity<ResponseMessage> addAttachments(@PathVariable Long id, @PathVariable String attachmentType, @RequestParam("file") MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(vehicleService.addAttachment(id, attachmentType, multipartFile));
    }

    @GetMapping("/vehicle-download/{fileName}")
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

    @GetMapping("/vehicle-available-for-replacement")
    public ResponseEntity<List<VehicleDto>> availableForReplacement() {
        return ResponseEntity.ok(vehicleService.availableForReplacement());
    }

    @GetMapping("/vehicle-history/{id}")
    public ResponseEntity<List<VehicleHistoryResponse>> getVehicleHistoryById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleHistoryById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicle-inactive")
    public ResponseEntity<Page<VehicleDto>> searchInactiveVehicles(@RequestParam(value = "value", required = false) String value,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchInactiveVehicles(vehicleSearchCriteria, page, size));
    }

    @GetMapping("/vehicles-under-driver-budget/{value}")
    public ResponseEntity<List<VehicleDto>> getAllVehiclesUnderDriverVehicleBudget(@PathVariable("value") Integer value) {
        return ResponseEntity.ok(vehicleService.getAllVehiclesUnderDriverVehicleBudget(value));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-all-vehicle")
    public ResponseEntity<Page<VehicleDto>> searchAllVehicles(@RequestParam(value = "value", required = false) String value,
                                                              @RequestParam String vehicleStatus,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicle(vehicleSearchCriteria, vehicleStatus, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicles-by-vendor")
    public ResponseEntity<Page<VehicleDto>> searchAllVehiclesByVendor(@RequestParam(value = "value", required = false) String value,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicleByVendor(vehicleSearchCriteria, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicles-by-region")
    public ResponseEntity<Page<VehicleDto>> searchAllVehiclesByRegion(@RequestParam(value = "value", required = false) String value,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicleByRegion(vehicleSearchCriteria, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicles-by-usage-type")
    public ResponseEntity<Page<VehicleDto>> searchAllVehiclesByUsageType(@RequestParam(value = "value", required = false) String value,
                                                                         @RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleService.searchVehicleByUsageType(vehicleSearchCriteria, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-vehicles-by-lease-expiry")
    public ResponseEntity<Page<VehicleDto>> searchAllVehiclesByLeaseExpiry(@RequestParam(required = false) Date leaseStartDate,
                                                                           @RequestParam(required = false) Date leaseExpiryDate,
                                                                           @RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {

        return ResponseEntity.ok(vehicleService.searchVehicleByLeaseExpiry(leaseStartDate, leaseExpiryDate, page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/delete-replacement-vehicle/{id}")
    public ResponseEntity<VehicleDto> deleteReplacementVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.deleteReplacementVehicle(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/find-replacement-vehicle/{id}")
    public ResponseEntity<VehicleDto> findReplacementVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findReplacementVehicleById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/replacement-vehicle-action/{id}")
    public ResponseEntity<VehicleDto> replacementVehicleAction(@PathVariable Long id,
                                                               @RequestBody ReplacementActionRequest replacementActionRequest) {
        return ResponseEntity.ok(vehicleService.replacementVehicleAction(id, replacementActionRequest));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/mark-total-lost/{id}")
    public ResponseEntity<VehicleDto> markVehicleTotalLost(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.markVehicleTotalLost(id));
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/download-vehicle-excel")
//    public ResponseEntity<byte[]> downloadVehicleExcel() {
//
//        byte[] excelBytes = vehicleService.downloadExcel();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//        headers.setContentDispositionFormData("attachment", "vehicles.xlsx");
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(excelBytes);
//
//    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/download-vehicle-excel")
    public ResponseEntity<byte[]> downloadVehicleExcel(@RequestBody List<VehicleDto> vehicleDtoList) {
        byte[] excelBytes = vehicleService.downloadExcel(vehicleDtoList);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "vehicles.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/dynamic-search")
    public ResponseEntity<List<Vehicle>> search(@RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.ok(vehicleService.getVehicleBySearch(vehicleDto));
    }
}
