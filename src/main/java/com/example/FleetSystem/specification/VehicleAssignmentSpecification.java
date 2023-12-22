package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;

public class VehicleAssignmentSpecification {

    public static Specification<VehicleAssignment> getSearchSpecificationByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("status")));
            }

            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"),criteriaBuilder.isTrue(root.get("status")));
        };
    }

    public static Specification<VehicleAssignment> getInactiveSearchSpecificationByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isFalse(root.get("status")));
            }

            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");

            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"),criteriaBuilder.isFalse(root.get("status")));
        };
    }

    public static Specification<VehicleAssignment> getSearchSpecificationByEmployeeNumber(EmployeeSearchCriteria employeeSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (employeeSearchCriteria == null || employeeSearchCriteria.getValue() == null) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("status")));
            }

            Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");

            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(employeeJoin.get("employeeNumber").as(String.class)),
                            "%" + employeeSearchCriteria.getValue() + "%"),criteriaBuilder.isTrue(root.get("status")));
        };
    }

    public static Specification<VehicleAssignment> getInactiveSearchSpecificationByEmployeeNumber(EmployeeSearchCriteria employeeSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (employeeSearchCriteria == null || employeeSearchCriteria.getValue() == null) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isFalse(root.get("status")));
            }

            Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");

            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(employeeJoin.get("employeeNumber").as(String.class)),
                            "%" + employeeSearchCriteria.getValue() + "%"),criteriaBuilder.isTrue(root.get("status")));
        };
    }
}
