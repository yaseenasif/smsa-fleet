package com.example.FleetSystem.specification;

import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProjectVehicleSpecification {
    public static Specification<ProjectVehicleValues> getSearchSpecificationByCriteria(Long projectVehicleId, ProjectVehicleValues projectVehicleValues) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (projectVehicleId != null) {
                Join<ProjectVehicleValues, ProjectVehicle> projectVehicleJoin = root.join("projectVehicle", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(projectVehicleJoin.get("id"), projectVehicleId));
            }

            if (projectVehicleValues.getRentalDate() != null) {
                predicates.add(criteriaBuilder.equal(root.get("rentalDate"), projectVehicleValues.getRentalDate()));
            }

            if (projectVehicleValues.getStartLease() != null && projectVehicleValues.getExpiryLease() != null) {
                predicates.add(criteriaBuilder.between(root.get("startLease"), projectVehicleValues.getStartLease(), projectVehicleValues.getExpiryLease()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}