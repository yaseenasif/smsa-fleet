package com.example.FleetSystem.repository;

import com.example.FleetSystem.dto.GradeDto;
import com.example.FleetSystem.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade,Long> {
    @Query("SELECT g FROM Grade g WHERE g.status = true")
    List<Grade> getActiveGrades();
}
