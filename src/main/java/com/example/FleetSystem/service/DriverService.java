package com.example.FleetSystem.service;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.dto.DriverDto;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.repository.DriverRepository;
import com.example.FleetSystem.repository.EmployeeRepository;
import com.example.FleetSystem.repository.FileMetaDataRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.specification.DriverSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
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

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    StorageService storageService;

    public DriverDto addDriver(DriverDto driverDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            Optional<Employee> employee = employeeRepository.findById(driverDto.getEmpId().getId());
            Driver driver = toEntity(driverDto);

            if(employee.isPresent()) {
                driver.setEmpId(employee.get());
            }else throw new RuntimeException("Employee Not Found");


            driver.setEmpName(driverDto.getEmpId().getEmpName());
            driver.setGrade(driverDto.getEmpId().getGrade());
            driver.setCity(driverDto.getEmpId().getCity());
            driver.setTitle(driverDto.getEmpId().getJobTitle());
            driver.setDepartment(driverDto.getEmpId().getDepartment());
            driver.setContactNumber(driverDto.getEmpId().getContactNumber());
            driver.setEmailAddress(driverDto.getEmpId().getCompanyEmailAddress());
            driver.setRegion(driverDto.getEmpId().getRegion());
            driver.setNationality(driverDto.getEmpId().getNationality());
            driver.setSection(driverDto.getEmpId().getSection());
            driver.setJoiningDate(driverDto.getEmpId().getJoiningDate());
            driver.setLicenseNumber(driverDto.getEmpId().getLicenseNumber());
            driver.setVehicleBudget(driverDto.getEmpId().getVehicleBudget());
            driver.setCostCentre(driverDto.getEmpId().getCostCenter());
            driver.setCreatedAt(LocalDate.now());
            driver.setCreatedBy(user);
            driver.setStatus(Boolean.TRUE);
            Driver save = driverRepository.save(driver);
            employeeRepository.save(employee.get());
            return toDto(save);
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

                driver.get().setEmpName(driverDto.getEmpId().getEmpName());
                driver.get().setTitle(driverDto.getEmpId().getJobTitle());
                driver.get().setJoiningDate(driverDto.getEmpId().getJoiningDate());
                driver.get().setDepartment(driverDto.getEmpId().getDepartment());
                driver.get().setSection(driverDto.getEmpId().getSection());
                driver.get().setRegion(driverDto.getEmpId().getRegion());
                driver.get().setCity(driverDto.getEmpId().getCity());
                driver.get().setNationality(driverDto.getEmpId().getNationality());
                driver.get().setContactNumber(driverDto.getEmpId().getContactNumber());
                driver.get().setEmailAddress(driverDto.getEmpId().getCompanyEmailAddress());
                driver.get().setGrade(driverDto.getEmpId().getGrade());
                driver.get().setLicenseNumber(driverDto.getEmpId().getLicenseNumber());
                driver.get().setVehicleBudget(driverDto.getEmpId().getVehicleBudget());
                driver.get().setCostCentre(driverDto.getEmpId().getCostCenter());
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

    public Page<DriverDto> searchDriver(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Driver> driverSpecification = DriverSpecification.getSearchSpecification(employeeSearchCriteria);
        Page<Driver> driverPage = driverRepository.findAll(driverSpecification,pageable);
        return driverPage.map(this::toDto);
    }
    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException {
        Optional<Driver> driver = driverRepository.findById(id);
        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());

        if(byFileName == null) {
            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
            String originalFileName = multipartFile.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            FileMetaData fileMetaData = new FileMetaData();
            fileMetaData.setFileUrl(fileUrl);
            fileMetaData.setFileExtension(fileExtension);
            fileMetaData.setFileName(multipartFile.getOriginalFilename());
            fileMetaData.setDriver(driver.get());
            fileMetaData.setAttachmentType(attachmentType);
            fileMetaDataRepository.save(fileMetaData);

            return ResponseMessage.builder()
                    .message(Collections.singletonList("File uploaded to the server successfully"))
                    .build();
        }
        else {
            throw new RuntimeException(String.format("File already exists on the bucket with the same name"));
        }
    }
}
