package com.example.FleetSystem.controller;

import com.example.FleetSystem.model.Permission;
import com.example.FleetSystem.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PostMapping("/permission")
    public Permission addPermission(@RequestBody Permission permission){
        return permissionService.addPermission(permission);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/permission")
    public ResponseEntity<List<Permission>> getActivePermissions(){
        return ResponseEntity.ok(permissionService.getActivePermissions());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @GetMapping("/permission/{id}")
    public ResponseEntity<Permission> findPermissionById(@PathVariable Long id){
        return ResponseEntity.ok(permissionService.findPermissionById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PatchMapping("/permission/{id}")
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id,@RequestBody Permission permission){
        return ResponseEntity.ok(permissionService.updatePermission(id,permission));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @DeleteMapping("/permission/{id}")
    public ResponseEntity<Permission> deletePermissionById(@PathVariable Long id){
        return ResponseEntity.ok(permissionService.deleteById(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER')")
    @PatchMapping("/permission/active/{id}")
    public ResponseEntity<Permission> makePermissionActive(@PathVariable Long id){
        return ResponseEntity.ok(permissionService.makePermissionActive(id));
    }


}
