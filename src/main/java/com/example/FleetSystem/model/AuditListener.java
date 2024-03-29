package com.example.FleetSystem.model;

import com.example.FleetSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.persistence.PrePersist;
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

}
