package com.example.FleetSystem.configuration;

import com.example.FleetSystem.dto.VehicleExcelDto;
import com.example.FleetSystem.model.Vehicle;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.typeMap( Vehicle.class,VehicleExcelDto.class).addMappings(mp -> {
            mp.skip(VehicleExcelDto::setReplacementVehicle);
        });

        return modelMapper;
    }

}
