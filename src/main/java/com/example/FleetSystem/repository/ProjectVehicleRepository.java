package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.model.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectVehicleRepository extends JpaRepository<ProjectVehicle, Long>, JpaSpecificationExecutor<ProjectVehicle> {

    @Query("SELECT pv FROM ProjectVehicle pv WHERE pv.status = true")
    List<ProjectVehicle> getActiveProjectVehicle();

    boolean existsByProjectName(String projectName);

}
