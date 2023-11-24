package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Employee;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;

public class DriverSpecification {

    public static Specification<Driver> getSearchSpecification(EmployeeSearchCriteria employeeSearchCriteria) {


        return (root, query, criteriaBuilder) -> {
            if (employeeSearchCriteria == null || employeeSearchCriteria.getValue() == null) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("status")));
            }

            // Join the Driver entity with the Employee entity
            Join<Driver, Employee> employeeJoin = root.join("empId");

            // Use criteriaBuilder.like for partial matching
            return criteriaBuilder.and(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(employeeJoin.get("employeeNumber").as(String.class)),
                            "%" + employeeSearchCriteria.getValue() + "%"
                    ),
                    criteriaBuilder.isTrue(root.get("status"))
            );
        };
    }
}
