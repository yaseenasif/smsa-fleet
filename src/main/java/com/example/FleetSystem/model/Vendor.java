package com.example.FleetSystem.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String vendorName;
    private String officeLocation;
    private String attachments;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean status;

    @OneToMany(mappedBy = "vendor")
    @JsonIgnore
    private List<ContactPerson> contactPersonList;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

}
