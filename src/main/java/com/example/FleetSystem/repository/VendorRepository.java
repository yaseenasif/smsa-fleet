package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor,Long> {
    Vendor findByVendorNameIgnoreCase(String vendorName);

}
