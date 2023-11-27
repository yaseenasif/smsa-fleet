package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.model.Employee;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {
        public static Specification<Employee>getSearchSpecification(EmployeeSearchCriteria employeeSearchCriteria) {


            return (root, query, criteriaBuilder) -> {
                if (employeeSearchCriteria == null || employeeSearchCriteria.getValue() == null) {
                    query.orderBy(criteriaBuilder.desc(root.get("id")));
                    return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("deleteStatus")));
                }


                return criteriaBuilder.and
                        (criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeNumber").as(String.class)),
                                "%" + employeeSearchCriteria.getValue() + "%"),criteriaBuilder.isTrue(root.get("deleteStatus")));
            };
        }
}
