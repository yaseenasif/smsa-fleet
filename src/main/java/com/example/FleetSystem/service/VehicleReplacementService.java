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
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

        if (existingVehicle.isPresent()) {
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

                Vehicle replacingVehicle = vehicleReplacementDto.getVehicle();
                replacingVehicle.setCreatedBy(user);
                replacingVehicle.setCreatedAt(LocalDate.now());

                Date currentDate = Date.valueOf(LocalDate.now());

                if (currentDate.before(vehicleReplacementDto.getVehicle().getRegistrationExpiry()) || currentDate.equals(vehicleReplacementDto.getVehicle().getRegistrationExpiry())) {
                    replacingVehicle.setRegistrationStatus(Boolean.TRUE);
                } else if (currentDate.after(vehicleReplacementDto.getVehicle().getRegistrationExpiry())) {
                    replacingVehicle.setRegistrationStatus(Boolean.FALSE);
                }

                if (currentDate.before(vehicleReplacementDto.getVehicle().getInsuranceExpiry()) || currentDate.equals(vehicleReplacementDto.getVehicle().getInsuranceExpiry())) {
                    replacingVehicle.setInsuranceStatus(Boolean.TRUE);
                } else if (currentDate.after(vehicleReplacementDto.getVehicle().getInsuranceExpiry())) {
                    replacingVehicle.setInsuranceStatus(Boolean.FALSE);
                }
                
                Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(existingVehicle.get());
                if(vehicleAssignment.isPresent()){

                    vehicleRepository.save(replacingVehicle);
                    VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                            .assignToEmpId(vehicleAssignment.get().getAssignToEmpId())
                            .assignToEmpName(vehicleAssignment.get().getAssignToEmpName())
                            .vehicle(replacingVehicle)
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

                }else{
                    replacingVehicle.setVehicleStatus("TBA");
                }

                if (existingVehicle.get().getVehicleReplacement() == null) {
                    vehicleReplacement.setVehicle(existingVehicle.get());
                    replacingVehicle.setReplaceLeaseCost(existingVehicle.get().getLeaseCost()-replacingVehicle.getLeaseCost());
                }else{
                    Optional<VehicleReplacement> vehicleReplacement1 = vehicleReplacementRepository.findById(existingVehicle.get().getVehicleReplacement().getId());
                    vehicleReplacement1.ifPresent(replacement -> {
                        vehicleReplacement.setVehicle(replacement.getVehicle());
                        replacingVehicle.setReplaceLeaseCost(vehicleReplacement1.get().getVehicle().getLeaseCost()
                                - replacingVehicle.getLeaseCost());
                    });
                }

                vehicleReplacementRepository.save(vehicleReplacement);

                existingVehicle.get().setVehicleStatus("Under Maintenance");
                replacingVehicle.setVehicleStatus("Replacement");
                replacingVehicle.setVehicleReplacement(vehicleReplacement);

                vehicleRepository.save(existingVehicle.get());
                vehicleRepository.save(replacingVehicle);
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

    private Vehicle toVehicleEntity(VehicleDto vehicleDto) {
        return modelMapper.map(vehicleDto, Vehicle.class);
    }

}
