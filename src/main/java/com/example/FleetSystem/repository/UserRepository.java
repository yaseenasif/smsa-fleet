package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository <User,Long> {
    User findByName(String username);

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.status = true")
    List<User> getActiveUsers();
}
