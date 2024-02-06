package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vendor;
import com.example.FleetSystem.repository.ProjectVehicleRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectVehicleService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProjectVehicleRepository projectVehicleRepository;

    @Autowired
    VendorRepository vendorRepository;

    public List<ProjectVehicleDto> toDtoList(List<ProjectVehicle> projectVehicleList) {
        return projectVehicleList.stream().map(this::toDto).collect(Collectors.toList());
    }

    private ProjectVehicleDto toDto(ProjectVehicle projectVehicle) {
        return modelMapper.map(projectVehicle, ProjectVehicleDto.class);
    }

    private ProjectVehicle toEntity(ProjectVehicleDto projectVehicleDto) {
        return modelMapper.map(projectVehicleDto, ProjectVehicle.class);
    }

    @Transactional
    public ProjectVehicleDto save(ProjectVehicleDto projectVehicleDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            ProjectVehicle projectVehicle = toEntity(projectVehicleDto);
            projectVehicle.setCreatedBy(user);
            projectVehicle.setStatus(Boolean.TRUE);
            projectVehicle.setCreatedAt(LocalDate.now());

            List<ProjectVehicleValues> projectVehicleValues = projectVehicleDto.getProjectVehicleValuesList();
                for (ProjectVehicleValues values : projectVehicleValues) {
                    values.setProjectVehicle(projectVehicle);
                    values.setStatus(Boolean.TRUE);
                }

                projectVehicle.setProjectVehicleValuesList(projectVehicleValues);
                ProjectVehicle savedProjectVehicle = projectVehicleRepository.save(projectVehicle);

            return toDto(savedProjectVehicle);
        }
        else {
            throw new RuntimeException("Error in adding Project Vehicle");

        }
    }

    public List<ProjectVehicleDto> getAll() {
        return toDtoList(projectVehicleRepository.getActiveProjectVehicle());
    }

    public ProjectVehicleDto getByProjectVehicleId(Long id) {
        Optional<ProjectVehicle> optionalProjectVehicle = projectVehicleRepository.findById(id);
        if(optionalProjectVehicle.isPresent()) {
            return toDto(optionalProjectVehicle.get());
        }
        else throw new RuntimeException(String.format("Project vehicle not found with id => %id", id));
    }

    public ProjectVehicleDto updateProjectVehicleById(Long id, ProjectVehicle projectVehicle) {
        Optional<ProjectVehicle> optionalProjectVehicle = projectVehicleRepository.findById(id);

        if(optionalProjectVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

                ProjectVehicle existingProjectVehicle = optionalProjectVehicle.get();
                existingProjectVehicle.setProjectName(projectVehicle.getProjectName());
                existingProjectVehicle.setDate(projectVehicle.getDate());
                existingProjectVehicle.setUpdatedAt(LocalDate.now());
                existingProjectVehicle.setUpdateBy(user);

                List<ProjectVehicleValues> existingProjectVehicleValues = existingProjectVehicle.getProjectVehicleValuesList();
                List<ProjectVehicleValues> newProjectVehicleValues = projectVehicle.getProjectVehicleValuesList();

                for(ProjectVehicleValues newValue : newProjectVehicleValues) {
                    Optional<ProjectVehicleValues> existingValues = existingProjectVehicleValues.stream()
                            .filter(pv -> pv.getId().equals(newValue.getId())).findAny();
                    if(existingValues.isPresent()) {
                        ProjectVehicleValues existingPv = existingValues.get();
                        existingPv.setPlateNumber(newValue.getPlateNumber());
                        existingPv.setLeaseCost(newValue.getLeaseCost());
                        existingPv.setType(newValue.getType());
                        existingPv.setOrigin(newValue.getOrigin());
                        existingPv.setDestination(newValue.getDestination());
                        existingPv.setRentalDate(newValue.getRentalDate());
                        existingPv.setStartLease(newValue.getStartLease());
                        existingPv.setExpiryLease(newValue.getExpiryLease());
                        existingPv.setStatus(Boolean.TRUE);
                        existingPv.setProjectVehicle(existingProjectVehicle);
                        existingPv.setVendor(newValue.getVendor());
                    }
                    else {
                        newValue.setProjectVehicle(existingProjectVehicle);
                        existingProjectVehicleValues.add(newValue);
                    }
                }

                return toDto(projectVehicleRepository.save(existingProjectVehicle));
            }
        }
        throw new RuntimeException(String.format("Project Vehicle Not Found with id => %d", id));
    }

    public ProjectVehicleDto deleteProjectVehicleById(Long id) {
        Optional<ProjectVehicle> projectVehicle = projectVehicleRepository.findById(id);

        if(projectVehicle.isPresent()) {
            projectVehicle.get().setStatus(Boolean.FALSE);
            return toDto(projectVehicleRepository.save(projectVehicle.get()));
        }
        throw new RuntimeException(String.format("Project Vehicle Not Found with id => %d", id));
    }
}
