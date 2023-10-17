package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PermissionRepository extends JpaRepository<Permission,Long> {

    @Query("SELECT p FROM Permission p WHERE p.status = true")
    List<Permission> getActivePermissions();

}
