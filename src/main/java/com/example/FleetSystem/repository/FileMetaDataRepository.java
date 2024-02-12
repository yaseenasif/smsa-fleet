package com.example.FleetSystem.repository;

import com.example.FleetSystem.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetaData, Long> {

    FileMetaData findByFileName(String originalFilename);

    List<FileMetaData> findByEmployee(Optional<Employee> employee);

    List<FileMetaData> findByVehicle(Optional<Vehicle> vehicle);

    List<FileMetaData> findByVehicleAssignment(Optional<VehicleAssignment> vehicleAssignment);

//    List<FileMetaData> findByDriver(Optional<Driver> driver);
}
