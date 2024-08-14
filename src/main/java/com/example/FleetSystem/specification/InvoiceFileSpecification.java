package com.example.FleetSystem.specification;

import com.example.FleetSystem.model.InvoiceFile;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.YearMonth;

public class InvoiceFileSpecification {
    public static Specification<InvoiceFile> getSearchSpecification(String invoiceType, YearMonth invoiceMonth) {
        return (Root<InvoiceFile> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (invoiceMonth != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceMonth"), invoiceMonth));
            }

            if (invoiceType != null && !invoiceType.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("invoiceType"), invoiceType));
            }

            return predicate;
        };
    }
}
