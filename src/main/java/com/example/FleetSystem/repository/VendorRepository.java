package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor,Long> {
    Vendor findByVendorNameIgnoreCase(String vendorName);

    @Query("SELECT v FROM Vendor v WHERE v.status = true")
    List<Vendor> getActiveVendors();
}
