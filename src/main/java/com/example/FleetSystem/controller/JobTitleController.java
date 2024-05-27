package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.JobTitleDto;
import com.example.FleetSystem.model.JobTitle;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.service.JobTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JobTitleController {

    @Autowired
    JobTitleService jobTitleService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PostMapping("/add-job-title")
    public ResponseEntity<JobTitleDto> addJobTitle(@RequestBody JobTitleDto jobTitleDto) {
        return ResponseEntity.ok(jobTitleService.addJobTitle(jobTitleDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/get-all-job-title")
    public ResponseEntity<List<JobTitleDto>> getAllJobTitles() {
        return ResponseEntity.ok(jobTitleService.getAllJobTitles());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/job-title/{id}")
    public ResponseEntity<JobTitleDto> getJobTitleById(@PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.getJobTitleById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PutMapping("/update-job-title/{id}")
    public ResponseEntity<JobTitleDto> updateJobTitleById(@RequestBody JobTitleDto jobTitleDto, @PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.updateJobTitleById(jobTitleDto, id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @DeleteMapping("/delete-job-title/{id}")
    public ResponseEntity<JobTitleDto> deleteJobTitle(@PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.deleteJobTitle(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PostMapping("/add-bulk-jobTitle")
    public ResponseEntity<ResponseMessage> addBulkJobTitle(@RequestParam("file") MultipartFile file){
        return ResponseEntity.ok(new ResponseMessage(jobTitleService.addBulkJobTitles(file)));
    }

}
