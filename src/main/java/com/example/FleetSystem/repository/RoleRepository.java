package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Roles , Long> {

    Optional<Roles> findByName(String Roles);

}
