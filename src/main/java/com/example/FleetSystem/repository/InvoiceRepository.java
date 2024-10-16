package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.model.InvoiceFile;
import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {

    List<Invoice> findByInvoiceFile(InvoiceFile invoiceFile);

    List<Invoice> findByInvoiceFileAndSupplier(InvoiceFile fileId, Vendor supplier);

    List<Invoice> findBySupplierAndInvoiceMonthAndInvoiceCategory(Vendor supplier, YearMonth invoiceMonth, String invoiceCategory);

    List<Invoice> findByApprovalStatus(String approvalStatus);
}
