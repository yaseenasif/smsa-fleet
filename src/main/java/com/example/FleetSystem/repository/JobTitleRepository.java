package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobTitleRepository extends JpaRepository<JobTitle, Long> {
    @Query("SELECT jt FROM JobTitle jt WHERE jt.status = true")
    List<JobTitle> getActiveJobTitles();
}
