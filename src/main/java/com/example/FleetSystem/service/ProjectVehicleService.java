package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.model.ProjectVehicle;
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

    public List<ProjectVehicleDto> save(List<ProjectVehicleDto> projectVehicleDtoList) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            List<ProjectVehicle> projectVehicles = projectVehicleDtoList.stream()
                    .map(dto -> toEntity(dto)).collect(Collectors.toList());

            for(ProjectVehicle projectVehicle : projectVehicles) {
                if(projectVehicleRepository.existsByProjectName(projectVehicle.getProjectName())) {
                    throw new RuntimeException("Project with the same name already exist");
                }
            }

            projectVehicles.forEach(projectVehicle -> {
                projectVehicle.setStatus(Boolean.TRUE);
                projectVehicle.setDate(LocalDate.now());
            });

            List<ProjectVehicle> savedProjectVehicle = projectVehicleRepository.saveAll(projectVehicles);

            return savedProjectVehicle.stream().map(this::toDto).collect(Collectors.toList());
        }
        throw new RuntimeException("Error in adding Project Vehicle");
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

    public ProjectVehicleDto updateProjectVehicleById(Long id, ProjectVehicleDto projectVehicleDto) {
        Optional<ProjectVehicle> optionalProjectVehicle = projectVehicleRepository.findById(id);

        if(optionalProjectVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

                optionalProjectVehicle.get().setProjectName(projectVehicleDto.getProjectName());
                optionalProjectVehicle.get().setPlateNumber(projectVehicleDto.getPlateNumber());
                optionalProjectVehicle.get().setVendor(projectVehicleDto.getVendor());

                return toDto(projectVehicleRepository.save(optionalProjectVehicle.get()));
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
