package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.FileHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileHistoryRepository extends JpaRepository<FileHistory,Long> {
    FileHistory findByFileName(String fileName);
}
