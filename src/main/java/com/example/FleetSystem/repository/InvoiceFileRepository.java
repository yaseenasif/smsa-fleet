package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.InvoiceFile;
import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceFileRepository extends JpaRepository <InvoiceFile, Long> , JpaSpecificationExecutor<InvoiceFile> {
    InvoiceFile findByFileName(String fileName);
}
