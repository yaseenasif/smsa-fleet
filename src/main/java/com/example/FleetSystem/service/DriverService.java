package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.DriverDto;
import com.example.FleetSystem.model.Driver;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.repository.DriverRepository;
import com.example.FleetSystem.repository.UserRepository;
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
public class DriverService {

    @Autowired
    DriverRepository driverRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    UserRepository userRepository;

    public DriverDto addDriver(DriverDto driverDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            Driver driver = toEntity(driverDto);
            driver.setCreatedAt(LocalDate.now());
            driver.setCreatedBy(user);
            driver.setStatus(Boolean.TRUE);

            return toDto(driverRepository.save(driver));
        }
        throw new RuntimeException("Error adding Driver");
    }

    public List<DriverDto> getActiveDrivers() {
        return toDtoList(driverRepository.getActiveDrivers());
    }

    public DriverDto getById(Long id) {
        Optional<Driver> driver = driverRepository.findById(id);
        if (driver.isPresent()){
            return toDto(driver.get());
        }
        throw new RuntimeException(String.format("Driver Not Found On this Id => %d",id));
    }

    public DriverDto deleteDriverById(Long id){
        Optional<Driver> driver = driverRepository.findById(id);

        if(driver.isPresent()){
            driver.get().setStatus(Boolean.FALSE);
            return toDto(driverRepository.save(driver.get()));
        }

        throw new RuntimeException("Record doesn't exist");
    }

    public DriverDto updateById(Long id, DriverDto driverDto) {
        Optional<Driver> driver = driverRepository.findById(id);

        if(driver.isPresent()){
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

                driver.get().setName(driverDto.getName());
                driver.get().setTitle(driverDto.getTitle());
                driver.get().setSection(driverDto.getSection());
                driver.get().setDepartment(driverDto.getDepartment());
                driver.get().setRegion(driverDto.getRegion());
                driver.get().setCity(driverDto.getCity());
                driver.get().setNationality(driverDto.getNationality());
                driver.get().setContactNumber(driverDto.getContactNumber());
                driver.get().setEmailAddress(driverDto.getEmailAddress());
                driver.get().setGrade(driverDto.getGrade());
                driver.get().setLicenseNumber(driverDto.getLicenseNumber());
                driver.get().setVehicleBudget(driverDto.getVehicleBudget());
                driver.get().setAttachments(driverDto.getAttachments());
                driver.get().setUpdatedAt(LocalDate.now());
                driver.get().setUpdatedBy(user);
                return toDto(driverRepository.save(driver.get()));
            }
        }

        throw new RuntimeException(String.format("Driver Not Found by this Id => %d" , id));
    }

    public DriverDto makeDriverActive(Long id) {
        Optional<Driver> driver = driverRepository.findById(id);
        if(driver.isPresent()){
            if(driver.get().isStatus()){
                throw new RuntimeException("Record is already Active");
            }
            driver.get().setStatus(Boolean.TRUE);
            return toDto(driverRepository.save(driver.get()));
        }
        throw new RuntimeException(String.format("Driver Not Found by this Id => %d" , id));
    }


    public List<DriverDto> toDtoList(List<Driver> driver){
        return driver.stream().map(this::toDto).collect(Collectors.toList());
    }

    public DriverDto toDto(Driver driver){
        return modelMapper.map(driver, DriverDto.class);
    }
    private Driver toEntity(DriverDto driverDto){
        return modelMapper.map(driverDto , Driver.class);
    }

}
