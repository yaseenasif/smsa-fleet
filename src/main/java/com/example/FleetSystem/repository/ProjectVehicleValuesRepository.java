package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.ProjectVehicleValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface ProjectVehicleValuesRepository extends JpaRepository<ProjectVehicleValues,Long>, JpaSpecificationExecutor<ProjectVehicleValues> {

    List<ProjectVehicleValues> findAllByProjectVehicleId(Long id);
}
