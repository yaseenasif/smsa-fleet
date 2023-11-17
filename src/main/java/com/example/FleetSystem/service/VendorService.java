package com.example.FleetSystem.service;

import com.example.FleetSystem.model.Vendor;
import com.example.FleetSystem.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {


    @Autowired
    VendorRepository vendorRepository;

    public List<Vendor> getAll(){
        return vendorRepository.getActiveVendors();
    }
}
