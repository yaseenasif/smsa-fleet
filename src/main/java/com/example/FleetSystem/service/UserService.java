package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.UserDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.Roles;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.repository.RoleRepository;
import com.example.FleetSystem.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    ModelMapper modelMapper;

    public User addUser(UserDto userDto){
        Set<Roles> rolesList = new HashSet<>();

            for (Roles roleList: userDto.getRoles()) {
                Optional<Roles> roles = Optional.ofNullable(roleRepository
                        .findByName(roleList.getName())
                        .orElseThrow(() -> new RuntimeException("Role is incorrect")));

                rolesList.add(roles.get());
            }

            List<User> userList = userRepository.getActiveUsers();
            for (User user:userList) {
                if (user.getEmail().equals(userDto.getEmail())) {
                    throw new RuntimeException("Email Already Exist");
                }
            }

                User user = User.builder()
                        .name(userDto.getName())
                        .password(bCryptPasswordEncoder.encode(userDto.getPassword()))
                        .roles(rolesList)
                        .status(Boolean.TRUE)
                        .email(userDto.getEmail())
                        .build();
                return userRepository.save(user);

    }
    public List<UserDto> getActiveUsers() {
        List<User> users = userRepository.getActiveUsers();
        return toDtoList(users);
    }

    public UserDto getById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            return toDto(user.get());
        }
        throw new RuntimeException("Record not found");
    }

    public UserDto deleteById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            user.get().setStatus(Boolean.FALSE);
            return toDto(userRepository.save(user.get()));
        }
        throw new RuntimeException("Record doesn't exist");
    }

    public UserDto updateById(Long id,UserDto userDto) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            Set<Roles> rolesList = new HashSet<>();
            for (Roles roleList: userDto.getRoles()) {
                Optional<Roles> roles = Optional.ofNullable(roleRepository
                        .findByName(roleList.getName())
                        .orElseThrow(() -> new RuntimeException("Role is incorrect")));

                rolesList.add(roles.get());
            }


            user.get().setName(userDto.getName());
            user.get().setEmail(userDto.getEmail());
            user.get().setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
            user.get().setRoles(rolesList);

            return toDto(userRepository.save(user.get()));
        }
        throw new RuntimeException("Record doesn't exist");
    }


    public List<UserDto> toDtoList(List<User> userList){
        return userList.stream().map(this::toDto).collect(Collectors.toList());
    }

    private UserDto toDto(User user) {
        return modelMapper.map(user , UserDto.class);
    }


    private User toEntity(UserDto userDto){
        return modelMapper.map(userDto , User.class);
    }

}
