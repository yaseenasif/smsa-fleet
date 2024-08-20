package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.model.InvoiceFile;
import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {


    List<Invoice> findByInvoiceFile(InvoiceFile invoiceFile);

    List<Invoice> findByInvoiceFileAndSupplier(InvoiceFile fileId, Vendor supplier);
}
