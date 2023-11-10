package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.repository.EmployeeRepository;
import com.example.FleetSystem.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;

    public EmployeeDto deleteEmployeeById(Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);

        if(employee.isPresent()){
            employee.get().setStatus(Boolean.FALSE);
            return toDto(employeeRepository.save(employee.get()));
        }

        throw new RuntimeException("Record doesn't exist");

    }

    public EmployeeDto save(EmployeeDto employeeDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            Employee employee = toEntity(employeeDto);
            employee.setDriver(Boolean.FALSE);
            employee.setCreatedBy(user);
            employee.setCreatedAt(LocalDate.now());
            employee.setStatus(Boolean.TRUE);

            return toDto(employeeRepository.save(employee));
        }

        throw new RuntimeException("Error in adding Employee");

    }


    public List<EmployeeDto> getAll() {
        return toDtoList(employeeRepository.getActiveEmployees());
    }

    public EmployeeDto findById(Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if(employee.isPresent()) {
            return toDto(employee.get());
        }
        else {
            throw new RuntimeException(String.format("Employee not found with id => %d", id));
        }
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

                employee.get().setEmpName(employeeDto.getEmpName());
                employee.get().setJobTitle(employeeDto.getJobTitle());
                employee.get().setJoiningDate(employeeDto.getJoiningDate());
                employee.get().setDepartment(employeeDto.getDepartment());
                employee.get().setSection(employeeDto.getSection());
                employee.get().setCity(employeeDto.getCity());
                employee.get().setRegion(employeeDto.getRegion());
                employee.get().setNationality(employeeDto.getNationality());
                employee.get().setContactNumber(employeeDto.getContactNumber());
                employee.get().setCompanyEmailAddress(employeeDto.getCompanyEmailAddress());
                employee.get().setGrade(employeeDto.getGrade());
                employee.get().setLicenseNumber(employeeDto.getLicenseNumber());
                employee.get().setVehicleBudget(employeeDto.getVehicleBudget());
                employee.get().setAttachments(employeeDto.getAttachments());
                employee.get().setUpdatedAt(LocalDate.now());
                employee.get().setUpdatedBy(user);

                return toDto(employeeRepository.save(employee.get()));
            }
        }
        throw new RuntimeException(String.format("Employee Not Found by this Id => %d" , id));
    }

    public EmployeeDto makeEmployeeActive(Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if(employee.isPresent()){
            if(employee.get().isStatus()){
                throw new RuntimeException("Record is already Active");
            }
            employee.get().setStatus(Boolean.TRUE);
            return toDto(employeeRepository.save(employee.get()));
        }
        throw new RuntimeException(String.format("Employee Not Found by this Id => %d" , id));
    }

    public List<EmployeeDto> toDtoList(List<Employee> employeeList){
        return employeeList.stream().map(this::toDto).collect(Collectors.toList());
    }

    private EmployeeDto toDto(Employee employee) {
        return modelMapper.map(employee , EmployeeDto.class);
    }


    private Employee toEntity(EmployeeDto employeeDto){
        return modelMapper.map(employeeDto , Employee.class);
    }

}
