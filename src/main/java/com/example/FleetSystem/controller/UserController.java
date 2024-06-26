package com.example.FleetSystem.controller;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.UserDto;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.payload.ResponsePayload;
import com.example.FleetSystem.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PostMapping("/user")
    public ResponseEntity<User> addUser(@RequestBody UserDto userDto) {
        User user = userService.addUser(userDto);
        return ResponseEntity.ok(user);

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/active-user")
    public ResponseEntity<List<UserDto>> getActiveUser() {
        return ResponseEntity.ok(userService.getActiveUsers());

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<UserDto> deleteById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PatchMapping("/update-user/{id}")
    public ResponseEntity<UserDto> updateById(@PathVariable Long id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateById(id, userDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/get-by-empId/{id}")
    public ResponseEntity<UserDto> getByEmpId(@PathVariable String id) {
        return ResponseEntity.ok(userService.getByEmpId(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @PatchMapping("/update-password/{id}")
    public ResponseEntity<UserDto> updatePasswordById(
            @PathVariable Long id, @RequestParam String newPassword
    ) {
        return ResponseEntity.ok(userService.updatePasswordById(id, newPassword));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/search-all-user")
    public ResponseEntity<Page<UserDto>> searchAllUsers(@RequestParam(value = "value", required = false) String value,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "7") int size) throws JsonProcessingException {
        VehicleSearchCriteria searchCriteria = VehicleSearchCriteria.builder().value(value).build();
        return ResponseEntity.ok(userService.searchUserSpecification(searchCriteria,page, size));
    }

}
