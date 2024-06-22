package com.example.FleetSystem.dto;

import com.example.FleetSystem.model.Region;
import com.example.FleetSystem.model.Roles;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class UserDto {

    private Long id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Role is required")
    private Set<Roles> roles;
    private boolean status;
    private String employeeId;
    private Set<Region> regions;

}
