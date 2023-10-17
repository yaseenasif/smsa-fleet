package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.ProductFieldValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFieldValuesRepository extends JpaRepository<ProductFieldValues,Long> {
}
