package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.JobTitleDto;
import com.example.FleetSystem.model.JobTitle;
import com.example.FleetSystem.repository.JobTitleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobTitleService {

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    JobTitleRepository jobTitleRepository;

    public JobTitleDto addJobTitle(JobTitleDto jobTitleDto) {
        JobTitle jobTitle = toEntity(jobTitleDto);
        jobTitle.setStatus(Boolean.TRUE);
        return toDto(jobTitleRepository.save(jobTitle));
    }

    private JobTitle toEntity(JobTitleDto jobTitleDto) {
        return modelMapper.map(jobTitleDto, JobTitle.class);
    }

    public JobTitleDto toDto(JobTitle jobTitle) {
        return modelMapper.map(jobTitle, JobTitleDto.class);
    }

    public List<JobTitleDto> toDtoList(List<JobTitle> jobTitleList) {
        return jobTitleList.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<JobTitleDto> getAllJobTitles() {
        return toDtoList(jobTitleRepository.getActiveJobTitles());
    }

    public JobTitleDto getJobTitleById(Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if(optionalJobTitle.isPresent()) {
           return toDto(optionalJobTitle.get());
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }

    public JobTitleDto updateJobTitleById(JobTitleDto jobTitleDto, Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if(optionalJobTitle.isPresent()) {
            optionalJobTitle.get().setJobTitle(jobTitleDto.getJobTitle());
            optionalJobTitle.get().setDivision(jobTitleDto.getDivision());
            optionalJobTitle.get().setDepartment(jobTitleDto.getDepartment());
            optionalJobTitle.get().setSection(jobTitleDto.getSection());
            optionalJobTitle.get().setFleetClassification(jobTitleDto.getFleetClassification());
            optionalJobTitle.get().setVehicleEligible(jobTitleDto.getVehicleEligible());

            return toDto(jobTitleRepository.save(optionalJobTitle.get()));
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }

    public JobTitleDto deleteJobTitle(Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if (optionalJobTitle.isPresent()) {
            optionalJobTitle.get().setStatus(Boolean.FALSE);
            return toDto(jobTitleRepository.save(optionalJobTitle.get()));
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }
}
