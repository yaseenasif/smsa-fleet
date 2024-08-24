package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.InvoiceSearchCriteria;
import com.example.FleetSystem.model.Invoice;
import com.example.FleetSystem.model.InvoiceFile;
import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.time.YearMonth;

public class InvoiceSpecification {
    public static Specification<Invoice> getSearchSpecificationByFields(String invoiceType, String invoiceCategory, YearMonth invoiceMonth, String supplierName, String invoiceNumber) {
        return (Root<Invoice> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (invoiceMonth != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceMonth"), invoiceMonth));
            }

            if (invoiceType != null && !invoiceType.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceType"), invoiceType));
            }

            if (invoiceCategory != null && !invoiceCategory.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceCategory"), invoiceCategory));
            }

            if (supplierName != null && !supplierName.isEmpty()) {

                Join<Invoice, Vendor> vendorJoin = root.join("supplier");
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(vendorJoin.get("vendorName"), supplierName));
            }

            if (invoiceNumber != null && !invoiceNumber.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceNumber"), invoiceNumber));
            }

            return predicate;
        };
    }
}
