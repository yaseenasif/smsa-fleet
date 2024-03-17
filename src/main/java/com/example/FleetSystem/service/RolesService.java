package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.RolesDto;
import com.example.FleetSystem.model.Roles;
import com.example.FleetSystem.repository.RoleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RolesService {

    @Autowired
    RoleRepository roleRepository;
    @Autowired
    ModelMapper modelMapper;

    public RolesDto addRoles(RolesDto rolesDto) {
        Roles roles = toEntity(rolesDto);
        Optional<Roles> existingRole = roleRepository.findByName(rolesDto.getName());

        if (existingRole.isPresent()) {
            throw new RuntimeException("This role " + rolesDto.getName() + " already exist ");
        } else {
            existingRole = Optional.of(roleRepository.save(roles));
        }
        return toDto(existingRole.get());
    }


    public List<RolesDto> getAll() {
        return toDtoList(roleRepository.findAll());
    }

    public RolesDto getById(Long id) {
        Optional<Roles> roles = roleRepository.findById(id);
        if (roles.isPresent()) {
            return toDto(roles.get());
        }
        throw new RuntimeException(String.format("Role Not Found On this Id => %d", id));
    }

    public void deleteRoleById(Long id) {
        Optional<Roles> roles = roleRepository.findById(id);
        if (roles.isPresent()) {
            roleRepository.deleteById(id);
        }
        throw new RuntimeException("Record doesn't exist");
    }

    public List<RolesDto> toDtoList(List<Roles> roles) {
        return roles.stream().map(this::toDto).collect(Collectors.toList());
    }

    private Roles toEntity(RolesDto rolesDto) {
        return modelMapper.map(rolesDto, Roles.class);
    }

    public RolesDto toDto(Roles roles) {
        return modelMapper.map(roles, RolesDto.class);
    }

    public Roles updateRole(Long id, Roles role) {
        return roleRepository.findById(id)
                .map(existingRole -> {
                    existingRole.setName(role.getName());
                    existingRole.setPermissions(role.getPermissions());
                    return roleRepository.save(existingRole);
                })
                .orElseThrow(() -> new RuntimeException(String.format("Role Not Found by this Id => %d", id)));
    }

}
