package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Vehicle;
import lombok.*;
import org.hibernate.envers.Audited;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDate;
import java.util.Date;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class AssignmentExcelDto {

    private Long empNo;
    private String empName;
    private String plateNumber;
    private String design;
    private String model;
    private String make;
    private Integer year;
    private String department;
    private String section;
    private String region;
    private Date leaseExpiry;
    private Integer leaseCost;

}
