package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.ProjectVehicleExcelDto;
import com.example.FleetSystem.dto.ProjectVehicleValuesDto;
import com.example.FleetSystem.model.ProjectVehicleValues;
import com.example.FleetSystem.repository.ProjectVehicleValuesRepository;
import com.example.FleetSystem.specification.ProjectVehicleSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectVehicleValuesService {

    private final ProjectVehicleValuesRepository projectVehicleValuesRepository;
    private final ModelMapper modelMapper;
    private final ExcelExportService excelService;

    public ProjectVehicleValuesService(
            ProjectVehicleValuesRepository projectVehicleValuesRepository,
            ModelMapper modelMapper,
            ExcelExportService excelService) {
        this.projectVehicleValuesRepository = projectVehicleValuesRepository;
        this.modelMapper = modelMapper;
        this.excelService = excelService;
    }

    public List<ProjectVehicleValuesDto> getAllBySearchSpecification(
            Long id,
            ProjectVehicleValuesDto projectVehicleValuesDto
    ) {
        Specification<ProjectVehicleValues> projectVehicleValuesSpecification =
                ProjectVehicleSpecification.getSearchSpecificationByCriteria(id, projectVehicleValuesDto);
        List<ProjectVehicleValues> projectVehicleValuesList =
                projectVehicleValuesRepository.findAll(projectVehicleValuesSpecification);

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

    public byte[] downloadExcel(List<ProjectVehicleValuesDto> projectVehicleValuesDtoList) {
       List<ProjectVehicleExcelDto> projectVehicleExcelDto = toExcelDtoList(projectVehicleValuesDtoList);
        return excelService.exportToExcel(projectVehicleExcelDto);
    }

    private List<ProjectVehicleExcelDto> toExcelDtoList(List<ProjectVehicleValuesDto> projectVehicleValuesDtoList) {
        return projectVehicleValuesDtoList.stream().map(this::toExcelDto).collect(Collectors.toList());

    }

    private ProjectVehicleExcelDto toExcelDto(ProjectVehicleValuesDto projectVehicleValuesDto) {
        ProjectVehicleExcelDto projectVehicleExcelDto = modelMapper.map(projectVehicleValuesDto, ProjectVehicleExcelDto.class);
        projectVehicleExcelDto.setVendor(projectVehicleValuesDto.getVendor().getVendorName());
        return projectVehicleExcelDto;
    }
}
//    public List<ProjectVehicleValuesDto> getAllByLeaseDates(Long id, Date startLease, Date expiryLease) {
//        List<ProjectVehicleValues> projectVehicleValuesList = projectVehicleValuesRepository
//                .findAllByProjectVehicleId(id);
//
//        List<ProjectVehicleValues> filteredList = projectVehicleValuesList.stream()
//                .filter(value -> value.getStartLease().compareTo(startLease) >= 0 &&
//                        value.getStartLease().compareTo(expiryLease) <= 0)
//                .collect(Collectors.toList());
//
//        return filteredList.stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }