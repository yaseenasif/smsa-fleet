package com.example.FleetSystem.service;

//import com.example.FleetSystem.dto.DriverDto;
import com.example.FleetSystem.dto.VendorDto;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.repository.ContactPersonRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendorService {

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ContactPersonRepository contactPersonRepository;

    public VendorDto save(VendorDto vendorDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeId(username);

            Vendor vendor = toEntity(vendorDto);
            for (ContactPerson contactPerson: vendor.getContactPersonList()) {
                contactPerson.setVendor(vendor);
            }
            vendor.setCreatedAt(LocalDate.now());
            vendor.setCreatedBy(user);
            vendor.setStatus(Boolean.TRUE);
            return toDto(vendorRepository.save(vendor));
        }
        throw new RuntimeException("Error Adding Vendor");
    }

    public List<VendorDto> getAll(){
//        return vendorRepository.getActiveVendors();
        List<Vendor> vendors = vendorRepository.getActiveVendors();
        return toDtoList(vendors);
    }

    public VendorDto getById(Long id) {
        Optional<Vendor> vendor = vendorRepository.findById(id);
        if (vendor.isPresent()){
            return toDto(vendor.get());
        }
        throw new RuntimeException(String.format("Vendor Not Found On this Id => %d",id));
    }

    public VendorDto deleteVendorById(Long id){
        Optional<Vendor> vendor = vendorRepository.findById(id);

        if(vendor.isPresent()){
            vendor.get().setStatus(Boolean.FALSE);
            return toDto(vendorRepository.save(vendor.get()));
        }

        throw new RuntimeException(String.format("Vendor Not Found On this Id => %d",id));
    }

    public VendorDto updateById(Long id, VendorDto vendorDto) {
        Optional<Vendor> vendor = vendorRepository.findById(id);

        if(vendor.isPresent()){
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeId(username);

                vendor.get().setVendorName(vendorDto.getVendorName());
                vendor.get().setOfficeLocation(vendorDto.getOfficeLocation());
                vendor.get().setContactPersonList(vendorDto.getContactPersonList());
                vendor.get().setUpdatedAt(LocalDate.now());
                vendor.get().setUpdatedBy(user);
                return toDto(vendorRepository.save(vendor.get()));
            }
        }

        throw new RuntimeException(String.format("Vendor Not Found by this Id => %d" , id));
    }

    public VendorDto makeVendorActive(Long id) {
        Optional<Vendor> vendor = vendorRepository.findById(id);
        if(vendor.isPresent()){
            if(vendor.get().isStatus()){
                throw new RuntimeException("Record is already Active");
            }
            vendor.get().setStatus(Boolean.TRUE);
            return toDto(vendorRepository.save(vendor.get()));
        }
        throw new RuntimeException(String.format("Vendor Not Found by this Id => %d" , id));
    }

    public List<VendorDto> toDtoList(List<Vendor> vendors){
        return vendors.stream().map(this::toDto).collect(Collectors.toList());
    }

    private VendorDto toDto(Vendor vendor) {
        return modelMapper.map(vendor , VendorDto.class);
    }

    private Vendor toEntity(VendorDto vendorDto){
        return modelMapper.map(vendorDto , Vendor.class);
    }

}
