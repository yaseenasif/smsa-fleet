package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.ContactPerson;
import lombok.*;

import javax.persistence.*;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class VendorDto {
        private Long id;
        private String vendorName;
        private String officeLocation;
        private String attachments;
        private List<ContactPerson> contactPersonList;
        private boolean status;

    }