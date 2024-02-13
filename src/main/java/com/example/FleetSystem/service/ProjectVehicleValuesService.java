package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.repository.ProjectVehicleValuesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectVehicleValuesService {

    private final ProjectVehicleValuesRepository projectVehicleValuesRepository;
    private final ModelMapper modelMapper;

    public ProjectVehicleValuesService(ProjectVehicleValuesRepository projectVehicleValuesRepository, ModelMapper modelMapper) {
        this.projectVehicleValuesRepository = projectVehicleValuesRepository;
        this.modelMapper = modelMapper;
    }

    public List<ProjectVehicleValuesDto> getAllByRentalDate(String rentalDate) {
        List<ProjectVehicleValues> projectVehicleValuesList = projectVehicleValuesRepository.findProjectVehicleValuesByRentalDateAndStatusIsTrue(rentalDate);

        return projectVehicleValuesList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProjectVehicleValuesDto> getAllByLeaseDates(Date startLease, Date expiryLease) {
        List<ProjectVehicleValues> projectVehicleValuesList = projectVehicleValuesRepository
                .findByStartLeaseBetween(startLease, expiryLease);
        return projectVehicleValuesList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    private ProjectVehicleValuesDto toDto(ProjectVehicleValues projectVehicleValues) {
        return modelMapper.map(projectVehicleValues, ProjectVehicleValuesDto.class);
    }

    private ProjectVehicleValues toEntity(ProjectVehicleValuesDto projectVehicleValuesDto) {
        return modelMapper.map(projectVehicleValuesDto, ProjectVehicleValues.class);
    }
}
