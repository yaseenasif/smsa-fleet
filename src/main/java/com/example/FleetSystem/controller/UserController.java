package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.UserDto;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/user")
    public ResponseEntity<User> addUser(@RequestBody UserDto userDto){

        User user = userService.addUser(userDto);
        return ResponseEntity.ok(user);

    }


}
