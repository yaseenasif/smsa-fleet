package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


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
                return criteriaBuilder.and(
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

    public static Specification<Vehicle> getVehicleSearchSpecification(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus) {

        return (root, query, criteriaBuilder) -> {
            if ((vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) &&
                    !"All".equals(vehicleStatus)) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.and(criteriaBuilder.equal(root.get("vehicleStatus"), vehicleStatus));
            } else if ("All".equalsIgnoreCase(vehicleStatus)) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return null;
            }

            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("plateNumber")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"), criteriaBuilder.equal(root.get("vehicleStatus"), vehicleStatus));
        };
    }


    public static Specification<Vehicle> getVehicleSearchSpecificationByVendor(VehicleSearchCriteria vehicleSearchCriteria) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.conjunction();
            }
            Join<Vehicle, Vendor> vendorJoin = root.join("vendor");
            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(vendorJoin.get("vendorName")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"));
        };
    }

    public static Specification<Vehicle> getVehicleSearchSpecificationByRegion(VehicleSearchCriteria vehicleSearchCriteria) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.conjunction();
            }
            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("region")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"));
        };
    }

    public static Specification<Vehicle> getVehicleSearchSpecificationByUsageType(VehicleSearchCriteria vehicleSearchCriteria) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.conjunction();
            }
            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("usageType")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"));
        };
    }

    public static Specification<Vehicle> getVehicleSearchSpecificationByLeaseExpiry(
            VehicleSearchCriteria vehicleSearchCriteria, Date leaseStartDate, Date leaseExpiryDate
    ) {
        return (root, query, criteriaBuilder) -> {
            if (vehicleSearchCriteria == null || vehicleSearchCriteria.getValue() == null || vehicleSearchCriteria
                    .getValue().isEmpty()) {
                query.orderBy(criteriaBuilder.desc(root.get("id")));
                return criteriaBuilder.conjunction();
            }

            if(Objects.nonNull(leaseStartDate) && Objects.nonNull(leaseExpiryDate)) {
                return criteriaBuilder.and(
                        criteriaBuilder.between(root.get("leaseStartDate"), leaseStartDate, leaseExpiryDate)
                );
            }

            if (Objects.nonNull(leaseStartDate)) {
                return criteriaBuilder.and(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("leaseStartDate"), leaseStartDate)
                );
            }

            if (Objects.nonNull(leaseExpiryDate)) {
                return criteriaBuilder.and(
                        criteriaBuilder.lessThanOrEqualTo(root.get("leaseExpiryDate"), leaseExpiryDate)
                );
            }
            // Adjust the field name based on your entity
            return criteriaBuilder.and
                    (criteriaBuilder.like(criteriaBuilder.lower(root.get("leaseExpiry")),
                            "%" + vehicleSearchCriteria
                                    .getValue().toLowerCase() + "%"));
        };
    }
}
