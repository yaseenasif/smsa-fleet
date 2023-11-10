package com.example.FleetSystem.model;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.time.LocalDate;

public class AuditListener {

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
