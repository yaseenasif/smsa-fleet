package com.example.FleetSystem.specification;

import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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

            if (projectVehicleValuesDto.getMonth() != null && !projectVehicleValuesDto.getMonth().isEmpty() && !projectVehicleValuesDto.getMonth().equalsIgnoreCase("[]")) {
                try {
                    // Deserialize the JSON string into a list of values
                    List<String> values = deserializeList(projectVehicleValuesDto.getMonth());
                    // Create a list to store individual like predicates
                    List<Predicate> likePredicates = new ArrayList<>();
                    for (String value : values) {
                        Expression<String> columnValueLower = criteriaBuilder.lower(root.get("month"));
                        Predicate likePredicate = criteriaBuilder.equal(columnValueLower, value.toLowerCase());
                        likePredicates.add(likePredicate);
                    }

                    // Combine all the like predicates using 'or' instead of 'and'
                    Predicate combinedPredicate = criteriaBuilder.or(likePredicates.toArray(new Predicate[0]));
                    predicate = criteriaBuilder.and(predicate, combinedPredicate);
                } catch (IOException e) {
                    throw new RuntimeException(String.format(
                            "Error parsing JSON: %s", projectVehicleValuesDto.getMonth()), e
                    );
                }
            }

            return predicate;
        };
    }
    private static List<String> deserializeList(String valueJson) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(valueJson, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
    }

}