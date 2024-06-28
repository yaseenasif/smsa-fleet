package com.example.FleetSystem.service;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.*;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.Employee;
import com.example.FleetSystem.model.User;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.model.VehicleAssignment;
import com.example.FleetSystem.payload.ExcelErrorResponse;
import com.example.FleetSystem.repository.EmployeeRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleAssignmentRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import com.example.FleetSystem.specification.VehicleAssignmentSpecification;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VehicleAssignmentService {

    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    StorageService storageService;
    //    @Autowired
//    DriverRepository driverRepository;
    @Autowired
    AuditService vehicleAssignmentAuditService;
    @Autowired
    ExcelExportService excelExportService;
    @Autowired
    FileHistoryRepository fileHistoryRepository;

    public VehicleAssignmentDto save(VehicleAssignmentDto vehicleAssignmentDto) {
        Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principle instanceof UserDetails) {
            String username = ((UserDetails) principle).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(vehicleAssignmentDto.getVehicle().getPlateNumber());
            Optional<Employee> employee = employeeRepository.findById(vehicleAssignmentDto.getAssignToEmpId().getId());
            if (vehicle.isPresent()) {
                Optional<VehicleAssignment> existingVehicleAssignment = vehicleAssignmentRepository.findByVehicle(vehicle.get());
                if (employee.isPresent()) {
//                    Optional<Driver> driver = driverRepository.findByEmpId(employee.get());
//                    driver.ifPresent(value -> value.setAssignedVehicle(vehicle.get().getPlateNumber()));
                    vehicle.get().setVehicleStatus("Active");

                    if (existingVehicleAssignment.isPresent()) {
                        existingVehicleAssignment.get().setAssignToEmpId(employee.get());
                        existingVehicleAssignment.get().setAssignToEmpName(employee.get().getEmpName());
                        existingVehicleAssignment.get().setStatus(Boolean.TRUE);
                        existingVehicleAssignment.get().setUpdatedBy(user);
                        existingVehicleAssignment.get().setUpdatedAt(LocalDate.now());
                        return toDto(vehicleAssignmentRepository.save(existingVehicleAssignment.get()));
                    }
                    VehicleAssignment vehicleAssignment = toEntity(vehicleAssignmentDto);
                    vehicleAssignment.setVehicle(vehicle.get());
                    vehicleAssignment.setAssignToEmpId(employee.get());
                    vehicleAssignment.setAssignToEmpName(employee.get().getEmpName());
                    vehicleAssignment.setStatus(Boolean.TRUE);
                    vehicleAssignment.setCreatedAt(LocalDate.now());
                    vehicleAssignment.setCreatedBy(user);

                    VehicleAssignment savedAssignment = vehicleAssignmentRepository.save(vehicleAssignment);
                    return toDto(savedAssignment);
                } else {
                    throw new RuntimeException("Employee Not Found");
                }
            } else {
                throw new RuntimeException("Vehicle Not Found");
            }

        }
        throw new RuntimeException("Error adding Vehicle Assignment");
    }

    public List<VehicleAssignmentDto> getActiveVehicleAssignment() {
        return toDtoList(vehicleAssignmentRepository.getActiveVehicleAssignment());
    }

    public VehicleAssignmentDto getById(Long id) {
        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findById(id);

        if (optionalVehicleAssignment.isPresent()) {
            return toDto(optionalVehicleAssignment.get());
        }
        throw new RuntimeException(String.format("Vehicle Not Found On this Id => %d", id));
    }

    public void deleteVehicleAssignmentById(Long id) {
        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findById(id);
        if (optionalVehicleAssignment.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

//                Optional<Driver> driver = driverRepository.findByEmpId(optionalVehicleAssignment.get().getAssignToEmpId());
//                driver.ifPresent(value -> value.setAssignedVehicle(null));

                Optional<Vehicle> vehicle = vehicleRepository.findById(optionalVehicleAssignment.get().getVehicle().getId());
                vehicle.ifPresent(value -> value.setVehicleStatus("TBA"));

                optionalVehicleAssignment.get().setStatus(Boolean.FALSE);
                optionalVehicleAssignment.get().setDeletedAt(LocalDate.now());
                optionalVehicleAssignment.get().setDeletedBy(user);
                optionalVehicleAssignment.get().setAssignToEmpId(null);
                optionalVehicleAssignment.get().setAssignToEmpName(null);
                vehicleAssignmentRepository.save(optionalVehicleAssignment.get());
            }
        } else throw new RuntimeException("Record does not exist");
    }

    public VehicleAssignmentDto updateById(Long id, VehicleAssignmentDto vehicleAssignmentDto) {

        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findById(id);
        if (vehicleAssignment.isPresent()) {
            Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principle instanceof UserDetails) {
                String username = ((UserDetails) principle).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                Optional<Employee> employee = employeeRepository.findById(vehicleAssignmentDto.getAssignToEmpId().getId());
                if (employee.isPresent()) {
                    vehicleAssignment.get().setAssignToEmpId(employee.get());
                    vehicleAssignment.get().setAssignToEmpName(employee.get().getEmpName());

                    if (!vehicleAssignmentDto.isStatus()) {
                        vehicleAssignment.get().setStatus(Boolean.TRUE);
                    }

                    vehicleAssignment.get().setUpdatedBy(user);
                    vehicleAssignment.get().setUpdatedAt(LocalDate.now());

                    VehicleAssignment updatedVehicleAssignment = vehicleAssignmentRepository.save(vehicleAssignment.get());

                    return toDto(updatedVehicleAssignment);
                }
                throw new RuntimeException("EMPLOYEE NOT FOUND");
            }

        }

        throw new RuntimeException(String.format("Vehicle Assignment not found for id => %id", id));
    }

    public VehicleAssignmentDto getByPlateNumber(String plateNumber) {
        Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(plateNumber);

        if (vehicle.isPresent()) {
            Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(vehicle.get());

            if (vehicleAssignment.isPresent()) {
                return toDto(vehicleAssignment.get());
            }
        }

        throw new RuntimeException(String.format("Record Not Found By the PlateNumber : %s", plateNumber));
    }

    public List<VehicleAssignmentDto> toDtoList(List<VehicleAssignment> vehicleAssignments) {
        return vehicleAssignments.stream().map(this::toDto).collect(Collectors.toList());
    }

    public VehicleAssignmentDto toDto(VehicleAssignment vehicleAssignment) {
        return modelMapper.map(vehicleAssignment, VehicleAssignmentDto.class);
    }

    private VehicleAssignment toEntity(VehicleAssignmentDto vehicleAssignmentDto) {
        return modelMapper.map(vehicleAssignmentDto, VehicleAssignment.class);
    }


    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException {
        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findById(id);
        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());

        if (byFileName == null) {
            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
            String originalFileName = multipartFile.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            FileMetaData fileMetaData = new FileMetaData();
            fileMetaData.setFileUrl(fileUrl);
            fileMetaData.setFileExtension(fileExtension);
            fileMetaData.setFileName(multipartFile.getOriginalFilename());
            fileMetaData.setVehicleAssignment(vehicleAssignment.get());
            fileMetaData.setAttachmentType(attachmentType);
            fileMetaDataRepository.save(fileMetaData);

            return ResponseMessage.builder()
                    .message(Collections.singletonList("File uploaded to the server successfully"))
                    .build();
        } else {
            throw new RuntimeException(String.format("File already exists on the bucket with the same name"));
        }
    }

    public Page<VehicleAssignmentDto> searchAssignmentByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationByPlateNumber(vehicleSearchCriteria,getUserRegions());
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    private Set<Region> getUserRegions() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            return user.getRegions();
        } else {
            return null;
        }
    }
    public Page<VehicleAssignmentDto> searchInactiveAssignmentByPlateNumber(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getInactiveSearchSpecificationByPlateNumber(vehicleSearchCriteria);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public Page<VehicleAssignmentDto> searchAssignmentByEmployeeNumber(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationByEmployeeNumber(employeeSearchCriteria);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public Page<VehicleAssignmentDto> searchInactiveAssignmentByEmployeeNumber(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getInactiveSearchSpecificationByEmployeeNumber(employeeSearchCriteria);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public VehicleAssignmentDto getByVehicleId(Long vehicleId) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        if (vehicle.isPresent()) {
            Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(vehicle.get());
            return vehicleAssignment.map(this::toDto).orElse(null);
        }
        throw new RuntimeException(String.format("Vehicle not Found By id => %d", vehicleId));
    }

    public Page<VehicleAssignmentDto> searchAssignmentByRegion(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationByRegion(vehicleSearchCriteria, vehicleStatus);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public Page<VehicleAssignmentDto> searchAssignmentByDepartment(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationByDepartment(vehicleSearchCriteria, vehicleStatus);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public Page<VehicleAssignmentDto> searchAssignmentBySection(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationBySection(vehicleSearchCriteria, vehicleStatus);
        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);
        return vehicleAssignmentPage.map(this::toDto);
    }

    public Page<VehicleAssignmentDto> getVehicleAssignmentBySearchCriteria(int pageNumber, int pageSize, VehicleAssignmentDto searchCriteria) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Specification<VehicleAssignment> vehicleAssignmentSpecification = VehicleAssignmentSpecification.getSearchSpecificationByCriteria(searchCriteria);

        Page<VehicleAssignment> vehicleAssignmentPage = vehicleAssignmentRepository.findAll(vehicleAssignmentSpecification, pageable);

        return vehicleAssignmentPage.map(this::toDto);
    }

    //    public PaginationResponse getVehicleAssignmentBySearchCriteria(int pageNumber, int pageSize, VehicleAssignmentDto searchCriteria) {
//        Pageable page = PageRequest.of(pageNumber, pageSize);
//        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//        CriteriaQuery<VehicleAssignment> cq = criteriaBuilder.createQuery(VehicleAssignment.class);
//        Root<VehicleAssignment> vehicleAssignmentRoot = cq.from(VehicleAssignment.class);
//
//        Join<VehicleAssignment, Employee> employeeJoin = vehicleAssignmentRoot.join("assignToEmpId");
//        List<Predicate> predicates = new ArrayList<>();
//
//        if (searchCriteria.getAssignToEmpId().getRegion() != null) {
//            predicates.add(criteriaBuilder.like(employeeJoin.get("region"), searchCriteria.getAssignToEmpId().getRegion()));
//        }
//
//        if (searchCriteria.getAssignToEmpId().getDepartment() != null) {
//            predicates.add(criteriaBuilder.like(employeeJoin.get("department"), searchCriteria.getAssignToEmpId().getDepartment()));
//        }
//
//        if (searchCriteria.getAssignToEmpId().getSection() != null) {
//            predicates.add(criteriaBuilder.like(employeeJoin.get("section"), searchCriteria.getAssignToEmpId().getSection()));
//        }
//
//        cq.where(predicates.toArray(new Predicate[0]));
//        TypedQuery<VehicleAssignment> query = entityManager.createQuery(cq);
//
//        int firstResult = pageNumber * pageSize;
//        query.setFirstResult(firstResult);
//        query.setMaxResults(pageSize);
//
//        List<VehicleAssignment> resultList = query.getResultList();
//
//        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
//        Root<VehicleAssignment> countRoot = countQuery.from(VehicleAssignment.class);  // Use the same root
//        countQuery.select(criteriaBuilder.count(countRoot));
//        countQuery.where(predicates.toArray(new Predicate[0]));
//
//        Join<VehicleAssignment, Employee> countEmployeeJoin = countRoot.join("assignToEmpId");
//        predicates.forEach(predicate -> countEmployeeJoin.on(predicate));
//
//        Long totalElements = entityManager.createQuery(countQuery).getSingleResult();
//
//        List<VehicleAssignmentDto> dtoList = resultList.stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//
//        PaginationResponse paginationResponse = new PaginationResponse();
//        Obj obj = new Obj();
//        obj.setPageNumber(pageNumber);
//        paginationResponse.setContent(dtoList);
//        paginationResponse.setPageable(obj);
//        paginationResponse.setSize(pageSize);
//        paginationResponse.setTotalElements(totalElements.intValue());
//        paginationResponse.setTotalPages((int) Math.ceil((double) totalElements / pageSize));
//        paginationResponse.setLastPage(pageNumber >= (Math.ceil((double) totalElements / pageSize) - 1));
//
//        return paginationResponse;
//    }

    public Employee getLastAssignmentByVehicleId(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            List<AssignmentAuditDataWrapper> assignmentList = vehicleAssignmentAuditService.retrieveAssignmentAuditData(vehicle.get().getId());

            for (int i = assignmentList.size() - 1; i >= 0; i--) {
                AssignmentAuditDataWrapper assignment = assignmentList.get(i);
                if (assignment.getEntity().isStatus()) {
                    Optional<Employee> employee = employeeRepository.findById(assignment.getEntity().getAssignToEmpId().getId());
                    if (employee.isPresent()) {
                        return employee.get();
                    }
                }
            }
            throw new RuntimeException("No Last Assignment Found");
        }
        throw new RuntimeException(String.format("Vehicle not found By id => %d", id));
    }

    private AssignmentExcelDto toAssignmentExcelDto(VehicleAssignment vehicleAssignment) {
        AssignmentExcelDto assignmentExcelDto = modelMapper.map(vehicleAssignment, AssignmentExcelDto.class);
        assignmentExcelDto.setEmpNo(vehicleAssignment.getAssignToEmpId().getEmployeeNumber());
        assignmentExcelDto.setEmpName(vehicleAssignment.getAssignToEmpName());
        assignmentExcelDto.setPlateNumber(vehicleAssignment.getVehicle().getPlateNumber());
        assignmentExcelDto.setDepartment(vehicleAssignment.getAssignToEmpId().getDepartment());
        assignmentExcelDto.setSection(vehicleAssignment.getAssignToEmpId().getSection());
        assignmentExcelDto.setRegion(vehicleAssignment.getAssignToEmpId().getRegion());
        assignmentExcelDto.setDesign(vehicleAssignment.getVehicle().getDesign());
        assignmentExcelDto.setModel(vehicleAssignment.getVehicle().getModel());
        assignmentExcelDto.setMake(vehicleAssignment.getVehicle().getMake());
        assignmentExcelDto.setYear(vehicleAssignment.getVehicle().getYear());
        assignmentExcelDto.setLeaseCost(vehicleAssignment.getVehicle().getLeaseCost());
        assignmentExcelDto.setLeaseExpiry(vehicleAssignment.getVehicle().getLeaseExpiryDate());
        return assignmentExcelDto;
    }

    private List<AssignmentExcelDto> toAssignmentExcelDtoList(List<VehicleAssignment> vehicleAssignments) {
        return vehicleAssignments.stream().map(this::toAssignmentExcelDto).collect(Collectors.toList());
    }

    public byte[] downloadExcel() {
        List<VehicleAssignment> vehicleAssignments = vehicleAssignmentRepository.getActiveVehicleAssignment();
        List<AssignmentExcelDto> assignmentExcelDtoList = toAssignmentExcelDtoList(vehicleAssignments);
        return excelExportService.exportToExcel(assignmentExcelDtoList);
    }

    @Transactional
    public List<String> bulkUploadAssignment(MultipartFile file) {
        List<String> messages = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();

            ExcelErrorResponse checkFile = validateExcelFile(fileName, sheet);
            if (checkFile.isStatus()) {
                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {

                        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                        if (principal instanceof UserDetails) {
                            String username = ((UserDetails) principal).getUsername();
                            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                            Optional<Vehicle> vehicle = vehicleRepository.getEligibleVehicle(getStringValue(row.getCell(0)));
//                            Optional<Employee> employee = employeeRepository.findEligibleEmployee(getLongValue(row.getCell(1)));

                            Optional<Employee> employee = employeeRepository.findByEmployeeNumber(getLongValue(row.getCell(1)));

                            if (vehicle.isPresent()) {
                                Optional<VehicleAssignment> vehicleAssignment1 = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(vehicle.get());
                                if (employee.isPresent()) {
                                    if (vehicleAssignment1.isPresent()) {
                                        vehicleAssignment1.get().setAssignToEmpId(employee.get());
                                        vehicleAssignment1.get().setAssignToEmpName(employee.get().getEmpName());
                                        vehicleAssignment1.get().setUpdatedBy(user);
                                        vehicleAssignment1.get().setUpdatedAt(LocalDate.now());
                                        vehicleAssignment1.get().setStatus(Boolean.TRUE);
                                        vehicleAssignmentRepository.save(vehicleAssignment1.get());
                                    } else {
                                        VehicleAssignment vehicleAssignment = new VehicleAssignment();
                                        vehicleAssignment.setAssignToEmpId(employee.get());
                                        vehicleAssignment.setAssignToEmpName(employee.get().getEmpName());
                                        vehicleAssignment.setVehicle(vehicle.get());
                                        vehicleAssignment.setCreatedAt(LocalDate.now());
                                        vehicleAssignment.setCreatedBy(user);
                                        vehicleAssignment.setStatus(Boolean.TRUE);
                                        vehicleAssignmentRepository.save(vehicleAssignment);
                                    }
                                    vehicle.get().setVehicleStatus("Active");
                                    vehicleRepository.save(vehicle.get());
                                } else {
                                    messages.add("Employee not in the record\n");
                                    messages.add(getLongValue(row.getCell(1)).toString());
                                    messages.add("Row: " + rowNum);
                                    throw new ExcelException(messages);
                                }
                            } else {
                                messages.add("Vehicle is not eligible for assignment\n");
                                messages.add(getStringValue(row.getCell(0)));
                                messages.add("Row: " + rowNum);
                                throw new ExcelException(messages);
                            }

                        } else {
                            messages.add("UserName not Found");
                            return messages;
                        }
                    }else break;
                }
                    FileHistory fileHistory = FileHistory.builder()
                            .fileName(fileName)
                            .uuid(uuid)
                            .build();
                    fileHistoryRepository.save(fileHistory);

                    messages.add("File uploaded and data saved successfully.");
                    return messages;

            }else {
                messages.addAll(checkFile.getMessage());
                throw new ExcelException(messages);
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading the file: " + e.getMessage());
        }
    }

    private String getStringValue(Cell cell) {

        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf(cell.getNumericCellValue());
        } else {
            return null;
        }
    }

    private Long getLongValue(Cell cell){
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (long) cell.getNumericCellValue();
            }
        }
        return null;
    }
    private ExcelErrorResponse validateExcelFile(String fileName, Sheet sheet) {

        Optional<FileHistory> fileHistory = Optional.ofNullable(fileHistoryRepository.findByFileName(fileName));
        if (fileHistory.isPresent()) {
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(fileName + " is already uploaded. Please upload a different File."));
        } else {
                Map<Integer, String> plateNumberList = new HashMap<>();
                Map<Integer, Long> employeeNumberList = new HashMap<>();


                Row headerRow = sheet.getRow(0);
                String[] expectedHeaders = {"PlateNumber", "EmployeeNumber"};

                for (int i = 0; i < expectedHeaders.length; i++) {
                    String expectedHeader = expectedHeaders[i];
                    String actualHeader = headerRow.getCell(i).toString();

                    if (!actualHeader.replaceAll("\\s", "").equalsIgnoreCase(expectedHeader)) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Error in column : " + actualHeader,
                                "Row : " + (headerRow.getRowNum() + 1) + " and Cell : " + (i + 1)
                                , "Please check the Sample Format of Excel File"));
                    }
                }

                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {

                        String plateNumberPattern = "\\d{4} [A-Z]{3}";

                        for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                            if (String.valueOf(row.getCell(cellNum)).isEmpty()) {
                                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)));
                            }
                        }

                        if (!getStringValue(row.getCell(0)).matches(plateNumberPattern)) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Plate Number Format : " + row.getCell(0),
                                    "Row " + (rowNum + 1) + " and Cell 1", "Correct Format : 1234 ABC"));
                        }

//                        Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(0)));
//                        if (!vehicle.isPresent()) {
//                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Plate Number : " + getStringValue(row.getCell(0)) +
//                                    " doesn't exist in the record", "Row : " + (rowNum + 1)));
//                        }
//
//                        Optional<Employee> employee = employeeRepository.findByEmployeeNumber(getLongValue(row.getCell(1)));
//                        if (!employee.isPresent()) {
//                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Employee Number : " + getStringValue(row.getCell(1)) +
//                                    " doesn't exist in the record", "Row : " + (rowNum + 1)));
//                        }

                        ExcelErrorResponse checkDuplicatePlateNumber = checkDuplicatePlateNumber(plateNumberList, row);
                        if (!checkDuplicatePlateNumber.isStatus()) {
                            return checkDuplicatePlateNumber;
                        }

                        ExcelErrorResponse checkDuplicateEmployeeNumber = checkDuplicateEmployeeNumber(employeeNumberList, row);
                        if (!checkDuplicateEmployeeNumber.isStatus()) {
                            return checkDuplicateEmployeeNumber;
                        }


                    }else break;
                }

                return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Excel File is in Correct Format"));

            }
        }

    private ExcelErrorResponse checkDuplicatePlateNumber(Map<Integer, String> plateNumberList, Row row) {
        String plateNumber = getStringValue(row.getCell(0));

        for (Map.Entry<Integer, String> entry : plateNumberList.entrySet()) {
            if (plateNumber.equals(entry.getValue())) {
                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Duplicate Record in the Row : " + entry.getKey() + " and " + (row.getRowNum() + 1),
                        "Duplicate Plate Number : " + plateNumber));
            }
        }
        plateNumberList.put(row.getRowNum() + 1, plateNumber);
        return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("No Duplicate Record"));
    }

    private ExcelErrorResponse checkDuplicateEmployeeNumber(Map<Integer, Long> employeeNumbers, Row row){

        Long empNum = getLongValue(row.getCell(1));

        for (Map.Entry<Integer, Long> entry : employeeNumbers.entrySet()) {
            if(empNum.equals(entry.getValue())){
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Duplicate Record in the Row : "+entry.getKey()+" and "+(row.getRowNum()+1),
                        "Duplicate Employee Number : "+empNum));
            }
        }
        employeeNumbers.put(row.getRowNum()+1,empNum);
        return new ExcelErrorResponse(Boolean.TRUE,Arrays.asList("No Duplicate Record"));
    }

}