package com.example.FleetSystem.model;

import java.time.LocalDate;

public interface Auditable {
    LocalDate getCreatedAt();

    void setCreatedAt(LocalDate createdAt);

    LocalDate getUpdatedAt();

    void setUpdatedAt(LocalDate updatedAt);

    LocalDate getDeletedAt();
    void setDeletedAt(LocalDate deletedAt);

    User getDeletedBy();
    void setDeletedBy(User deletedBy);
}
