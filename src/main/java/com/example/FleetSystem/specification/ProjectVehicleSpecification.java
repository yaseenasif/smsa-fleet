package com.example.FleetSystem.specification;

import com.example.FleetSystem.model.*;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;

public class ProjectVehicleSpecification {
    public static Specification<ProjectVehicleValues> getSearchSpecificationByCriteria(Long projectVehicleId, ProjectVehicleValues projectVehicleValues) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (projectVehicleId != null) {
                Join<ProjectVehicleValues, ProjectVehicle> projectVehicleJoin = root.join("projectVehicle");
                predicate = criteriaBuilder.and(
                        predicate, criteriaBuilder.equal(
                                projectVehicleJoin.get("id"),
                                projectVehicleId)
                );
            }

            if (projectVehicleValues.getRentalDate() != null) {
                predicate = criteriaBuilder.and(
                        predicate, criteriaBuilder.equal(
                                root.get("rentalDate"),
                                projectVehicleValues.getRentalDate())
                );
            }

            if (projectVehicleValues.getStartLease() != null && projectVehicleValues.getExpiryLease() != null) {
                predicate = criteriaBuilder.and(
                        predicate, criteriaBuilder.between(
                                root.get("startLease"),
                                projectVehicleValues.getStartLease(),
                                projectVehicleValues.getExpiryLease())
                );
            }

            return predicate;
        };
    }
}