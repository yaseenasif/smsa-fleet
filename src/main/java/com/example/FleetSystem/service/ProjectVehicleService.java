package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.ProjectVehicleDto;
import com.example.FleetSystem.model.ProjectVehicle;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.repository.ProjectVehicleRepository;
import com.example.FleetSystem.repository.ProjectVehicleValuesRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
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
    ProjectVehicleValuesRepository projectVehicleValuesRepository;

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
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

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
        } else {
            throw new RuntimeException("Error in adding Project Vehicle");

        }
    }

    public List<ProjectVehicleDto> getAll() {
        return toDtoList(projectVehicleRepository.getActiveProjectVehicle());
    }

    public ProjectVehicleDto getByProjectVehicleId(Long id) {
        Optional<ProjectVehicle> optionalProjectVehicle = projectVehicleRepository.findById(id);
        if (optionalProjectVehicle.isPresent()) {
            return toDto(optionalProjectVehicle.get());
        } else throw new RuntimeException(String.format("Project vehicle not found with id => %id", id));
    }

    @Transactional
    public ProjectVehicleDto updateProjectVehicleById(Long id, ProjectVehicle projectVehicle) {
        Optional<ProjectVehicle> optionalProjectVehicle = projectVehicleRepository.findById(id);

        if (optionalProjectVehicle.isPresent()) {
            User user = getCurrentUser();

            ProjectVehicle existingProjectVehicle = optionalProjectVehicle.get();
            updateExistingProjectVehicle(existingProjectVehicle, projectVehicle, user);
            updateProjectVehicleValues(existingProjectVehicle, projectVehicle);

            return toDto(projectVehicleRepository.save(existingProjectVehicle));
        } else {
            throw new RuntimeException(String.format("Project Vehicle Not Found with id => %d", id));
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByEmployeeIdAndStatusIsTrue(username);
        } else {
            throw new RuntimeException("Unable to retrieve current user");
        }
    }

    private void updateExistingProjectVehicle(ProjectVehicle existingProjectVehicle, ProjectVehicle projectVehicle, User user) {
        existingProjectVehicle.setProjectName(projectVehicle.getProjectName());
        existingProjectVehicle.setDate(projectVehicle.getDate());
        existingProjectVehicle.setUpdatedAt(LocalDate.now());
        existingProjectVehicle.setUpdateBy(user);
    }

    private void updateProjectVehicleValues(ProjectVehicle existingProjectVehicle, ProjectVehicle projectVehicle) {
        List<ProjectVehicleValues> existingProjectVehicleValues = existingProjectVehicle.getProjectVehicleValuesList();
        List<ProjectVehicleValues> newProjectVehicleValues = projectVehicle.getProjectVehicleValuesList();

        List<ProjectVehicleValues> valuesToRemove = getValuesToRemove(existingProjectVehicleValues, newProjectVehicleValues);

        removeValuesFromDatabase(valuesToRemove);
        existingProjectVehicleValues.removeAll(valuesToRemove);

        List<ProjectVehicleValues> newValuesToAdd = getNewValuesToAdd(existingProjectVehicle, existingProjectVehicleValues, newProjectVehicleValues);
        existingProjectVehicleValues.addAll(newValuesToAdd);
    }

    private List<ProjectVehicleValues> getValuesToRemove(List<ProjectVehicleValues> existingValues, List<ProjectVehicleValues> newValues) {
        return existingValues.stream()
                .filter(existingValue -> !newValues.contains(existingValue))
                .collect(Collectors.toList());
    }

    private void removeValuesFromDatabase(List<ProjectVehicleValues> valuesToRemove) {
        valuesToRemove.forEach(projectVehicleValuesRepository::delete);
    }

    private List<ProjectVehicleValues> getNewValuesToAdd(ProjectVehicle existingProjectVehicle, List<ProjectVehicleValues> existingValues, List<ProjectVehicleValues> newValues) {
        return newValues.stream()
                .filter(newValue -> !existingValues.contains(newValue))
                .peek(newValue -> newValue.setProjectVehicle(existingProjectVehicle))
                .collect(Collectors.toList());
    }


    public ProjectVehicleDto deleteProjectVehicleById(Long id) {
        Optional<ProjectVehicle> projectVehicle = projectVehicleRepository.findById(id);

        if (projectVehicle.isPresent()) {
            projectVehicle.get().setStatus(Boolean.FALSE);
            return toDto(projectVehicleRepository.save(projectVehicle.get()));
        }
        throw new RuntimeException(String.format("Project Vehicle Not Found with id => %d", id));
    }
}