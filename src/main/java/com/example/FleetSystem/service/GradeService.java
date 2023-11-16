package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.GradeDto;
import com.example.FleetSystem.dto.VehicleAssignmentDto;
import com.example.FleetSystem.model.Grade;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.repository.GradeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    GradeRepository gradeRepository;
    @Autowired
    ModelMapper modelMapper;

    public GradeDto addGrade(GradeDto gradeDto){
        Grade grade = toEntity(gradeDto);
        grade.setStatus(Boolean.FALSE);
        return toDto(gradeRepository.save(grade));
    }

    public List<GradeDto> getActiveGrades(){
        return gradeRepository.getActiveGrades();
    }

    public GradeDto getById(Long id){
        Optional<Grade> grade = gradeRepository.findById(id);
        if (grade.isPresent()){
            return toDto(grade.get());
        }
        throw new RuntimeException("Grade not found By id : "+id);
    }

    public GradeDto updateGradeById(Long id, GradeDto gradeDto){
        Optional<Grade> grade = gradeRepository.findById(id);
        if (grade.isPresent()){
            grade.get().setName(gradeDto.getName());
            grade.get().setVehicleBudget(gradeDto.getVehicleBudget());
            return toDto(gradeRepository.save(grade.get()));
        }
        throw new RuntimeException("Grade not found By id : "+id);
    }

    public GradeDto deleteById(Long id){
        Optional<Grade> grade = gradeRepository.findById(id);
        if (grade.isPresent()){
            grade.get().setStatus(Boolean.FALSE);
            return toDto(gradeRepository.save(grade.get()));
        }
        throw new RuntimeException("Grade not found by id : "+id);
    }

    public List<GradeDto> toDtoList(List<Grade> grades){
        return grades.stream().map(this::toDto).collect(Collectors.toList());
    }

    public GradeDto toDto(Grade grade){
        return modelMapper.map(grade, GradeDto.class);
    }

    private Grade toEntity(GradeDto gradeDto){
        return modelMapper.map(gradeDto , Grade.class);
    }

}
