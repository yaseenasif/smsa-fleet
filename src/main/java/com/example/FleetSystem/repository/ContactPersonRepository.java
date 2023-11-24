package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.ContactPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactPersonRepository extends JpaRepository<ContactPerson,Long> {
}
