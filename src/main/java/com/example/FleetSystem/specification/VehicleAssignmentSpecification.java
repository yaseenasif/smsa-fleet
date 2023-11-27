package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;

public class VehicleAssignmentSpecification {

    public static Specification<VehicleAssignment> getSearchSpecification(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.conjunction();
            }

            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"));
        };
    }
}
