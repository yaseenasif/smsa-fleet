package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;

public class UserSpecification {

    public static Specification<User> getUserSpecification(VehicleSearchCriteria searchCriteria) {

        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.isTrue(root.get("status"));

            if (searchCriteria != null && searchCriteria.getValue() != null && !searchCriteria.getValue().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeId")),
                                "%" + searchCriteria.getValue().toLowerCase() + "%"));
            }

            query.orderBy(criteriaBuilder.desc(root.get("employeeId")));
            return predicate;
        };
    }

}
