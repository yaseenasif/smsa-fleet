package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.VehicleAssignmentDto;
//import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class VehicleAssignmentSpecification {

    public static Specification<VehicleAssignment> getSearchSpecificationByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria) {

        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("status")));
            }
            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");
            if (!"Replacement".equals(vehicleSearchCriteria.getValue()) && !"Active".equals(vehicleSearchCriteria.getValue())) {
                // Adjust the field name based on your entity
                return criteriaBuilder.and
                        (criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("plateNumber")),
                                "%" + vehicleSearchCriteria
                                        .getValue().toLowerCase() + "%"), criteriaBuilder.isTrue(root.get("status")));
            } else {
                return criteriaBuilder.and(
                        criteriaBuilder.equal(criteriaBuilder.lower(vehicleJoin.get("vehicleStatus")),
                                vehicleSearchCriteria.getValue().toLowerCase()),
                        criteriaBuilder.isTrue(root.get("status")));
            }
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
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.isFalse(root.get("status")));
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
                            "%" + employeeSearchCriteria.getValue() + "%"), criteriaBuilder.isTrue(root.get("status")));
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
                            "%" + employeeSearchCriteria.getValue() + "%"), criteriaBuilder.isTrue(root.get("status")));
        };
    }

    public static Specification<VehicleAssignment> getSearchSpecificationByRegion(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.equal(root.get("vehicleStatus"), vehicleStatus));
            }

            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");
            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(vehicleJoin.get("region")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.equal(vehicleJoin.get("vehicleStatus"), vehicleStatus));
        };
    }

    public static Specification<VehicleAssignment> getSearchSpecificationByDepartment(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.equal(root.get("vehicleStatus"), vehicleStatus));
            }

            Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");
            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(employeeJoin.get("department")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.equal(vehicleJoin.get("vehicleStatus"), vehicleStatus));
        };
    }

    public static Specification<VehicleAssignment> getSearchSpecificationBySection(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.equal(root.get("vehicleStatus"), vehicleStatus));
            }

            Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");
            Join<VehicleAssignment, Vehicle> vehicleJoin = root.join("vehicle");

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(employeeJoin.get("section")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.equal(vehicleJoin.get("vehicleStatus"), vehicleStatus));
        };
    }

    public static Specification<VehicleAssignment> getSearchSpecificationByCriteria(VehicleAssignmentDto searchCriteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchCriteria.getAssignToEmpId().getRegion() != null) {
                Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");
                predicates.add(criteriaBuilder.like(employeeJoin.get("region"), "%" + searchCriteria.getAssignToEmpId().getRegion() + "%"));
            }

            if (searchCriteria.getAssignToEmpId().getDepartment() != null) {
                Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");
                predicates.add(criteriaBuilder.like(employeeJoin.get("department"), "%" + searchCriteria.getAssignToEmpId().getDepartment() + "%"));
            }

            if (searchCriteria.getAssignToEmpId().getSection() != null) {
                Join<VehicleAssignment, Employee> employeeJoin = root.join("assignToEmpId");
                predicates.add(criteriaBuilder.like(employeeJoin.get("section"), "%" + searchCriteria.getAssignToEmpId().getSection() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
