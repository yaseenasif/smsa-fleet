package com.example.FleetSystem.model;

import com.example.FleetSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import java.time.LocalDate;

public class AuditListener {

    @Autowired
    UserRepository userRepository;

    @PrePersist
    public void prePersist(Object object) {
        if (object instanceof Auditable) {
            ((Auditable) object).setCreatedAt(LocalDate.now());
        }
    }

    @PreUpdate
    public void preUpdate(Object object) {
        if (object instanceof Auditable) {
            ((Auditable) object).setUpdatedAt(LocalDate.now());
        }
    }

    @PreRemove
    public void preRemove(Object object) {
        if (object instanceof Auditable) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);
                ((Auditable) object).setDeletedBy(user);
                ((Auditable) object).setDeletedAt(LocalDate.now());
            }
        }
    }
}
