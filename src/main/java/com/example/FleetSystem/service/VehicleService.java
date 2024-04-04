package com.example.FleetSystem.service;

import com.example.FleetSystem.criteria.VehicleSearchCriteria;
import com.example.FleetSystem.dto.AssignmentAuditDataWrapper;
import com.example.FleetSystem.dto.VehicleAuditDataWrapper;
import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.dto.VehicleExcelDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.*;
import com.example.FleetSystem.repository.FileHistoryRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import com.example.FleetSystem.repository.VendorRepository;
import com.example.FleetSystem.specification.VehicleSpecification;
import com.example.FleetSystem.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.hibernate.envers.RevisionType;
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
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    FileHistoryRepository fileHistoryRepository;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    FileMetaDataRepository fileMetaDataRepository;
    @Autowired
    StorageService storageService;
    @Autowired
    AuditService vehicleAssignmentAuditService;
//    @Autowired
//    VehicleReplacementRepository vehicleReplacementRepository;
    @Autowired
    ProductFieldRepository productFieldRepository;
    @Autowired
    ExcelExportService excelExportService;
    @Autowired
    RegionRepository regionRepository;
    @Autowired
    EmployeeRepository employeeRepository;

    @Transactional
    public VehicleDto finalReturnVehicleById(Long id, FinalReturnRequest finalReturnRequest) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                Vehicle replacingVehicle = null;
                if (finalReturnRequest.getReplacementVehicle() != null) {
                    Optional<Vehicle> optionalVehicle = vehicleRepository.findByPlateNumber(finalReturnRequest.getReplacementVehicle().getPlateNumber());
                    if (optionalVehicle.isPresent()) {
                        throw new RuntimeException("Plate number Already exist : " + finalReturnRequest.getReplacementVehicle().getPlateNumber());
                    }

                    replacingVehicle = toEntity(finalReturnRequest.getReplacementVehicle());
                    replacingVehicle.setCreatedAt(LocalDateTime.now());
                    replacingVehicle.setCreatedBy(user);

                    Date currentDate = Date.valueOf(LocalDate.now());

                    if (currentDate.before(finalReturnRequest.getReplacementVehicle().getRegistrationExpiry()) || currentDate.equals(finalReturnRequest.getReplacementVehicle().getRegistrationExpiry())) {
                        replacingVehicle.setRegistrationStatus(Boolean.TRUE);
                    } else if (currentDate.after(finalReturnRequest.getReplacementVehicle().getRegistrationExpiry())) {
                        replacingVehicle.setRegistrationStatus(Boolean.FALSE);
                    }

                    if (currentDate.before(finalReturnRequest.getReplacementVehicle().getInsuranceExpiry()) || currentDate.equals(finalReturnRequest.getReplacementVehicle().getInsuranceExpiry())) {
                        replacingVehicle.setInsuranceStatus(Boolean.TRUE);
                    } else if (currentDate.after(finalReturnRequest.getReplacementVehicle().getInsuranceExpiry())) {
                        replacingVehicle.setInsuranceStatus(Boolean.FALSE);
                    }
                }

                if (vehicle.get().getVehicleStatus().equals("TBA") && replacingVehicle != null) {
                    replacingVehicle.setVehicleStatus("TBA");
                    vehicleRepository.save(replacingVehicle);
                }

                if (vehicle.get().getVehicleStatus().equals("Active")) {
                    Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(vehicle.get());
                    if (replacingVehicle != null) {
                        replacingVehicle.setVehicleStatus("Active");
                        vehicleRepository.save(replacingVehicle);
                        VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                                .vehicle(replacingVehicle)
                                .createdBy(user)
                                .createdAt(LocalDate.now())
                                .status(Boolean.TRUE)
                                .build();

                        if (finalReturnRequest.getChangedAssignment() != null) {
                            vehicleAssignment1.setAssignToEmpId(finalReturnRequest.getChangedAssignment().getAssignToEmpId());
                            vehicleAssignment1.setAssignToEmpName(finalReturnRequest.getChangedAssignment().getAssignToEmpName());

                        } else {
                            vehicleAssignment1.setAssignToEmpId(vehicleAssignment.get().getAssignToEmpId());
                            vehicleAssignment1.setAssignToEmpName(vehicleAssignment.get().getAssignToEmpName());
                        }
                        vehicleAssignmentRepository.save(vehicleAssignment1);
                    }

                    vehicleAssignment.get().setAssignToEmpId(null);
                    vehicleAssignment.get().setAssignToEmpName(null);
                    vehicleAssignment.get().setStatus(Boolean.FALSE);

                    vehicleAssignmentRepository.save(vehicleAssignment.get());
                } else if (vehicle.get().getVehicleStatus().equals("Under Maintenance")) {
                    Optional<Vehicle> temporaryReplacement = vehicleRepository.findByReplacementVehicle(vehicle.get());
                    if (temporaryReplacement.isPresent()) {
                        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(temporaryReplacement.get());
                        if (replacingVehicle != null) {
                            if (vehicleAssignment.isPresent()) {

                                replacingVehicle.setVehicleStatus("Active");
                                vehicleRepository.save(replacingVehicle);
                                VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                                        .vehicle(replacingVehicle)
                                        .createdBy(user)
                                        .createdAt(LocalDate.now())
                                        .status(Boolean.TRUE)
                                        .build();

                                if (finalReturnRequest.getChangedAssignment() != null) {
                                    vehicleAssignment1.setAssignToEmpId(finalReturnRequest.getChangedAssignment().getAssignToEmpId());
                                    vehicleAssignment1.setAssignToEmpName(finalReturnRequest.getChangedAssignment().getAssignToEmpName());
                                } else {
                                    vehicleAssignment1.setAssignToEmpId(vehicleAssignment.get().getAssignToEmpId());
                                    vehicleAssignment1.setAssignToEmpName(vehicleAssignment.get().getAssignToEmpName());
                                }

                                vehicleAssignment.get().setAssignToEmpId(null);
                                vehicleAssignment.get().setAssignToEmpName(null);
                                vehicleAssignment.get().setStatus(Boolean.FALSE);
                                vehicleAssignmentRepository.save(vehicleAssignment1);

                            } else {
                                replacingVehicle.setVehicleStatus("TBA");
                            }

                            temporaryReplacement.get().setReplacementVehicleStatus("Returned Back");
                            temporaryReplacement.get().setHistoryStatus("Returned Back");
                            vehicleRepository.save(temporaryReplacement.get());

                        } else {
                            temporaryReplacement.get().setReplacementVehicleStatus(null);
                            if (vehicleAssignment.isPresent()) {
                                temporaryReplacement.get().setVehicleStatus("Active");
                            } else {
                                temporaryReplacement.get().setVehicleStatus("TBA");
                            }
                            vehicleRepository.save(temporaryReplacement.get());
                        }
                    }
                }
                vehicle.get().setVehicleStatus("In-Active");
                vehicle.get().setHistoryStatus("Final Returned");
                return toDto(vehicleRepository.save(vehicle.get()));

            }
        }

        throw new RuntimeException("Record doesn't exist");
    }

    public VehicleDto save(VehicleDto vehicleDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(vehicleDto.getPlateNumber());

            if (vehicle.isPresent()) {
                throw new RuntimeException("Plate number Already exist : " + vehicleDto.getPlateNumber());
            }

            Vehicle vehicle1 = toEntity(vehicleDto);
            vehicle1.setVehicleStatus("TBA");
            vehicle1.setCreatedBy(user);
            vehicle1.setCreatedAt(LocalDateTime.now());
//            vehicle1.setStatus(Boolean.TRUE);

            Date currentDate = Date.valueOf(LocalDate.now());

            if (currentDate.before(vehicleDto.getRegistrationExpiry()) || currentDate.equals(vehicleDto.getRegistrationExpiry())) {
                vehicle1.setRegistrationStatus(Boolean.TRUE);
            } else if (currentDate.after(vehicleDto.getRegistrationExpiry())) {
                vehicle1.setRegistrationStatus(Boolean.FALSE);
            }

            if (currentDate.before(vehicleDto.getInsuranceExpiry()) || currentDate.equals(vehicleDto.getInsuranceExpiry())) {
                vehicle1.setInsuranceStatus(Boolean.TRUE);
            } else if (currentDate.after(vehicleDto.getInsuranceExpiry())) {
                vehicle1.setInsuranceStatus(Boolean.FALSE);
            }

            return toDto(vehicleRepository.save(vehicle1));
        }

        throw new RuntimeException("Error in adding Vehicle");

    }


    public Page<VehicleDto> searchVehicles(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getSearchSpecification(vehicleSearchCriteria);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public Page<VehicleDto> searchUnAssignedVehicles(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> spec = VehicleSpecification.getUnassignedVehicles(vehicleSearchCriteria);
        return vehicleRepository.findAll(spec, pageable).map(this::toDto);
    }

    public VehicleDto findById(Long id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            return toDto(vehicle);
        } else {
            throw new RuntimeException(String.format("Vehicle not found with id => %d", id));
        }
    }

    public VehicleDto updateVehicle(Long id, VehicleDto vehicleDto) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                optionalVehicle.get().setProcessOrderNumber(vehicleDto.getProcessOrderNumber());
                optionalVehicle.get().setPlateNumber(vehicleDto.getPlateNumber());
                optionalVehicle.get().setMake(vehicleDto.getMake());
                optionalVehicle.get().setYear(vehicleDto.getYear());
                optionalVehicle.get().setDesign(vehicleDto.getDesign());
                optionalVehicle.get().setModel(vehicleDto.getModel());
                optionalVehicle.get().setType(vehicleDto.getType());
                optionalVehicle.get().setCapacity(vehicleDto.getCapacity());
                optionalVehicle.get().setPower(vehicleDto.getPower());
                optionalVehicle.get().setRegistrationExpiry(vehicleDto.getRegistrationExpiry());
                optionalVehicle.get().setFuelType(vehicleDto.getFuelType());
                optionalVehicle.get().setVendor(vehicleDto.getVendor());
                optionalVehicle.get().setInsuranceExpiry(vehicleDto.getInsuranceExpiry());
                optionalVehicle.get().setLeaseCost(vehicleDto.getLeaseCost());
                optionalVehicle.get().setLeaseStartDate(vehicleDto.getLeaseStartDate());
                optionalVehicle.get().setLeaseExpiryDate(vehicleDto.getLeaseExpiryDate());
                optionalVehicle.get().setUsageType(vehicleDto.getUsageType());
                optionalVehicle.get().setRegion(vehicleDto.getRegion());
                optionalVehicle.get().setUpdatedAt(LocalDate.now());
                optionalVehicle.get().setUpdatedBy(user);

                Vehicle updatedVehicle = vehicleRepository.save(optionalVehicle.get());
                return toDto(updatedVehicle);
            }
        }
        throw new RuntimeException(String.format("Vehicle Not Found by this Id => %d", id));
    }

    public VehicleDto activateVehicle(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            vehicle.get().setVehicleStatus("TBA");
            vehicle.get().setHistoryStatus("Activated");
            return toDto(vehicleRepository.save(vehicle.get()));
        }
        throw new RuntimeException(String.format("Vehicle Not Found by this Id => %d", id));
    }


    @Transactional
    public List<String> addBulkVehicle(MultipartFile file) {
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

                        Vehicle vehicle = new Vehicle();

                        SimpleDateFormat inputDateFormat = new SimpleDateFormat("d-MMM-yy");
                        SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                        String registrationExpiryValue = String.valueOf(row.getCell(16));
                        String insuranceExpiryValue = String.valueOf(row.getCell(17));
                        String leaseStartValue = String.valueOf(row.getCell(19));
                        String leaseExpiryValue = String.valueOf(row.getCell(20));


                        try {
                            if (!insuranceExpiryValue.isEmpty()) {
                                java.util.Date insuranceUtilDate = inputDateFormat.parse(insuranceExpiryValue);
                                String insuranceSqlDateStr = outputDateFormat.format(insuranceUtilDate);
                                Date insuranceSqlDate = Date.valueOf(insuranceSqlDateStr);
                                vehicle.setInsuranceExpiry(insuranceSqlDate);
                            }

                            if (!leaseStartValue.isEmpty()) {
                                java.util.Date leaseStartUtilDate = inputDateFormat.parse(leaseStartValue);
                                String leaseStartSqlDateStr = outputDateFormat.format(leaseStartUtilDate);
                                Date leaseStartSqlDate = Date.valueOf(leaseStartSqlDateStr);
                                vehicle.setLeaseStartDate(leaseStartSqlDate);
                            }

                            if (!leaseExpiryValue.isEmpty()) {
                                java.util.Date leaseExpiryUtilDate = inputDateFormat.parse(leaseExpiryValue);
                                String leaseExpirySqlDateStr = outputDateFormat.format(leaseExpiryUtilDate);
                                Date leaseExpirySqlDate = Date.valueOf(leaseExpirySqlDateStr);
                                vehicle.setLeaseExpiryDate(leaseExpirySqlDate);
                            }
                            if (!registrationExpiryValue.isEmpty()) {
                                java.util.Date registrationExpiryUtilDate = inputDateFormat.parse(registrationExpiryValue);
                                String registrationExpirySqlDateStr = outputDateFormat.format(registrationExpiryUtilDate);
                                Date registrationExpirySqlDate = Date.valueOf(registrationExpirySqlDateStr);
                                vehicle.setRegistrationExpiry(registrationExpirySqlDate);
                            }


                        } catch (ParseException e) {
                            e.printStackTrace();
                            throw new RuntimeException("Error processing the Date: " + e.getMessage());
                        }

                        try {
                            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                            if (principal instanceof UserDetails) {
                                String username = ((UserDetails) principal).getUsername();
                                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                                Vendor vendor = vendorRepository.findByVendorNameIgnoreCase(getStringValue(row.getCell(12)));

                                vehicle.setProcessOrderNumber(getIntegerValue(row.getCell(0)));
                                vehicle.setPlateNumber(getStringValue(row.getCell(1)));
                                vehicle.setMake(Objects.requireNonNull(getStringValue(row.getCell(2))).toUpperCase());
                                vehicle.setYear(getIntegerValue(row.getCell(3)));
                                vehicle.setDesign(Objects.requireNonNull(getStringValue(row.getCell(4))).toUpperCase());
                                vehicle.setModel(Objects.requireNonNull(getStringValue(row.getCell(5))).toUpperCase());
                                vehicle.setType(Objects.requireNonNull(getStringValue(row.getCell(6))).toUpperCase());
                                vehicle.setCapacity(Objects.requireNonNull(getStringValue(row.getCell(7))).toUpperCase());
                                vehicle.setPower(Objects.requireNonNull(getStringValue(row.getCell(8))).toUpperCase());
                                vehicle.setFuelType(Objects.requireNonNull(getStringValue(row.getCell(9))).toUpperCase());
                                vehicle.setUsageType(Objects.requireNonNull(getStringValue(row.getCell(10))).toUpperCase(Locale.ROOT));
                                vehicle.setCategory(Objects.requireNonNull(getStringValue(row.getCell(11))).toUpperCase(Locale.ROOT));
                                vehicle.setVendor(vendor);
                                vehicle.setRegion(getStringValue(row.getCell(13)));
                                vehicle.setCountry(getStringValue(row.getCell(14)));
                                vehicle.setLocation(getStringValue(row.getCell(15)));
                                vehicle.setLeaseCost(getIntegerValue(row.getCell(18)));
                                vehicle.setCreatedBy(user);
                                vehicle.setCreatedAt(LocalDateTime.now());
                                vehicle.setVehicleStatus("TBA");
                                vehicle.setUuid(uuid);

                                vehicleRepository.save(vehicle);

                            } else {
                                messages.add("UserName not Found");
                                throw new ExcelException(messages);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            throw new RuntimeException("Error processing data in the Excel file:" + e.getMessage());
                        }
                    } else break;
                }
                FileHistory fileHistory = FileHistory.builder()
                        .fileName(fileName)
                        .uuid(uuid)
                        .build();
                fileHistoryRepository.save(fileHistory);

                messages.add("File uploaded and data saved successfully.");
                return messages;
            } else {
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

    private Integer getIntegerValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
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

            ExcelErrorResponse headerValidation = validateHeaderRow(sheet);

            if (!headerValidation.isStatus()) {
                return headerValidation;
            }

            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row != null && row.getPhysicalNumberOfCells() > 0) {
                    String plateNumberPattern = "\\d{4} [A-Z]{3}";

                    for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                        if (String.valueOf(row.getCell(cellNum)).isEmpty() || row.getCell(cellNum) == null) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)));
                        }
                    }

                    if (!getStringValue(row.getCell(1)).matches(plateNumberPattern)) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Plate Number Format : " + row.getCell(1),
                                "Row " + (rowNum + 1) + " and Cell 2", "Correct Format : 1234 ABC"));
                    }

                    Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(1)));
                    if (vehicle.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Plate Number : " + getStringValue(row.getCell(1)) +
                                " is already Present in the record", "Row : " + (rowNum + 1)));
                    }

                    ExcelErrorResponse checkDuplicate = checkDuplicateRecord(plateNumberList, row);
                    if (!checkDuplicate.isStatus()) {
                        return checkDuplicate;
                    }


                    String regex = "^(0[1-9]|[1-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{4}$";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher registrationMatcher = pattern.matcher(String.valueOf(row.getCell(16)));
                    Matcher insuranceMatcher = pattern.matcher(String.valueOf(row.getCell(17)));
                    Matcher leaseStartMatcher = pattern.matcher(String.valueOf(row.getCell(19)));
                    Matcher leaseExpiryMatcher = pattern.matcher(String.valueOf(row.getCell(20)));


                    if (!registrationMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(16), "Row " + (rowNum + 1) + " and Cell 17"));
                    } else if (!insuranceMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(17)
                                , "Row " + (rowNum + 1) + " and Cell 18"));
                    } else if (!leaseStartMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(19),
                                "Row " + (rowNum + 1) + " and Cell 20"));
                    } else if (!leaseExpiryMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(20),
                                "Row " + (rowNum + 1) + " and Cell 21"));
                    } else if (getIntegerValue(row.getCell(0)) == null) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(0), "Row " + (rowNum + 1) + " and cell 1"));
                    } else if (getIntegerValue(row.getCell(18)) == null) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(18), "Row" + (rowNum + 1) + " and cell 19"));
                    }

                    Optional<Vendor> vendor = Optional.ofNullable(vendorRepository.findByVendorNameIgnoreCase(getStringValue(row.getCell(12))));

                    if (!vendor.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(getStringValue(row.getCell(12)) + " vendor does not exist in the record", "Row " + (rowNum + 1) + " and Cell 13"));
                    }

                    ExcelErrorResponse regionValidation = validateRegion(row);
                    if (!regionValidation.isStatus()) {
                        return regionValidation;
                    }

                } else break;

            }

            ExcelErrorResponse productFieldValidation = validateProductFieldValues(sheet);
            if (!productFieldValidation.isStatus()) {
                return productFieldValidation;
            }

            return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Excel File is in Correct Format"));
        }
    }

    private ExcelErrorResponse validateRegion(Row row) {

        String region = getStringValue(row.getCell(13));
        String country = getStringValue(row.getCell(14));
        String city = getStringValue(row.getCell(15));

        Optional<Region> optionalRegion = regionRepository.findByNameAndStatusIsTrue(region);
        if (optionalRegion.isPresent()) {
            String cities = optionalRegion.get().getCities();

            if (Objects.equals(optionalRegion.get().getCountry(), country)) {

                cities = cities.replaceAll("\\[", "").replaceAll("\\]", "");
                String[] citiesArray = cities.split(",");
                boolean cityCheck = false;
                for (String cityList : citiesArray) {
                    if (cityList.trim().replaceAll("\"", "").equals(city)) {
                        cityCheck = true;
                        break;
                    }
                }
                if (!cityCheck) {
                    return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(city + " city doesn't exist in " + region + " region",
                            "Row " + (row.getRowNum() + 1)));
                }

            } else {
                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(country + " doesn't have region '" + region + "'",
                        "Row: " + (row.getRowNum() + 1)));
            }
        } else {
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(region + " region doesn't exist",
                    "Row " + (row.getRowNum() + 1)));
        }
        return new ExcelErrorResponse(Boolean.TRUE, null);
    }

    private ExcelErrorResponse validateProductFieldValues(Sheet sheet) {

        Map<Integer, String> productFields = new HashMap<>();
        productFields.put(2, "Make");
        productFields.put(3, "Year");
        productFields.put(4, "Design");
        productFields.put(5, "Model");
        productFields.put(6, "Vehicle Type");
        productFields.put(7, "Capacity");
        productFields.put(8, "Power");
        productFields.put(9, "Fuel Type");
        productFields.put(10, "Usage Type");
        productFields.put(11, "Category");

        for (Map.Entry<Integer, String> entry : productFields.entrySet()) {
            ProductField productField = productFieldRepository.findByNameAndStatusIsActive(entry.getValue());
            if (productField != null) {
                for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                    Row row = sheet.getRow(rowIndex);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {
                        Optional<String> checkDuplicateValues;

                        if (entry.getKey() == 3) {
                            checkDuplicateValues = productField.getProductFieldValuesList().stream()
                                    .map(ProductFieldValues::getName)
                                    .filter(value -> {
                                        String cellValue = String.valueOf(getIntegerValue(row.getCell(entry.getKey())));
                                        return value.equalsIgnoreCase(cellValue);
                                    })
                                    .findFirst();
                        } else {
                            checkDuplicateValues = productField.getProductFieldValuesList().stream()
                                    .map(ProductFieldValues::getName)
                                    .filter(value -> value.equalsIgnoreCase(getStringValue(row.getCell(entry.getKey()))))
                                    .findFirst();
                        }

                        if (!checkDuplicateValues.isPresent()) {
                            return new ExcelErrorResponse(
                                    Boolean.FALSE,
                                    Arrays.asList("Incorrect " + entry.getValue() + " value: " + row.getCell(entry.getKey())
                                            , "\nCorrect Values: " +
                                                    productField.getProductFieldValuesList()
                                                            .stream()
                                                            .map(ProductFieldValues::getName)
                                                            .collect(Collectors.joining(", "))));
                        }
                    } else break;
                }
            } else {
                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Product Field '" + entry.getValue() + "' doesn't exist in the record"));
            }

        }
        return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Product Field validation successful"));
    }

    private ExcelErrorResponse validateHeaderRow(Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        String[] expectedHeaders = {
                "ProcessOrderNumber", "PlateNumber", "Make", "Year", "Design", "Model", "Type", "Capacity",
                "Power", "FuelType", "UsageType", "Category", "Vendor", "Region", "Country", "Location",
                "RegistrationExpiry", "InsuranceExpiry", "LeaseCost", "LeaseStartDate",
                "LeaseExpiryDate"
        };

        for (int i = 0; i < expectedHeaders.length; i++) {
            String expectedHeader = expectedHeaders[i];
            String actualHeader = headerRow.getCell(i).toString();

            if (!actualHeader.replaceAll("\\s", "").equalsIgnoreCase(expectedHeader)) {
                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Error in column : " + actualHeader,
                        "Row : " + (headerRow.getRowNum() + 1) + " and Cell : " + (i + 1)
                        , "Please check the Sample Format of Excel File"));
            }
        }
        return new ExcelErrorResponse(Boolean.TRUE, null);
    }

    private ExcelErrorResponse checkDuplicateRecord(Map<Integer, String> plateNumberList, Row row) {
        String plateNumber = getStringValue(row.getCell(1));

        for (Map.Entry<Integer, String> entry : plateNumberList.entrySet()) {
            if (plateNumber.equals(entry.getValue())) {
                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Duplicate Record in the Row : " + entry.getKey() + " and " + (row.getRowNum() + 1),
                        "Duplicate Plate Number : " + plateNumber));
            }
        }
        plateNumberList.put(row.getRowNum() + 1, plateNumber);
        return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("No Duplicate Record"));
    }


    public List<VehicleDto> toDtoList(List<Vehicle> vehicleList) {
        return vehicleList.stream().map(this::toDto).collect(Collectors.toList());
    }

    private VehicleDto toDto(Vehicle vehicle) {
        return modelMapper.map(vehicle, VehicleDto.class);
    }

    private VehicleDto toDtoForAssignment(VehicleAssignment vehicleAssignment) {
        return modelMapper.map(vehicleAssignment, VehicleDto.class);
    }

    private Vehicle toEntity(VehicleDto vehicleDto) {
        return modelMapper.map(vehicleDto, Vehicle.class);
    }

    public List<VehicleDto> getAllNotAssignedVehicle() {
        return toDtoList(vehicleRepository.getNotAssignedVehicle());
    }

    public List<VehicleDto> getAllVehiclesUnderDriverVehicleBudget(Integer value) {
        List<Vehicle> vehicles = vehicleRepository.getAllVehiclesUnderDriverVehicleBudget(value);
        return toDtoList(vehicles);
    }

    public List<VehicleDto> getActiveVehicles() {
        return toDtoList(vehicleRepository.getActiveVehicles());
    }

    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());

        if (byFileName == null) {
            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
            String originalFileName = multipartFile.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            FileMetaData fileMetaData = new FileMetaData();
            fileMetaData.setFileUrl(fileUrl);
            fileMetaData.setFileExtension(fileExtension);
            fileMetaData.setFileName(multipartFile.getOriginalFilename());
            fileMetaData.setVehicle(vehicle.get());
            fileMetaData.setAttachmentType(attachmentType);
            fileMetaDataRepository.save(fileMetaData);

            return ResponseMessage.builder()
                    .message(Collections.singletonList("File uploaded to the server successfully"))
                    .build();
        } else {
            throw new RuntimeException(String.format("File already exists on the bucket with the same name"));
        }
    }

    public List<VehicleDto> availableForReplacement() {
        return toDtoList(vehicleRepository.availableForReplacement());
    }

    public List<VehicleHistoryResponse> getVehicleHistoryById(Long id) {

        Optional<Vehicle> vehicle = vehicleRepository.findById(id);

        List<AssignmentAuditDataWrapper> assignmentList = vehicleAssignmentAuditService.retrieveAssignmentAuditData(vehicle.get().getId());

       List<VehicleAuditDataWrapper> vehicleList = vehicleAssignmentAuditService.retrieveVehicleAuditData(id);
       List<VehicleAuditDataWrapper> replacedVehicleList = vehicleAssignmentAuditService.retrieveReplacedVehicleAuditData(id);

        List<VehicleHistoryResponse> vehicleHistoryList = new ArrayList<>();
        vehicleHistoryList.add(new VehicleHistoryResponse("Creation", vehicle.get().getCreatedAt(), vehicle.get().getCreatedBy().getName(),
                null, null, null));

        for (VehicleAuditDataWrapper vehicles : vehicleList) {
            VehicleHistoryResponse vehicleHistoryResponse = new VehicleHistoryResponse();
            if (vehicles.getEntity().getHistoryStatus() != null) {
                if (vehicles.getEntity().getHistoryStatus().equalsIgnoreCase("Final Returned")) {
                    vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                    vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                    vehicleHistoryResponse.setType("Final Returned");
                    vehicleHistoryList.add(vehicleHistoryResponse);
                } else if (vehicles.getEntity().getHistoryStatus().equalsIgnoreCase("Marked Total Lost")) {
                    vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                    vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                    vehicleHistoryResponse.setType("Marked Total Lost");
                    vehicleHistoryList.add(vehicleHistoryResponse);
                } else if (vehicles.getEntity().getHistoryStatus().equalsIgnoreCase("Returned Back")) {
                    vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                    vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                    vehicleHistoryResponse.setType("Returned Back");
                    vehicleHistoryList.add(vehicleHistoryResponse);
                } else if (vehicles.getEntity().getHistoryStatus().equalsIgnoreCase("Set Permanent")) {
                    vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                    vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                    vehicleHistoryResponse.setType("Set Permanent");
                    vehicleHistoryList.add(vehicleHistoryResponse);
                } else if (vehicles.getEntity().getHistoryStatus().equalsIgnoreCase("Deleted")) {
                    vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                    vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                    vehicleHistoryResponse.setType("Vehicle Deleted");
                    vehicleHistoryList.add(vehicleHistoryResponse);
                }
            }
            if(vehicles.getEntity().getVehicleStatus().equalsIgnoreCase("Replacement")){
                vehicleHistoryResponse.setCreatedBy(vehicles.getEntity().getUpdatedBy().getName());
                vehicleHistoryResponse.setCreatedAt(vehicles.getRevisionTimeStamp());
                vehicleHistoryResponse.setType("Temporary Replacement");
                vehicleHistoryResponse.setPlateNumber(vehicles.getEntity().getReplacementVehicle().getPlateNumber());
                vehicleHistoryList.add(vehicleHistoryResponse);
            }
        }

        if(!replacedVehicleList.isEmpty()){
            for (VehicleAuditDataWrapper replacedVehicles: replacedVehicleList) {
                VehicleHistoryResponse vehicleHistoryResponse = new VehicleHistoryResponse();
                vehicleHistoryResponse.setCreatedBy(replacedVehicles.getEntity().getUpdatedBy().getName());
                vehicleHistoryResponse.setCreatedAt(replacedVehicles.getRevisionTimeStamp());
                vehicleHistoryResponse.setType("Replacement");
                vehicleHistoryResponse.setPlateNumber(replacedVehicles.getEntity().getReplacementVehicle().getPlateNumber());
                vehicleHistoryList.add(vehicleHistoryResponse);
            }
        }

        for (AssignmentAuditDataWrapper assignment : assignmentList) {
            VehicleHistoryResponse vehicleHistoryResponse = new VehicleHistoryResponse();

            if (assignment.getEntity().isStatus()) {
                vehicleHistoryResponse.setType("Assignment");
                vehicleHistoryResponse.setEmpNo(assignment.getEntity().getAssignToEmpId().getEmployeeNumber());
                vehicleHistoryResponse.setEmpName(assignment.getEntity().getAssignToEmpName());
                if (assignment.getRevisionType() == RevisionType.ADD) {
                    vehicleHistoryResponse.setCreatedBy(assignment.getEntity().getCreatedBy().getName());
                } else
                    vehicleHistoryResponse.setCreatedBy(assignment.getEntity().getUpdatedBy().getName());
            } else {
                vehicleHistoryResponse.setType("Released");
                vehicleHistoryResponse.setCreatedBy(assignment.getEntity().getDeletedBy().getName());
            }

            vehicleHistoryResponse.setCreatedAt(assignment.getRevisionTimeStamp());

            vehicleHistoryList.add(vehicleHistoryResponse);

        }

        vehicleHistoryList.sort(Comparator.comparing(VehicleHistoryResponse::getCreatedAt));
        return vehicleHistoryList;
    }

    public Page<VehicleDto> searchInactiveVehicles(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getInactiveSearchSpecification(vehicleSearchCriteria);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public Page<VehicleDto> searchVehicle(VehicleSearchCriteria vehicleSearchCriteria, String vehicleStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getVehicleSearchSpecification(vehicleSearchCriteria, vehicleStatus);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public VehicleDto deleteReplacementVehicle(Long id) {
        Optional<Vehicle> replacementVehicle = vehicleRepository.findById(id);
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            if (replacementVehicle.isPresent()) {
                replacementVehicle.get().setVehicleStatus("Deleted");

                    Vehicle vehicle = replacementVehicle.get().getReplacementVehicle();

                    Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(replacementVehicle.get());
                    if (vehicleAssignment.isPresent()) {
                        vehicle.setVehicleStatus("Active");

                        Optional<VehicleAssignment> optionalVehicleAssignment = vehicleAssignmentRepository.findByVehicle(vehicle);
                        if (optionalVehicleAssignment.isPresent()) {
                            optionalVehicleAssignment.get().setAssignToEmpId(vehicleAssignment.get().getAssignToEmpId());
                            optionalVehicleAssignment.get().setAssignToEmpName(vehicleAssignment.get().getAssignToEmpName());
                            optionalVehicleAssignment.get().setUpdatedAt(LocalDate.now());
                            optionalVehicleAssignment.get().setUpdatedBy(user);
                            optionalVehicleAssignment.get().setStatus(Boolean.TRUE);
                            vehicleAssignmentRepository.save(optionalVehicleAssignment.get());
                        } else {
                            VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                                    .assignToEmpId(vehicleAssignment.get().getAssignToEmpId())
                                    .assignToEmpName(vehicleAssignment.get().getAssignToEmpName())
                                    .vehicle(vehicleAssignment.get().getVehicle())
                                    .status(Boolean.TRUE)
                                    .createdAt(LocalDate.now())
                                    .createdBy(user)
                                    .build();
                            vehicleAssignmentRepository.save(vehicleAssignment1);
                        }
                        vehicleAssignment.get().setAssignToEmpId(null);
                        vehicleAssignment.get().setAssignToEmpName(null);
                        vehicleAssignment.get().setDeletedAt(LocalDate.now());
                        vehicleAssignment.get().setDeletedBy(user);
                        vehicleAssignment.get().setStatus(Boolean.FALSE);
                        vehicleAssignmentRepository.save(vehicleAssignment.get());
                    } else {
                        vehicle.setVehicleStatus("TBA");
                    }
                    vehicleRepository.save(vehicle);
                }
                return toDto(vehicleRepository.save(replacementVehicle.get()));

            }
        throw new RuntimeException("Error Deleting Vehicle");
    }

    public VehicleDto findReplacementVehicleById(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            return vehicleRepository.findByReplacementVehicle(vehicle.get())
                    .map(this::toDto)
                    .orElseThrow(() -> new RuntimeException(String.format("Replacement Vehicle not found by id => %d", id)));
        }
        throw new RuntimeException(String.format("vehicle not found By id => %d", id));
    }


    public VehicleDto replacementVehicleAction(Long id, ReplacementActionRequest replacementActionRequest) {
        Optional<Vehicle> replacementVehicle = vehicleRepository.findById(id);
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (replacementVehicle.isPresent()) {
            Optional<VehicleAssignment> currentAssignment = vehicleAssignmentRepository.findByVehicle(replacementVehicle.get());
            Optional<Vehicle> originalVehicle = vehicleRepository.findById(replacementVehicle.get().getReplacementVehicle().getId());

            if (originalVehicle.isPresent()) {
                if (principal instanceof UserDetails) {
                    String username = ((UserDetails) principal).getUsername();
                    User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);
                    Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicle(originalVehicle.get());

                    switch (replacementActionRequest.getAction()) {
                        case "Reassign":
                            if (vehicleAssignment.isPresent()) {
                                vehicleAssignment.get().setStatus(Boolean.TRUE);
                                vehicleAssignment.get().setUpdatedBy(user);
                                vehicleAssignment.get().setUpdatedAt(LocalDate.now());
                                if (replacementActionRequest.getChangedAssignedEmployee() != null) {
                                    vehicleAssignment.get().setAssignToEmpId(replacementActionRequest.getChangedAssignedEmployee());
                                    vehicleAssignment.get().setAssignToEmpName(replacementActionRequest.getChangedAssignedEmployee().getEmpName());
                                } else {
                                    vehicleAssignment.get().setAssignToEmpId(currentAssignment.get().getAssignToEmpId());
                                    vehicleAssignment.get().setAssignToEmpName(currentAssignment.get().getAssignToEmpName());
                                }
                            }

                            currentAssignment.get().setAssignToEmpId(null);
                            currentAssignment.get().setAssignToEmpName(null);
                            currentAssignment.get().setStatus(Boolean.FALSE);
                            currentAssignment.get().setDeletedBy(user);

                            currentAssignment.get().setDeletedAt(LocalDate.now());
                            originalVehicle.get().setVehicleStatus("Active");
                            originalVehicle.get().setUpdatedBy(user);
                            originalVehicle.get().setUpdatedAt(LocalDate.now());
//                            replacementVehicle.get().setVehicleReplacement(null);
                            replacementVehicle.get().setReplacementVehicleStatus("Returned Back");
                            replacementVehicle.get().setHistoryStatus("Returned Back");
                            vehicleAssignmentRepository.save(currentAssignment.get());
                            vehicleAssignmentRepository.save(vehicleAssignment.get());
                            vehicleRepository.save(originalVehicle.get());
                            break;

                        case "Replace":

                            Optional<Vehicle> optionalVehicle = vehicleRepository.findByPlateNumber(replacementActionRequest.getPermanentVehicle().getPlateNumber());
                            if (optionalVehicle.isPresent()) {
                                throw new RuntimeException("Plate number Already exist : " + replacementActionRequest.getPermanentVehicle().getPlateNumber());
                            }
                            Vehicle permanentVehicle = toEntity(replacementActionRequest.getPermanentVehicle());
                            permanentVehicle.setCreatedAt(LocalDateTime.now());
                            permanentVehicle.setCreatedBy(user);

                            Date currentDate = Date.valueOf(LocalDate.now());

                            if (currentDate.before(replacementActionRequest.getPermanentVehicle().getRegistrationExpiry()) || currentDate.equals(replacementActionRequest.getPermanentVehicle().getRegistrationExpiry())) {
                                permanentVehicle.setRegistrationStatus(Boolean.TRUE);
                            } else if (currentDate.after(replacementActionRequest.getPermanentVehicle().getRegistrationExpiry())) {
                                permanentVehicle.setRegistrationStatus(Boolean.FALSE);
                            }

                            if (currentDate.before(replacementActionRequest.getPermanentVehicle().getInsuranceExpiry()) || currentDate.equals(replacementActionRequest.getPermanentVehicle().getInsuranceExpiry())) {
                                permanentVehicle.setInsuranceStatus(Boolean.TRUE);
                            } else if (currentDate.after(replacementActionRequest.getPermanentVehicle().getInsuranceExpiry())) {
                                permanentVehicle.setInsuranceStatus(Boolean.FALSE);
                            }

                            permanentVehicle.setVehicleStatus("Active");
                            vehicleRepository.save(permanentVehicle);
                            VehicleAssignment newAssignment = VehicleAssignment.builder()
                                    .vehicle(permanentVehicle)
                                    .status(Boolean.TRUE)
                                    .createdBy(user)
                                    .createdAt(LocalDate.now())
                                    .build();

                            if (replacementActionRequest.getChangedAssignedEmployee() != null) {
                                newAssignment.setAssignToEmpId(replacementActionRequest.getChangedAssignedEmployee());
                                newAssignment.setAssignToEmpName(replacementActionRequest.getChangedAssignedEmployee().getEmpName());
                            } else {
                                newAssignment.setAssignToEmpId(currentAssignment.get().getAssignToEmpId());
                                newAssignment.setAssignToEmpName(currentAssignment.get().getAssignToEmpName());
                            }

                            currentAssignment.get().setAssignToEmpId(null);
                            currentAssignment.get().setAssignToEmpName(null);
                            currentAssignment.get().setStatus(Boolean.FALSE);
                            currentAssignment.get().setDeletedBy(user);

                            replacementVehicle.get().setReplacementVehicleStatus("Returned Back");
                            replacementVehicle.get().setHistoryStatus("Returned Back");
                            vehicleAssignmentRepository.save(newAssignment);
                            vehicleAssignmentRepository.save(currentAssignment.get());
                            break;

                        case "Permanent":
                            replacementVehicle.get().setReplacementVehicleStatus(null);
                            replacementVehicle.get().setVehicleStatus("Active");
                            replacementVehicle.get().setHistoryStatus("Set Permanent");
                            break;

                    }
                    replacementVehicle.get().setUpdatedBy(user);
                    replacementVehicle.get().setUpdatedAt(LocalDate.now());
                }
            }
        }
        return toDto(vehicleRepository.save(replacementVehicle.get()));
    }

    public VehicleDto markVehicleTotalLost(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);
                vehicle.get().setUpdatedAt(LocalDate.now());
                vehicle.get().setUpdatedBy(user);
                vehicle.get().setVehicleStatus("In-Active");
                vehicle.get().setHistoryStatus("Marked Total Lost");
                return toDto(vehicleRepository.save(vehicle.get()));
            }
        }
        throw new RuntimeException(String.format("Vehicle not found by id => %d", id));
    }

    public List<VehicleDto> getAll() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return toDtoList(vehicles);
    }

    private VehicleExcelDto toVehicleExcelDto(Vehicle vehicle) {
        Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(vehicle);
        VehicleExcelDto vehicleExcelDto = modelMapper.map(vehicle, VehicleExcelDto.class);
        vehicleExcelDto.setVendor(vehicle.getVendor().getVendorName());
        if (vehicleAssignment.isPresent()) {
            vehicleExcelDto.setAssignToEmployeeNo(vehicleAssignment.get().getAssignToEmpId().getEmployeeNumber());
            vehicleExcelDto.setAssignToEmployeeName(vehicleAssignment.get().getAssignToEmpName());
        }
        if (vehicle.getReplacementVehicle() != null) {
            vehicleExcelDto.setReplacementVehicle(vehicle.getReplacementVehicle().getPlateNumber());
        }
        return vehicleExcelDto;
    }

    private List<VehicleExcelDto> toVehicleExcelDtoList(List<Vehicle> vehicleList) {
        return vehicleList.stream().map(this::toVehicleExcelDto).collect(Collectors.toList());
    }

    public byte[] downloadExcel(List<VehicleDto> vehicleDtoList) {
        List<VehicleExcelDto> vehicleExcelDtoList;

        if (vehicleDtoList != null && !vehicleDtoList.isEmpty()) {
            List<Vehicle> vehiclesList = vehicleDtoList.stream()
                    .map(this::toEntity)
                    .collect(Collectors.toList());
            vehicleExcelDtoList = toVehicleExcelDtoList(vehiclesList);
        } else {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            vehicleExcelDtoList = toVehicleExcelDtoList(vehicles);
        }
        return excelExportService.exportToExcel(vehicleExcelDtoList);
    }


    public Page<VehicleDto> searchVehicleByVendor(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getVehicleSearchSpecificationByVendor(vehicleSearchCriteria);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public Page<VehicleDto> searchVehicleByRegion(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getVehicleSearchSpecificationByRegion(vehicleSearchCriteria);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public Page<VehicleDto> searchVehicleByUsageType(VehicleSearchCriteria vehicleSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getVehicleSearchSpecificationByUsageType(vehicleSearchCriteria);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }

    public Page<VehicleDto> searchVehicleByLeaseExpiry(Date leaseStartDate, Date leaseExpiryDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        VehicleSearchCriteria vehicleSearchCriteria = new VehicleSearchCriteria();
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getVehicleSearchSpecificationByLeaseExpiry(vehicleSearchCriteria, leaseStartDate, leaseExpiryDate);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage.map(this::toDto);
    }


    public Page<Vehicle> getVehicleBySearch(VehicleDto vehicleDto, String stringifyPoNumbers, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Vehicle vehicle = toEntity(vehicleDto);
        Specification<Vehicle> vehicleSpecification = VehicleSpecification.getWithDynamicSearchSpecification(vehicle, stringifyPoNumbers);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(vehicleSpecification, pageable);
        return vehiclePage;
    }

    public VehicleDto deleteVehicleById(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                vehicle.get().setVehicleStatus("Deleted");
                vehicle.get().setUpdatedAt(LocalDate.now());
                vehicle.get().setUpdatedBy(user);

                return toDto(vehicleRepository.save(vehicle.get()));
            }
        }
        throw new RuntimeException(String.format("Vehicle not found by id => %d", id));
    }

    public List<Map<String, String>> findAllDistinctPoNumbers() {
        List<String> poNumbers = vehicleRepository.findDistinctByProcessOrderNumberNotNull();
        List<Map<String, String>> result = new ArrayList<>();

        for (String poNumber : poNumbers) {
            if (poNumber != null) {
                Map<String, String> obj = new HashMap<>();
                obj.put("poNumber", poNumber);
                result.add(obj);
            }
        }

        return result;
    }

    @Transactional
    public VehicleDto replaceVehicleById(Long id, ReplacementRequest replacementRequest) {
        Optional<Vehicle> existingVehicle = vehicleRepository.findById(id);

        if (existingVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                Vehicle replacingVehicle = replacementRequest.getReplacementVehicle();
                replacingVehicle.setCreatedBy(user);
                replacingVehicle.setCreatedAt(LocalDateTime.now());

                Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(existingVehicle.get());
                if(vehicleAssignment.isPresent()) {
                    replacingVehicle.setReplacementVehicleStatus("Assigned");
                    vehicleRepository.save(replacingVehicle);
                    VehicleAssignment vehicleAssignment1 = VehicleAssignment.builder()
                            .vehicle(replacingVehicle)
                            .createdBy(user)
                            .createdAt(LocalDate.now())
                            .status(Boolean.TRUE)
                            .build();

                    if (replacementRequest.getChangeAssignedEmployee() == null){
                    vehicleAssignment1.setAssignToEmpId(vehicleAssignment.get().getAssignToEmpId());
                    vehicleAssignment1.setAssignToEmpName(vehicleAssignment.get().getAssignToEmpName());

                    }else{
                        Optional<Employee> employee = employeeRepository.findByEmployeeNumber(replacementRequest.getChangeAssignedEmployee().getEmployeeNumber());
                        vehicleAssignment1.setAssignToEmpId(employee.get());
                        vehicleAssignment1.setAssignToEmpName(employee.get().getEmpName());
                    }

                    vehicleAssignmentRepository.save(vehicleAssignment1);

                    vehicleAssignment.get().setStatus(Boolean.FALSE);
                    vehicleAssignment.get().setDeletedAt(LocalDate.now());
                    vehicleAssignment.get().setDeletedBy(user);
                    vehicleAssignment.get().setAssignToEmpId(null);
                    vehicleAssignment.get().setAssignToEmpName(null);

                    vehicleAssignmentRepository.save(vehicleAssignment.get());

                }else replacingVehicle.setReplacementVehicleStatus("Unassigned");

                replacingVehicle.setReplaceLeaseCost(existingVehicle.get().getLeaseCost() - replacingVehicle.getLeaseCost());

                if (replacementRequest.getReplacementVehicle().getReplacementReason().equalsIgnoreCase("Under Maintenance")) {
                    existingVehicle.get().setVehicleStatus("Under Maintenance");
                } else if (replacementRequest.getReplacementVehicle().getReplacementReason().equalsIgnoreCase("TBA")) {
                    existingVehicle.get().setVehicleStatus("TBA");
                }else if(replacementRequest.getReplacementVehicle().getReplacementReason().equalsIgnoreCase("Total Lost")){
                    existingVehicle.get().setVehicleStatus("In-Active");
                }

                replacingVehicle.setVehicleStatus("Replacement");
                replacingVehicle.setReplacementVehicle(existingVehicle.get());
                replacingVehicle.setUpdatedBy(user);
                replacingVehicle.setUpdatedAt(LocalDate.now());
                existingVehicle.get().setUpdatedAt(LocalDate.now());
                existingVehicle.get().setUpdatedBy(user);

                vehicleRepository.save(existingVehicle.get());
                vehicleRepository.save(replacingVehicle);
                return toDto(replacingVehicle);
            }
        }
        throw new RuntimeException("Vehicle not found by Id "+id);
    }
}

