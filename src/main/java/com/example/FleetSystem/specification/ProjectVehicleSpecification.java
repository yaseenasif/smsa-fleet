package com.example.FleetSystem.specification;

import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.model.*;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;

public class ProjectVehicleSpecification {
    public static Specification<ProjectVehicleValues> getSearchSpecificationByCriteria(Long projectVehicleId, ProjectVehicleValuesDto projectVehicleValuesDto) {
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

            if (projectVehicleValuesDto.getRentalDate() != null) {
                predicate = criteriaBuilder.and(
                        predicate, criteriaBuilder.between(
                                root.get("rentalDate"),
                                projectVehicleValuesDto.getRentalDate(),
                                projectVehicleValuesDto.getRentalDateTo())
                );
            }

            if (projectVehicleValuesDto.getStartLease() != null && projectVehicleValuesDto.getExpiryLease() != null) {
                predicate = criteriaBuilder.and(
                        predicate, criteriaBuilder.between(
                                root.get("startLease"),
                                projectVehicleValuesDto.getStartLease(),
                                projectVehicleValuesDto.getExpiryLease())
                );
            }

            return predicate;
        };
    }
}