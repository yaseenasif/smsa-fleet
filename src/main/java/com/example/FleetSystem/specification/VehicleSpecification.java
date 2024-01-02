package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;


public class VehicleSpecification {
    public static Specification<Vehicle> getSearchSpecification(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("status")));
            }

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.isTrue(root.get("status")));
        };
    }

    public static Specification<Vehicle> getUnassignedVehicles(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            Join<Vehicle, VehicleAssignment> vehicleAssignmentJoin = root.join("id", JoinType.LEFT);

            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return  criteriaBuilder.and(
                        criteriaBuilder.or(
                                criteriaBuilder.isNull(vehicleAssignmentJoin.get("vehicle")),
                                criteriaBuilder.isFalse(vehicleAssignmentJoin.get("status"))
                        ),
                        criteriaBuilder.isTrue(root.get("status")));
            }

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.isTrue(root.get("status")));
        };
    }



    public static Specification<Vehicle> getInactiveSearchSpecification(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isFalse(root.get("status")));
            }

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.isFalse(root.get("status")));
        };
    }
}
