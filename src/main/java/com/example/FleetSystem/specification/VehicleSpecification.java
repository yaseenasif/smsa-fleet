package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;


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

    public static Specification<Vehicle> getUnassignedVehiclesSpecification(VehicleSearchCriteria vehicleSearchCriteria) {
        return (root, query, criteriaBuilder) -> {
            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle_id", JoinType.LEFT);

            Predicate unassignedPredicate = criteriaBuilder.isNull(root.get("vehicle"));
            Predicate statusPredicate = criteriaBuilder.isTrue(vehicleJoin.get("status"));

            Predicate searchPredicate;
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria.getValue().isEmpty()) {
                searchPredicate = criteriaBuilder.isTrue(vehicleJoin.get("status"));
            } else {
                searchPredicate = criteriaBuilder.and(
                        criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("plateNumber")),
                                "%" + vehicleSearchCriteria.getValue().toLowerCase() + "%"),
                        criteriaBuilder.isTrue(vehicleJoin.get("status"))
                );
            }

            query.distinct(true); // To eliminate duplicates caused by the left join

            Predicate finalPredicate = criteriaBuilder.and(unassignedPredicate, statusPredicate, searchPredicate);
            query.where(finalPredicate);

            return finalPredicate; // Return the Predicate
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
