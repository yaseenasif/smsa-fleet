//package com.example.FleetSystem.controller;
//
//import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
//import com.example.FleetSystem.dto.DriverDto;
//import com.example.FleetSystem.dto.EmployeeDto;
//import com.example.FleetSystem.model.Driver;
//import com.example.FleetSystem.payload.ResponseMessage;
//import com.example.FleetSystem.service.DriverService;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.example.FleetSystem.service.StorageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.core.io.ByteArrayResource;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api")
//public class DriverController {
//
//    @Autowired
//    DriverService driverService;
//
//    @Autowired
//    StorageService storageService;
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PostMapping("/driver")
//    public ResponseEntity<DriverDto> addDriver(@RequestBody DriverDto driverDto){
//        return ResponseEntity.ok(driverService.addDriver(driverDto));
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/driver")
//    public ResponseEntity<List<DriverDto>> getAll(){
//        return ResponseEntity.ok(driverService.getActiveDrivers());
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/driver/{id}")
//    public ResponseEntity<DriverDto> getById(@PathVariable Long id){
//        return ResponseEntity.ok(driverService.getById(id));
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @DeleteMapping("/driver/{id}")
//    public ResponseEntity<DriverDto> deleteDriverById(@PathVariable Long id){
//        return ResponseEntity.ok(driverService.deleteDriverById(id));
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PatchMapping("/driver/{id}")
//    public ResponseEntity<DriverDto> updateDriverById(@PathVariable Long id,@RequestParam String plateNumber,
//                                                      @RequestBody DriverDto driverDto){
//        return  ResponseEntity.ok(driverService.updateById(id,plateNumber, driverDto));
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PatchMapping("/driver-active/{id}")
//    public ResponseEntity<DriverDto> makeDriverActive(@PathVariable Long id){
//        return ResponseEntity.ok(driverService.makeDriverActive(id));
//    }
//
//    @PostMapping("/add-driver-attachments/{id}/{attachmentType}")
//    public ResponseEntity<ResponseMessage> addAttachments(@PathVariable Long id, @PathVariable String attachmentType, @RequestParam("file") MultipartFile multipartFile) throws IOException {
//        return ResponseEntity.ok(driverService.addAttachment(id, attachmentType, multipartFile));
//    }
//
//    @GetMapping("/driver-download/{fileName}")
//    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
//        byte[] data = storageService.downloadFile(fileName);
//        ByteArrayResource resource = new ByteArrayResource(data);
//        return ResponseEntity
//                .ok()
//                .contentLength(data.length)
//                .header("Content-type", "application/octet-stream")
//                .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
//                .body(resource);
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/search-driver")
//    public ResponseEntity<Page<DriverDto>> searchDriver(@RequestParam(value = "value",required = false) Long value,
//                                                            @RequestParam(defaultValue = "0") int page,
//                                                            @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
//        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
//        employeeSearchCriteria.setValue(value);
//        return ResponseEntity.ok(driverService.searchDriver(employeeSearchCriteria,page, size));
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/unassigned-drivers")
//    public ResponseEntity<List<DriverDto>> getUnassignedDrivers(){
//        return ResponseEntity.ok(driverService.getUnassignedDrivers());
//    }
//
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @GetMapping("/search-driver-inactive")
//    public ResponseEntity<Page<DriverDto>> searchInactiveDriver(@RequestParam(value = "value",required = false) Long value,
//                                                        @RequestParam(defaultValue = "0") int page,
//                                                        @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
//        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
//        employeeSearchCriteria.setValue(value);
//        return ResponseEntity.ok(driverService.searchInactiveDriver(employeeSearchCriteria,page, size));
//    }
//}
