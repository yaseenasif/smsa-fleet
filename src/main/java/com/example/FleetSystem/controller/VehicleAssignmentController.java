package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.DriverDto;
import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.StorageService;
import com.example.FleetSystem.service.VehicleAssignmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VehicleAssignmentController {

    @Autowired
    VehicleAssignmentService vehicleAssignmentService;

    @Autowired
    StorageService storageService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-vehicle-assignment")
    public ResponseEntity<VehicleAssignmentDto> saveVehicleAssignment(@RequestBody VehicleAssignmentDto vehicleAssignmentDto) {
        return ResponseEntity.ok(vehicleAssignmentService.save(vehicleAssignmentDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment")
    public ResponseEntity<List<VehicleAssignmentDto>> getAll() {
        return ResponseEntity.ok(vehicleAssignmentService.getActiveVehicleAssignment());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment/{id}")
    public ResponseEntity<VehicleAssignmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleAssignmentService.getById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/vehicle-assignment/{id}")
    public ResponseEntity<ResponseMessage> deleteVehicleAssignmentById(@PathVariable Long id) {
        vehicleAssignmentService.deleteVehicleAssignmentById(id);
        return ResponseEntity.ok(new ResponseMessage(Arrays.asList("Record deleted Successfully")));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/vehicle-assignment/{id}")
    public ResponseEntity<VehicleAssignmentDto> updateVehicleAssignmentById(@PathVariable Long id, @RequestBody VehicleAssignmentDto vehicleAssignmentDto) {
        return ResponseEntity.ok(vehicleAssignmentService.updateById(id, vehicleAssignmentDto));
    }

//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PatchMapping("/vehicle-assignment-active/{id}")
//    public ResponseEntity<VehicleAssignmentDto> makeVehicleAssignmentActive(@PathVariable Long id) {
//        return ResponseEntity.ok(vehicleAssignmentService.makeVehicleAssignmentActive(id));
//    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/vehicle-assignment-plateNumber/{plateNumber}")
    public ResponseEntity<VehicleAssignmentDto> getByPlateNumber(@PathVariable String plateNumber){
        return ResponseEntity.ok(vehicleAssignmentService.getByPlateNumber(plateNumber));
    }

    @PostMapping("/add-vehicle-assignment-attachments/{id}/{attachmentType}")
    public ResponseEntity<ResponseMessage> addAttachments(@PathVariable Long id, @PathVariable String attachmentType, @RequestParam("file") MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(vehicleAssignmentService.addAttachment(id, attachmentType, multipartFile));
    }

    @GetMapping("/vehicle-assignment-download/{fileName}")
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
    @GetMapping("/search-assignment")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchAssignmentByPlateNumber(@RequestParam(value = "value",required = false) String value,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleAssignmentService.searchAssignmentByPlateNumber(vehicleSearchCriteria,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-by-region")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchAssignmentByRegion(@RequestParam(value = "value",required = false) String value,
                                                                                    @RequestParam String vehicleStatus,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleAssignmentService.searchAssignmentByRegion(vehicleSearchCriteria,vehicleStatus,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-by-department")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchAssignmentByDepartment(@RequestParam(value = "value",required = false) String value,
                                                                               @RequestParam String vehicleStatus,
                                                                               @RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleAssignmentService.searchAssignmentByDepartment(vehicleSearchCriteria,vehicleStatus,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-by-section")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchAssignmentBySection(@RequestParam(value = "value",required = false) String value,
                                                                                   @RequestParam String vehicleStatus,
                                                                                   @RequestParam(defaultValue = "0") int page,
                                                                                   @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleAssignmentService.searchAssignmentBySection(vehicleSearchCriteria,vehicleStatus,page, size));
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-inactive")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchInactiveAssignmentByPlateNumber(@RequestParam(value = "value",required = false) String value,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        VehicleSearchCriteria vehicleSearchCriteria = new ObjectMapper().readValue(value, VehicleSearchCriteria.class);
        return ResponseEntity.ok(vehicleAssignmentService.searchInactiveAssignmentByPlateNumber(vehicleSearchCriteria,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-empno")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchAssignmentByEmployeeNumber(@RequestParam(value = "value",required = false) String value,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        EmployeeSearchCriteria employeeSearchCriteria = new ObjectMapper().readValue(value, EmployeeSearchCriteria.class);

        return ResponseEntity.ok(vehicleAssignmentService.searchAssignmentByEmployeeNumber(employeeSearchCriteria,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-assignment-empno-inactive")
    public ResponseEntity<Page<VehicleAssignmentDto>> searchInactiveAssignmentByEmployeeNumber(@RequestParam(value = "value",required = false) Long value,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int size) throws JsonProcessingException {
        EmployeeSearchCriteria employeeSearchCriteria = new EmployeeSearchCriteria();
        employeeSearchCriteria.setValue(value);
        return ResponseEntity.ok(vehicleAssignmentService.searchInactiveAssignmentByEmployeeNumber(employeeSearchCriteria,page, size));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-by-vehicleId/{id}")
    public ResponseEntity<VehicleAssignmentDto> getByVehicleId(@PathVariable Long id){
        return ResponseEntity.ok(vehicleAssignmentService.getByVehicleId(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-last-assignment/{id}")
    public ResponseEntity<Employee> getLastAssignmentByVehicleId(@PathVariable Long id){
        return ResponseEntity.ok(vehicleAssignmentService.getLastAssignmentByVehicleId(id));
    }
}
