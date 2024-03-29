//package com.example.FleetSystem.service;
//
//import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
//import com.example.FleetSystem.dto.DriverDto;
//import com.example.FleetSystem.model.*;
//import com.example.FleetSystem.payload.ResponseMessage;
//import com.example.FleetSystem.repository.*;
//import com.example.FleetSystem.specification.DriverSpecification;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.time.LocalDate;
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class DriverService {
//
//    @Autowired
//    DriverRepository driverRepository;
//    @Autowired
//    ModelMapper modelMapper;
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    EmployeeRepository employeeRepository;
//
//    @Autowired
//    FileMetaDataRepository fileMetaDataRepository;
//
//    @Autowired
//    StorageService storageService;
//    @Autowired
//    VehicleAssignmentRepository vehicleAssignmentRepository;
//    @Autowired
//    VehicleRepository vehicleRepository;
//
//    public DriverDto addDriver(DriverDto driverDto) {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        if(principal instanceof UserDetails) {
//            String username = ((UserDetails) principal).getUsername();
//            User user = userRepository.findByEmail(username);
//
//            Optional<Employee> employee = employeeRepository.findById(driverDto.getEmpId().getId());
//
//            if(employee.isPresent()) {
//                employee.get().setVehicleBudget(driverDto.getEmpId().getVehicleBudget());
//                employee.get().setLicenseNumber(driverDto.getEmpId().getLicenseNumber());
//
//                Employee savedEmployee = employeeRepository.save(employee.get());
//
//                Driver driver = Driver.builder()
//                        .empId(savedEmployee)
//                        .createdAt(LocalDate.now())
//                        .createdBy(user)
//                        .status(Boolean.TRUE)
//                        .build();
//
//                if(driverDto.getAssignedVehicle() != null) {
//                    Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(driverDto.getAssignedVehicle());
//                    if (vehicle.isPresent()) {
//                        driver.setAssignedVehicle(driverDto.getAssignedVehicle());
//                        vehicle.get().setVehicleStatus("Active");
//                        vehicleRepository.save(vehicle.get());
//                    }
//
//                    Optional<VehicleAssignment> assignment = vehicleAssignmentRepository.findByVehicle(vehicle.get());
//
//                    if (assignment.isPresent()) {
//                        assignment.get().setAssignToEmpId(employee.get());
//                        assignment.get().setAssignToEmpName(employee.get().getEmpName());
//                        assignment.get().setStatus(Boolean.TRUE);
//                        assignment.get().setUpdatedAt(LocalDate.now());
//                        assignment.get().setUpdatedBy(user);
//                        vehicleAssignmentRepository.save(assignment.get());
//                    } else {
//                        VehicleAssignment vehicleAssignment = VehicleAssignment.builder()
//                                .assignToEmpId(employee.get())
//                                .assignToEmpName(employee.get().getEmpName())
//                                .vehicle(vehicle.get())
//                                .createdAt(LocalDate.now())
//                                .createdBy(user)
//                                .status(Boolean.TRUE)
//                                .build();
//                        vehicleAssignmentRepository.save(vehicleAssignment);
//                    }
//                }
//
//                Driver save = driverRepository.save(driver);
//                return toDto(save);
//
//            }else throw new RuntimeException("Employee Not Found");
//
//
//        }
//        throw new RuntimeException("Error adding Driver");
//    }
//
//    public List<DriverDto> getActiveDrivers() {
//        return toDtoList(driverRepository.getActiveDrivers());
//    }
//
//    public DriverDto getById(Long id) {
//        Optional<Driver> driver = driverRepository.findById(id);
//        if (driver.isPresent()){
//            return toDto(driver.get());
//        }
//        throw new RuntimeException(String.format("Driver Not Found On this Id => %d",id));
//    }
//
//    public DriverDto deleteDriverById(Long id){
//        Optional<Driver> driver = driverRepository.findById(id);
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//
//        if(driver.isPresent()) {
//            if (principal instanceof UserDetails) {
//                String username = ((UserDetails) principal).getUsername();
//                User user = userRepository.findByEmail(username);
//
//                Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByAssignToEmpId(driver.get().getEmpId());
//                if (vehicleAssignment.isPresent()) {
//                    Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleAssignment.get().getVehicle().getId());
//                    if (vehicle.isPresent()) {
//                        vehicle.get().setVehicleStatus("TBA");
//                        vehicleRepository.save(vehicle.get());
//                    }
//
//                    driver.get().setAssignedVehicle(null);
//                    vehicleAssignment.get().setAssignToEmpId(null);
//                    vehicleAssignment.get().setAssignToEmpName(null);
//                    vehicleAssignment.get().setStatus(Boolean.FALSE);
//                    vehicleAssignment.get().setDeletedBy(user);
//                    vehicleAssignment.get().setDeletedAt(LocalDate.now());
//                    vehicleAssignmentRepository.save(vehicleAssignment.get());
//                }
//            }
//
//                driver.get().setStatus(Boolean.FALSE);
//                return toDto(driverRepository.save(driver.get()));
//            }
//
//        throw new RuntimeException("Record doesn't exist");
//    }
//
//    public DriverDto updateById(Long id, String plateNumber, DriverDto driverDto) {
//        Optional<Driver> driver = driverRepository.findById(id);
//        Optional<Employee> employee = employeeRepository.findById(driverDto.getEmpId().getId());
//
//        if(driver.isPresent()){
//            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//            if(principal instanceof UserDetails) {
//                String username = ((UserDetails) principal).getUsername();
//                User user = userRepository.findByEmail(username);
//               if (employee.isPresent()) {
//                   employee.get().setVehicleBudget(driverDto.getEmpId().getVehicleBudget());
//                   employee.get().setLicenseNumber(driverDto.getEmpId().getLicenseNumber());
//
//                   Employee savedEmployee = employeeRepository.save(employee.get());
//
//                   driver.get().setEmpId(savedEmployee);
//                   driver.get().setUpdatedAt(LocalDate.now());
//                   driver.get().setUpdatedBy(user);
//               }
//                    if (!plateNumber.isEmpty()) {
////                        Assign vehicle
//                        Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(plateNumber);
//                        if (vehicle.isPresent()) {
//                            vehicle.get().setVehicleStatus("Active");
//                            vehicleRepository.save(vehicle.get());
//
//                            driver.get().setAssignedVehicle(plateNumber);
//                            VehicleAssignment vehicleAssignment = VehicleAssignment.builder()
//                                    .assignToEmpId(driver.get().getEmpId())
//                                    .assignToEmpName(driver.get().getEmpId().getEmpName())
//                                    .vehicle(vehicle.get())
//                                    .createdAt(LocalDate.now())
//                                    .createdBy(user)
//                                    .status(Boolean.TRUE)
//                                    .build();
//
//                            vehicleAssignmentRepository.save(vehicleAssignment);
//                        }
//
////                        Release assignment
//                        Optional<Vehicle> existingVehicle = vehicleRepository.findByPlateNumber(driverDto.getAssignedVehicle());
//                        if (existingVehicle.isPresent()) {
//                            existingVehicle.get().setVehicleStatus("TBA");
//                            Optional<VehicleAssignment> existingAssignment = vehicleAssignmentRepository.findByVehicle(existingVehicle.get());
//                            if (existingAssignment.isPresent()){
//                            existingAssignment.get().setAssignToEmpId(null);
//                            existingAssignment.get().setAssignToEmpName(null);
//                            existingAssignment.get().setDeletedAt(LocalDate.now());
//                            existingAssignment.get().setDeletedBy(user);
//                            existingAssignment.get().setStatus(Boolean.FALSE);
//
//                            vehicleAssignmentRepository.save(existingAssignment.get());
//                            vehicleRepository.save(existingVehicle.get());
//                          }
//                        }
//
//                    }
//
//                return toDto(driverRepository.save(driver.get()));
//            }
//        }
//        throw new RuntimeException(String.format("Driver Not Found by this Id => %d" , id));
//    }
//
//    public DriverDto makeDriverActive(Long id) {
//        Optional<Driver> driver = driverRepository.findById(id);
//        if(driver.isPresent()){
//            if(driver.get().isStatus()){
//                throw new RuntimeException("Record is already Active");
//            }
//            driver.get().setStatus(Boolean.TRUE);
//            return toDto(driverRepository.save(driver.get()));
//        }
//        throw new RuntimeException(String.format("Driver Not Found by this Id => %d" , id));
//    }
//
//
//    public List<DriverDto> toDtoList(List<Driver> driver){
//        return driver.stream().map(this::toDto).collect(Collectors.toList());
//    }
//
//    public DriverDto toDto(Driver driver){
//        return modelMapper.map(driver, DriverDto.class);
//    }
//    private Driver toEntity(DriverDto driverDto){
//        return modelMapper.map(driverDto , Driver.class);
//    }
//
//    public Page<DriverDto> searchDriver(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Specification<Driver> driverSpecification = DriverSpecification.getSearchSpecification(employeeSearchCriteria);
//        Page<Driver> driverPage = driverRepository.findAll(driverSpecification,pageable);
//        return driverPage.map(this::toDto);
//    }
//    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException {
//        Optional<Driver> driver = driverRepository.findById(id);
//        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());
//
//        if(byFileName == null) {
//            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
//            String originalFileName = multipartFile.getOriginalFilename();
//            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
//            FileMetaData fileMetaData = new FileMetaData();
//            fileMetaData.setFileUrl(fileUrl);
//            fileMetaData.setFileExtension(fileExtension);
//            fileMetaData.setFileName(multipartFile.getOriginalFilename());
//            fileMetaData.setDriver(driver.get());
//            fileMetaData.setAttachmentType(attachmentType);
//            fileMetaDataRepository.save(fileMetaData);
//
//            return ResponseMessage.builder()
//                    .message(Collections.singletonList("File uploaded to the server successfully"))
//                    .build();
//        }
//        else {
//            throw new RuntimeException(String.format("File already exists on the bucket with the same name"));
//        }
//    }
//
//    public List<DriverDto> getUnassignedDrivers(){
//        return toDtoList(driverRepository.getUnAssignedDriver());
//    }
//
//    public Page<DriverDto> searchInactiveDriver(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Specification<Driver> driverSpecification = DriverSpecification.getInactiveSearchSpecification(employeeSearchCriteria);
//        Page<Driver> driverPage = driverRepository.findAll(driverSpecification,pageable);
//        return driverPage.map(this::toDto);
//    }
//}
