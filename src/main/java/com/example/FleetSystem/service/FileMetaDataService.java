package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.FileMetaDataDto;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileMetaDataService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;

//    @Autowired
//    DriverRepository driverRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<FileMetaDataDto> getFileMetaDataByEmployee(Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        List<FileMetaData> fileMetaDataByEmployee = fileMetaDataRepository.findByEmployee(employee);
        if(!fileMetaDataByEmployee.isEmpty()) {
            return toDtoList(fileMetaDataByEmployee);
        }
        else {
            throw new RuntimeException(String.format("No data found against this employee id => %d", id));
        }
    }

    public List<FileMetaDataDto> getFileMetaDataByVehicle(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        List<FileMetaData> fileMetaDataByVehicle = fileMetaDataRepository.findByVehicle(vehicle);
        if(!fileMetaDataByVehicle.isEmpty()) {
            return toDtoList(fileMetaDataByVehicle);
        }
        else {
            throw new RuntimeException(String.format("No data found against this vehicle id => %d", id));
        }
    }

    public List<FileMetaDataDto> getFileMetaDataByVehicleAssignment(Long id) {
        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findById(id);
        List<FileMetaData> fileMetaDataByVehicleAssignment = fileMetaDataRepository.findByVehicleAssignment(vehicleAssignment);
        if(!fileMetaDataByVehicleAssignment.isEmpty()) {
            return toDtoList(fileMetaDataByVehicleAssignment);
        }
        else {
            throw new RuntimeException(String.format("No data found against this vehicle Assignment id => %d", id));
        }
    }
//    public List<FileMetaDataDto> getFileMetaDataByDriver(Long id) {
//        Optional<Driver> driver = driverRepository.findById(id);
//        List<FileMetaData> fileMetaDataByDriver = fileMetaDataRepository.findByDriver(driver);
//        if(!fileMetaDataByDriver.isEmpty()) {
//            return toDtoList(fileMetaDataByDriver);
//        }
//        else {
//            throw new RuntimeException(String.format("No data found against this driver id => %d", id));
//        }
//    }

    public List<FileMetaDataDto> toDtoList(List<FileMetaData> fileMetaData) {
        return fileMetaData.stream().map(this::toDto).collect(Collectors.toList());
    }

    public FileMetaDataDto toDto(FileMetaData fileMetaData) {
        return modelMapper.map(fileMetaData, FileMetaDataDto.class);
    }


}
