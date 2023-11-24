package com.example.FleetSystem.service;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.repository.EmployeeRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleAssignmentRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import com.example.FleetSystem.specification.VehicleAssignmentSpecification;
import com.example.FleetSystem.specification.VehicleSpecification;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.repository.*;
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
public class VehicleAssignmentService {

    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    StorageService storageService;

    public VehicleAssignmentDto save(VehicleAssignmentDto vehicleAssignmentDto) {
        Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principle instanceof UserDetails) {
            String username = ((UserDetails) principle).getUsername();
            User user = userRepository.findByEmail(username);

            Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(vehicleAssignmentDto.getVehicle().getPlateNumber());
            Optional<Employee> employee = employeeRepository.findById(vehicleAssignmentDto.getAssignToEmpId().getId());

            if(vehicle.isPresent()) {
                if(employee.isPresent()) {

                        VehicleAssignment vehicleAssignment = toEntity(vehicleAssignmentDto);
                        vehicleAssignment.setVehicle(vehicle.get());
                        vehicleAssignment.setAssignToEmpId(employee.get());
                        vehicleAssignment.setAssignToEmpName(employee.get().getEmpName());

                        vehicleAssignment.setCreatedAt(LocalDate.now());
                        vehicleAssignment.setCreatedBy(user);

                        VehicleAssignment savedAssignment = vehicleAssignmentRepository.save(vehicleAssignment);
                        return toDto(savedAssignment);
                }
                else {
                    throw new RuntimeException("Employee Not Found");
                }
            }
            else {
                throw new RuntimeException("Vehicle Not Found");
            }

        }
        throw new RuntimeException("Error adding Vehicle Assignment");
    }

    public List<VehicleAssignmentDto> getActiveVehicleAssignment() {
        return toDtoList(vehicleAssignmentRepository.findAll());
    }

    public VehicleAssignmentDto getById(Long id) {
        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findById(id);

        if(optionalVehicleAssignment.isPresent()) {
            return toDto(optionalVehicleAssignment.get());
        }
        throw new RuntimeException(String.format("Vehicle Not Found On this Id => %d", id));
    }

    public void deleteVehicleAssignmentById(Long id) {
        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findById(id);
        if(optionalVehicleAssignment.isPresent()) {
//            optionalVehicleAssignment.get().setStatus(Boolean.FALSE);
            vehicleAssignmentRepository.delete(optionalVehicleAssignment.get());
        }
        else throw new RuntimeException("Record does not exist");
    }

    public VehicleAssignmentDto updateById(Long id, VehicleAssignmentDto vehicleAssignmentDto) {

        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findById(id);
        if(vehicleAssignment.isPresent()) {
            Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principle instanceof UserDetails) {
                String username = ((UserDetails) principle).getUsername();
                User user = userRepository.findByEmail(username);

                Optional<Employee> employee = employeeRepository.findById(vehicleAssignmentDto.getAssignToEmpId().getId());
                if (employee.isPresent()) {
                    vehicleAssignment.get().setAssignToEmpId(employee.get());
                    vehicleAssignment.get().setAssignToEmpName(employee.get().getEmpName());

                    vehicleAssignment.get().setUpdatedBy(user);
                    vehicleAssignment.get().setUpdatedAt(LocalDate.now());

                    VehicleAssignment updatedVehicleAssignment = vehicleAssignmentRepository.save(vehicleAssignment.get());

                    return toDto(updatedVehicleAssignment);
                }
                throw new RuntimeException("EMPLOYEE NOT FOUND");
            }

        }

        throw new RuntimeException(String.format("Vehicle Assignment not found for id => %id", id));
        }

//    public VehicleAssignmentDto makeVehicleAssignmentActive(Long id) {
//        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findById(id);
//
//        if(optionalVehicleAssignment.isPresent()) {
//            if(optionalVehicleAssignment.get().isStatus()) {
//                throw new RuntimeException("Record is already Active");
//            }
//            optionalVehicleAssignment.get().setStatus(Boolean.TRUE);
//            return toDto(vehicleAssignmentRepository.save(optionalVehicleAssignment.get()));
//        }
//        throw new RuntimeException(String.format("VehicleAssignment Not Found by this id => %d", id));
//    }

    public VehicleAssignmentDto getByPlateNumber(String plateNumber){
        Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(plateNumber);

        if (vehicle.isPresent()) {
            Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(vehicle.get());

            if (vehicleAssignment.isPresent()) {
                return toDto(vehicleAssignment.get());
            }
        }

         throw new RuntimeException(String.format("Record Not Found By the PlateNumber : %s",plateNumber));
    }

    public List<VehicleAssignmentDto> toDtoList(List<VehicleAssignment> vehicleAssignments){
        return vehicleAssignments.stream().map(this::toDto).collect(Collectors.toList());
    }

    public VehicleAssignmentDto toDto(VehicleAssignment vehicleAssignment){
        return modelMapper.map(vehicleAssignment, VehicleAssignmentDto.class);
    }

    private VehicleAssignment toEntity(VehicleAssignmentDto vehicleAssignmentDto){
        return modelMapper.map(vehicleAssignmentDto , VehicleAssignment.class);
    }


    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException {
        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findById(id);
        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());

        if(byFileName == null) {
            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
            String originalFileName = multipartFile.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            FileMetaData fileMetaData = new FileMetaData();
            fileMetaData.setFileUrl(fileUrl);
            fileMetaData.setFileExtension(fileExtension);
            fileMetaData.setFileName(multipartFile.getOriginalFilename());
            fileMetaData.setVehicleAssignment(vehicleAssignment.get());
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
    public Page<VehicleAssignmentDto> searchAssignmentByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecification(vehicleSearchCriteria);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification,pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }
}
