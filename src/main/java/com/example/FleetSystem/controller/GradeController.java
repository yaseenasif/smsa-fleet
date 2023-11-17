package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.GradeDto;
import com.example.FleetSystem.model.Grade;
import com.example.FleetSystem.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GradeController {

    @Autowired
    GradeService gradeService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/addGrade")
    public ResponseEntity<GradeDto> addGrade(@RequestBody GradeDto gradeDto){
        return ResponseEntity.ok(gradeService.addGrade(gradeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-active-grades")
    public ResponseEntity<List<GradeDto>> getActiveGrades(){
        return ResponseEntity.ok(gradeService.getActiveGrades());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-grade/{id}")
    public ResponseEntity<GradeDto> getGradesById(@PathVariable Long id){
        return ResponseEntity.ok(gradeService.getById(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/update-grade/{id}")
    public ResponseEntity<GradeDto> updateGradeById(@PathVariable Long id, @RequestBody GradeDto gradeDto){
        return ResponseEntity.ok(gradeService.updateGradeById(id,gradeDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-grade/{id}")
    public ResponseEntity<GradeDto> deleteGradeById(@PathVariable Long id){
        return ResponseEntity.ok(gradeService.deleteById(id));
    }
}
