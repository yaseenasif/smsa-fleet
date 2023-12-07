package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.dto.VehicleReplacementDto;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.model.VehicleReplacement;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleAssignmentRepository;
import com.example.FleetSystem.repository.VehicleReplacementRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleReplacementService {

    @Autowired
    VehicleReplacementRepository vehicleReplacementRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;

    @Transactional
    public VehicleReplacementDto replaceVehicleById(Long id, VehicleReplacementDto vehicleReplacementDto) {
        Optional<Vehicle> existingVehicle = vehicleRepository.findById(id);
        Optional<Vehicle> replacingVehicle = vehicleRepository.findById(vehicleReplacementDto.getVehicle().getId());

        if (existingVehicle.isPresent() && replacingVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

                VehicleReplacement vehicleReplacement = VehicleReplacement
                        .builder()
                        .replacedAt(LocalDateTime.now())
                        .replacedBy(user)
                        .reason(vehicleReplacementDto.getReason())
                        .build();

                Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(existingVehicle.get());
                if(vehicleAssignment.isPresent()){
                    VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                            .assignToEmpId(vehicleAssignment.get().getAssignToEmpId())
                            .assignToEmpName(vehicleAssignment.get().getAssignToEmpName())
                            .vehicle(replacingVehicle.get())
                            .createdBy(user)
                            .createdAt(LocalDate.now())
                            .status(Boolean.TRUE)
                            .build();
                    vehicleAssignmentRepository.save(vehicleAssignment1);

                    vehicleAssignment.get().setStatus(Boolean.FALSE);
                    vehicleAssignment.get().setDeletedAt(LocalDate.now());
                    vehicleAssignment.get().setDeletedBy(user);
                    vehicleAssignment.get().setAssignToEmpId(null);
                    vehicleAssignment.get().setAssignToEmpName(null);
                    vehicleAssignmentRepository.save(vehicleAssignment.get());

                }

                if (existingVehicle.get().getVehicleReplacement() == null) {
                    vehicleReplacement.setVehicle(existingVehicle.get());
                }else{
                    Optional<VehicleReplacement> vehicleReplacement1 = vehicleReplacementRepository.findById(existingVehicle.get().getVehicleReplacement().getId());
                    vehicleReplacement1.ifPresent(replacement -> vehicleReplacement.setVehicle(replacement
                            .getVehicle()));
                }

                vehicleReplacementRepository.save(vehicleReplacement);

                existingVehicle.get().setStatus(Boolean.FALSE);
                replacingVehicle.get().setVehicleReplacement(vehicleReplacement);

                vehicleRepository.save(existingVehicle.get());
                vehicleRepository.save(replacingVehicle.get());
                return toDto(vehicleReplacement);

            }
        }
        throw new RuntimeException("Error Replacing vehicle");
    }

    private VehicleReplacementDto toDto(VehicleReplacement vehicleReplacement) {
        return modelMapper.map(vehicleReplacement, VehicleReplacementDto.class);
    }

    private VehicleReplacement toEntity(VehicleReplacementDto vehicleReplacementDto) {
        return modelMapper.map(vehicleReplacementDto, VehicleReplacement.class);
    }
}
