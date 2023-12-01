package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.AuditDataWrapper;
import com.example.FleetSystem.model.VehicleAssignment;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.DefaultRevisionEntity;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class VehicleAssignmentAuditService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<AuditDataWrapper> retrieveAuditData(Long vehicleId) {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        List<Object[]> revisions = auditReader.createQuery()
                .forRevisionsOfEntity(VehicleAssignment.class, false, true)
                .add(AuditEntity.relatedId("vehicle").eq(vehicleId))
                .getResultList();

        List<AuditDataWrapper> auditDataList = new ArrayList<>();
        for (Object[] revision : revisions) {
            VehicleAssignment entity = (VehicleAssignment) revision[0];
            DefaultRevisionEntity revisionEntity = (DefaultRevisionEntity) revision[1];
            RevisionType revisionType = (RevisionType) revision[2];
            LocalDateTime revisionTimestamp = getLocalDateTimeFromRevisionEntity(revisionEntity);

            AuditDataWrapper wrapper = new AuditDataWrapper(entity, revisionType,revisionTimestamp);
            auditDataList.add(wrapper);
        }

        return auditDataList;
    }

    private static LocalDateTime getLocalDateTimeFromRevisionEntity(DefaultRevisionEntity revisionEntity) {
        // Retrieve the revision timestamp using the revision entity
        Date revisionDate = revisionEntity.getRevisionDate();

        // Convert Date to LocalDateTime
        return revisionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }
}
