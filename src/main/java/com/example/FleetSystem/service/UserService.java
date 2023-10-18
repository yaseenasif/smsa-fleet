package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.UserDto;
import com.example.FleetSystem.model.Roles;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.repository.RoleRepository;
import com.example.FleetSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    RoleRepository roleRepository;

    public User addUser(UserDto userDto){

        try {
            Optional<Roles> roles = Optional.ofNullable(roleRepository
                    .findByName(userDto.getRole())
                    .orElseThrow(() -> new RuntimeException("Role is incorrect")));

            Set<Roles> rolesList = new HashSet<>();
            rolesList.add(roles.get());

            User user = User.builder()
                    .name(userDto.getName())
                    .password(bCryptPasswordEncoder.encode(userDto.getPassword()))
                    .roles(rolesList)
                    .status(Boolean.TRUE)
                    .email(userDto.getEmail())
                    .build();
            return  userRepository.save(user);

        }catch(Exception e){
            throw new RuntimeException("Some information is incorrect");
            }

    }


}
