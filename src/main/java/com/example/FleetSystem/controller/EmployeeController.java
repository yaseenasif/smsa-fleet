package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.dto.ProductFieldDto;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.EmployeeService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.FleetSystem.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EmployeeController {


    @Autowired
    EmployeeService employeeService;

    @Autowired
    StorageService storageService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-employee")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.save(employeeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-employee")
    public ResponseEntity<List<EmployeeDto>> getAllEmployee() {
        return ResponseEntity.ok(employeeService.getAll());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/employee/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.findById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-employee/{id}")
    public ResponseEntity<EmployeeDto> updateEmployeeById(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id,employeeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/delete-employee/{id}")
    public ResponseEntity<EmployeeDto> deleteEmployeeById(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.deleteEmployeeById(id,employeeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/employee-active/{id}")
    public ResponseEntity<EmployeeDto> makeEmployeeActive(@PathVariable Long id){
        return ResponseEntity.ok(employeeService.makeEmployeeActive(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-bulk-employee")
    public ResponseEntity<ResponseMessage> addBulkEmployee(@RequestParam("file") MultipartFile file){
        return ResponseEntity.ok(new ResponseMessage(employeeService.addBulkEmployee(file)));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-unassigned-employee")
    public ResponseEntity<List<EmployeeDto>> getAllUnAssignedEmployee(){
        return ResponseEntity.ok(employeeService.getAllUnAssignedEmployee());
    }

    @PostMapping("/add-attachments/{id}/{attachmentType}")
    public ResponseEntity<ResponseMessage> addAttachments(@PathVariable Long id, @PathVariable String attachmentType, @RequestParam("file") MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(employeeService.addAttachment(id, attachmentType, multipartFile));
    }

    @DeleteMapping("/delete-attachment/{id}")
    public ResponseEntity<ResponseMessage> deleteAttachment(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.deleteAttachment(id));
    }

    @GetMapping("/download/{fileName}")
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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-employee")
    public ResponseEntity<Page<EmployeeDto>> searchEmployee(@RequestParam(value = "value",required = false) Long value,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
        employeeSearchCriteria.setValue(value);
        return ResponseEntity.ok(employeeService.   searchEmployee(employeeSearchCriteria,page, size));
    }
}
