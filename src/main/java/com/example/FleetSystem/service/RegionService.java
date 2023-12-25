package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.dto.RegionDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.Region;
import com.example.FleetSystem.repository.RegionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegionService {

    @Autowired
    RegionRepository regionRepository;
    @Autowired
    ModelMapper modelMapper;

    public RegionDto save(RegionDto regionDto) {
        Region region = toEntity(regionDto);
        Optional<Region> existingRegion = regionRepository.findByNameAndStatusIsTrue(regionDto.getName());
        if (!existingRegion.isPresent()) {
            region.setStatus(Boolean.TRUE);
            return toDto(regionRepository.save(region));
        }
        throw new RuntimeException("This Region already exist " + regionDto.getName());
    }

    public List<RegionDto> getActiveRegion() {
        return toDtoList(regionRepository.getActiveRegions());
    }

    public RegionDto getById(Long id) {
        Optional<Region> optionalRegion = regionRepository.findById(id);
        if (optionalRegion.isPresent()) {
            return toDto(optionalRegion.get());
        }
        throw new RuntimeException("Region not found by id: " + id);
    }


    public List<RegionDto> getAllRegions(String country) {
        List<Region> regions = regionRepository.findByCountryAndStatusIsTrue(country);
        return regions.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    public RegionDto updateRegionById(Long id, RegionDto regionDto) {
        Optional<Region> region = regionRepository.findById(id);
        if (region.isPresent()) {
            region.get().setName(regionDto.getName());
            region.get().setCities(regionDto.getCities());
            region.get().setCountry(regionDto.getCountry());
            return toDto(regionRepository.save(region.get()));
        }
        throw new RuntimeException("Region not found By id : " + id);
    }

    public RegionDto deleteById(Long id) {
        Optional<Region> region = regionRepository.findById(id);
        if (region.isPresent()) {
            region.get().setStatus(Boolean.FALSE);
            return toDto(regionRepository.save(region.get()));
        }
        throw new RuntimeException("Region not found by id : " + id);
    }

    public List<RegionDto> toDtoList(List<Region> regionList) {
        return regionList.stream().map(this::toDto).collect(Collectors.toList());
    }

    public RegionDto toDto(Region region) {
        return modelMapper.map(region, RegionDto.class);
    }

    private Region toEntity(RegionDto regionDto) {
        return modelMapper.map(regionDto, Region.class);
    }

    public RegionDto getAllCitiesByRegion(String name) {
        Optional<Region> regions = regionRepository.findByNameAndStatusIsTrue(name);
        if (regions.isPresent()){
            return toDto(regions.get());
        }
        throw new RuntimeException("Region not found by name : " + name);
    }
}
