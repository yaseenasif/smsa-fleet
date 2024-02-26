package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.JobTitleDto;
import com.example.FleetSystem.model.JobTitle;
import com.example.FleetSystem.service.JobTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JobTitleController {

    @Autowired
    JobTitleService jobTitleService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-job-title")
    public ResponseEntity<JobTitleDto> addJobTitle(@RequestBody JobTitleDto jobTitleDto) {
        return ResponseEntity.ok(jobTitleService.addJobTitle(jobTitleDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-all-job-title")
    public ResponseEntity<List<JobTitleDto>> getAllJobTitles() {
        return ResponseEntity.ok(jobTitleService.getAllJobTitles());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/job-title/{id}")
    public ResponseEntity<JobTitleDto> getJobTitleById(@PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.getJobTitleById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update-job-title/{id}")
    public ResponseEntity<JobTitleDto> updateJobTitleById(@RequestBody JobTitleDto jobTitleDto, @PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.updateJobTitleById(jobTitleDto, id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-job-title/{id}")
    public ResponseEntity<JobTitleDto> deleteJobTitle(@PathVariable Long id) {
        return ResponseEntity.ok(jobTitleService.deleteJobTitle(id));
    }
}
