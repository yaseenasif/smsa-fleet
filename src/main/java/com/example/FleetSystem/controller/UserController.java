package com.example.FleetSystem.controller;

import com.example.FleetSystem.dto.UserDto;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PROJECT_MANAGER')")
    @PostMapping("/user")
    public ResponseEntity<User> addUser(@RequestBody UserDto userDto){
        User user = userService.addUser(userDto);
        return ResponseEntity.ok(user);

    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PROJECT_MANAGER')")
    @GetMapping("/active-user")
    public ResponseEntity<List<UserDto>> getActiveUser(){
        return ResponseEntity.ok(userService.getActiveUsers());

    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PROJECT_MANAGER')")
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PROJECT_MANAGER')")
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<UserDto> deleteById(@PathVariable Long id){
        return ResponseEntity.ok(userService.deleteById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_PROJECT_MANAGER')")
    @PatchMapping("/update-user/{id}")
    public ResponseEntity<UserDto> updateById(@PathVariable Long id, @RequestBody UserDto userDto){
        return ResponseEntity.ok(userService.updateById(id,userDto));
    }




}
