package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.CityDto;
import com.example.FleetSystem.dto.GradeDto;
import com.example.FleetSystem.model.City;
import com.example.FleetSystem.model.Grade;
import com.example.FleetSystem.repository.CityRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CityService {

    @Autowired
    CityRepository cityRepository;

    @Autowired
    ModelMapper modelMapper;

    public CityDto addCity(CityDto cityDto) {
        City city = toEntity(cityDto);
        Optional<City> existingCity = cityRepository.findByName(cityDto.getName());
        if (!existingCity.isPresent()){
            city.setStatus(Boolean.TRUE);
            return toDto(cityRepository.save(city));
        }
        throw new RuntimeException("This City already exist " + cityDto.getName());
    }


    public List<CityDto> getActiveCities() {
        return toDtoList(cityRepository.getActiveCities());
    }

    public CityDto getById(Long id) {
        Optional<City> optionalCity = cityRepository.findById(id);
        if(optionalCity.isPresent()){
            return toDto(optionalCity.get());
        }
        throw new RuntimeException("City not found by id: " + id);
    }

    public CityDto updateCityById(Long id, CityDto cityDto) {
        Optional<City> city = cityRepository.findById(id);
        if (city.isPresent()){
            city.get().setName(cityDto.getName());
            city.get().setRegion(cityDto.getRegion());
            return toDto(cityRepository.save(city.get()));
        }
        throw new RuntimeException("City not found By id : "+id);
    }

    public CityDto deleteById(Long id) {
        Optional<City> city = cityRepository.findById(id);
        if (city.isPresent()){
            city.get().setStatus(Boolean.FALSE);
            return toDto(cityRepository.save(city.get()));
        }
        throw new RuntimeException("City not found by id : "+id);
    }

    public List<CityDto> toDtoList(List<City> cityList){
        return cityList.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CityDto toDto(City city){
        return modelMapper.map(city, CityDto.class);
    }

    private City toEntity(CityDto cityDto){
        return modelMapper.map(cityDto , City.class);
    }

}
