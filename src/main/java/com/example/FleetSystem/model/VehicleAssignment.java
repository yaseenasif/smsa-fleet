package com.example.FleetSystem.model;


import lombok.*;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Audited
@AuditOverride(forClass = Auditable.class, isAudited = true)
@Table(name = "vehicle_assignment")
public class VehicleAssignment implements Auditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String assignToEmpName;
    private String attachments;
//    private boolean status;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "assign_to_emp_id")
    private Employee assignToEmpId;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Override
    public LocalDate getDeletedAt() {
        return null;
    }

    @Override
    public void setDeletedAt(LocalDate deletedAt) {

    }

    @Override
    public User getDeletedBy() {
        return null;
    }

    @Override
    public void setDeletedBy(User deletedBy) {

    }
}
