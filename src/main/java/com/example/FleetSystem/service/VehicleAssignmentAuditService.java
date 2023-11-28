package com.example.FleetSystem.service;

import com.example.FleetSystem.model.VehicleAssignment;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class VehicleAssignmentAuditService {

    @PersistenceContext
    private EntityManager entityManager;
    public List<VehicleAssignment> retrieveAuditData(Long vehicleAssignmentId) {
        // Get the AuditReader
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        // Query the audit data for the specified entity and ID
        AuditQuery auditQuery = auditReader.createQuery()
                .forRevisionsOfEntity(VehicleAssignment.class, false, true)
                .add(AuditEntity.id().eq(vehicleAssignmentId));

        // Retrieve the list of revisions for the entity
        List<Object[]> revisions = auditQuery.getResultList();

        // Process the audit data and add to a list
        List<VehicleAssignment> auditDataList = new ArrayList<>();
        for (Object[] revision : revisions) {
            VehicleAssignment entity = (VehicleAssignment) revision[0];
            auditDataList.add(entity);
        }

        // Return the list of audit data
        return auditDataList;
    }
}
