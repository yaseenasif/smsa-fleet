package com.example.FleetSystem.specification;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.model.Vendor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;


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

            if (Objects.nonNull(leaseStartDate) && Objects.nonNull(leaseExpiryDate)) {
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

    public static Specification<Vehicle> getWithDynamicSearchSpecification(Vehicle vehicle, String stringifyPoNumbers) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addBetweenPredicateIfNotNull(predicates, criteriaBuilder, root.get("leaseExpiryDate"), vehicle.getLeaseStartDate(), vehicle.getLeaseExpiryDate());
            addLikePredicateIfNotNull(predicates, criteriaBuilder, root.get("processOrderNumber"), stringifyPoNumbers, Integer.class);
            addLikePredicateIfNotNull(predicates, criteriaBuilder, root.join("vendor").get("vendorName"), vehicle.getVendor().getVendorName(), String.class);
            addLikePredicateIfNotNull(predicates, criteriaBuilder, root.get("usageType"), vehicle.getUsageType(), String.class);
            addLikePredicateIfNotNull(predicates, criteriaBuilder, root.get("region"), vehicle.getRegion(), String.class);
            addLikePredicateIfNotNull(predicates, criteriaBuilder, root.get("vehicleStatus"), vehicle.getVehicleStatus(), String.class);

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addBetweenPredicateIfNotNull(List<Predicate> predicates, CriteriaBuilder criteriaBuilder, Path<Date> path, Date startDate, Date endDate) {
        if (startDate != null && endDate != null) {
            predicates.add(criteriaBuilder.between(path, startDate, endDate));
        }
    }

    private static <T> void addLikePredicateIfNotNull(List<Predicate> predicates, CriteriaBuilder criteriaBuilder, Path<? extends String> path, String valueJson, Class<T> valueType) {
        if (valueJson == null || valueJson.isEmpty() || valueJson.equalsIgnoreCase("[]")) {
            return;
        }
        try {
            // Deserialize the JSON string into a list of values
            List<T> values = deserializeList(valueJson, valueType);
            // Create a list to store individual like predicates
            List<Predicate> likePredicates = new ArrayList<>();
            for (T value : values) {
                Expression<String> columnValueLower = criteriaBuilder.lower(path.as(String.class));
                Predicate likePredicate = criteriaBuilder.equal(columnValueLower, value.toString().toLowerCase());
                likePredicates.add(likePredicate);
            }
    private static void addLikePredicateIfNotNull(List<Predicate> predicates, CriteriaBuilder criteriaBuilder, Path<String> path, String valueJson) {
        if (valueJson != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                List<String> values = objectMapper.readValue(
                        valueJson,
                        new TypeReference<List<String>>() {
                        }
                );

                List<Predicate> likePredicates = new ArrayList<>();

                for (String value : values) {
                    if (value != null) {
                        // Convert both the column value and the search value to lowercase
                        Expression<String> columnValueLower = criteriaBuilder.lower(path);
                        String searchValueLower = value.toLowerCase();

                        // Create a like predicate for the lowercase values and add it to the list
                        Predicate likePredicate = criteriaBuilder.equal(columnValueLower, searchValueLower);
                        likePredicates.add(likePredicate);
                    }
                }

            // Combine all the like predicates using 'or' instead of 'and'
            Predicate combinedPredicate = criteriaBuilder.or(likePredicates.toArray(new Predicate[0]));
            predicates.add(combinedPredicate);
        } catch (IOException e) {
            throw new RuntimeException(String.format("Error parsing JSON: %s", valueJson), e);
            // Old logging statement
            // Logger.getLogger(Vehicle.class.getName()).log(Level.SEVERE, "" + valueJson, e);

        }
    }


    private static <T> List<T> deserializeList(String valueJson, Class<T> valueType) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(valueJson, objectMapper.getTypeFactory().constructCollectionType(List.class, valueType));
    }
}

//    private static void addLikePredicateIfNotNull(List<Predicate> predicates, CriteriaBuilder criteriaBuilder, Path<String> path, String valueJson) {
//        if (valueJson != null) {
//            try {
//                ObjectMapper objectMapper = new ObjectMapper();
//                List<T> values = objectMapper.readValue(
//                        valueJson,
//                        new TypeReference<List<T>>() {
//                        }
//                );
//
//                // Create a list to store individual like predicates
//                List<Predicate> likePredicates = new ArrayList<>();
//
//                for (String value : values) {
//                    if (value != null) {
//                        // Convert both the column value and the search value to lowercase
//                        Expression<String> columnValueLower = criteriaBuilder.lower(path);
//                        String searchValueLower = value.toLowerCase();
//
//                        // Create a like predicate for the lowercase values and add it to the list
//                        Predicate likePredicate = criteriaBuilder.equal(columnValueLower, searchValueLower);
//                        likePredicates.add(likePredicate);
//                    }
//                }
//
//                // Combine all the like predicates using 'or' instead of 'and'
//                Predicate combinedPredicate = criteriaBuilder.or(likePredicates.toArray(new Predicate[0]));
//
//                // Add the combined predicate to the list of predicates
//                predicates.add(combinedPredicate);
//            } catch (IOException e) {
//                // Handle exception gracefully
//                Logger.getLogger(Vehicle.class.getName()).log(Level.SEVERE, "Error parsing JSON: " + valueJson, e);
//            }
//        }
//    }