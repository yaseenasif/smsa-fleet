package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.VehicleDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ExcelErrorResponse;
import com.example.FleetSystem.repository.FileHistoryRepository;
import com.example.FleetSystem.repository.UserRepository;
import com.example.FleetSystem.repository.VehicleRepository;
import com.example.FleetSystem.repository.VendorRepository;
import org.apache.poi.ss.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    FileHistoryRepository fileHistoryRepository;
    @Autowired
    VendorRepository vendorRepository;

    public VehicleDto deleteVehicleById(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);

        if(vehicle.isPresent()){
            vehicle.get().setStatus(Boolean.FALSE);
            return toDto(vehicleRepository.save(vehicle.get()));
        }

        throw new RuntimeException("Record doesn't exist");

    }

    public VehicleDto save(VehicleDto vehicleDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(username);

            Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(vehicleDto.getPlateNumber());

            if (vehicle.isPresent()){
                throw new RuntimeException("Plate number Already exist : "+vehicleDto.getPlateNumber());
            }

            Vehicle vehicle1 = toEntity(vehicleDto);
            vehicle1.setCreatedBy(user);
            vehicle1.setCreatedAt(LocalDate.now());
            vehicle1.setStatus(Boolean.TRUE);

            Date currentDate = Date.valueOf(LocalDate.now());

            if(currentDate.before(vehicleDto.getRegistrationExpiry()) || currentDate.equals(vehicleDto.getRegistrationExpiry())){
                vehicle1.setRegistrationStatus(Boolean.TRUE);
            }else if(currentDate.after(vehicleDto.getRegistrationExpiry())){
                vehicle1.setRegistrationStatus(Boolean.FALSE);
            }

            if(currentDate.before(vehicleDto.getInsuranceExpiry()) || currentDate.equals(vehicleDto.getInsuranceExpiry())){
                vehicle1.setInsuranceStatus(Boolean.TRUE);
            } else if (currentDate.after(vehicleDto.getInsuranceExpiry())) {
                vehicle1.setInsuranceStatus(Boolean.FALSE);
            }

            return toDto(vehicleRepository.save(vehicle1));
        }

        throw new RuntimeException("Error in adding Vehicle");

    }


    public List<VehicleDto> getAll() {
        return toDtoList(vehicleRepository.getActiveVehicles());
    }

    public VehicleDto findById(Long id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if(optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            return toDto(vehicle);
        }
        else {
            throw new RuntimeException(String.format("Vehicle not found with id => %d", id));
        }
    }

    public VehicleDto updateVehicle(Long id, VehicleDto vehicleDto) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(username);

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
                optionalVehicle.get().setAttachments(vehicleDto.getAttachments());
                optionalVehicle.get().setUpdatedAt(LocalDate.now());
                optionalVehicle.get().setUpdatedBy(user);

                Vehicle updatedVehicle = vehicleRepository.save(optionalVehicle.get());
                return toDto(updatedVehicle);
            }
        }
        throw new RuntimeException(String.format("Vehicle Not Found by this Id => %d" , id));
    }

    public VehicleDto makeVehicleActive(Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if(vehicle.isPresent()){
            if(vehicle.get().isStatus()){
                throw new RuntimeException("Record is already Active");
            }
            vehicle.get().setStatus(Boolean.TRUE);
            return toDto(vehicleRepository.save(vehicle.get()));
        }
        throw new RuntimeException(String.format("Driver Not Found by this Id => %d" , id));
    }


    @Transactional
    public List<String> addBulkVehicle(MultipartFile file){
        List<String> messages = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            ExcelErrorResponse checkFile = validateExcelFile(file);

            if(checkFile.isStatus()) {
                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    Vehicle vehicle = new Vehicle();

                    SimpleDateFormat inputDateFormat = new SimpleDateFormat("d-MMM-yy");
                    SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");

                    String insuranceExpiryValue = String.valueOf(row.getCell(13));
                    String registrationExpiryValue = String.valueOf(row.getCell(11));
                    String leaseStartValue = String.valueOf(row.getCell(17));
                    String leaseExpiryValue = String.valueOf(row.getCell(18));


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
                        if(principal instanceof UserDetails) {
                            String username = ((UserDetails) principal).getUsername();
                            User user = userRepository.findByEmail(username);

                            Vendor vendor = vendorRepository.findByVendorNameIgnoreCase(getStringValue(row.getCell(15)));

                            vehicle.setPlateNumber(getStringValue(row.getCell(1)));
                            vehicle.setProcessOrderNumber(getIntegerValue(row.getCell(2)));
                            vehicle.setMake(getStringValue(row.getCell(3)));
                            vehicle.setDesign(getStringValue(row.getCell(4)));
                            vehicle.setModel(getStringValue(row.getCell(5)));
                            vehicle.setType(getStringValue(row.getCell(6)));
                            vehicle.setYear(getStringValue(row.getCell(7)));
                            vehicle.setPower(getStringValue(row.getCell(8)));
                            vehicle.setCapacity(getStringValue(row.getCell(9)));
                            vehicle.setFuelType(getStringValue(row.getCell(10)));
                            vehicle.setVendor(vendor);
                            vehicle.setLeaseCost(getIntegerValue(row.getCell(16)));
                            vehicle.setCreatedBy(user);
                            vehicle.setCreatedAt(LocalDate.now());
                            vehicle.setStatus(Boolean.TRUE);
                            vehicle.setUuid(uuid);

                            if(String.valueOf(row.getCell(12)).replaceAll("\\s", "").equalsIgnoreCase("valid")){
                                vehicle.setRegistrationStatus(Boolean.TRUE);
                            }else {
                                vehicle.setRegistrationStatus(Boolean.FALSE);
                            }

                            if(String.valueOf(row.getCell(14)).replaceAll("\\s", "").equalsIgnoreCase("valid")){
                                vehicle.setInsuranceStatus(Boolean.TRUE);
                            }else {
                                vehicle.setInsuranceStatus(Boolean.FALSE);
                            }

                            vehicleRepository.save(vehicle);

                        }else {
                            messages.add("UserName not Found");
                            return messages;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Error processing data in the Excel file:" + e.getMessage());
                    }
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

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error processing the file: " + e.getMessage());
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

    private Integer getIntegerValue(Cell cell){
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            } 
        }
        return null;
    }

    private ExcelErrorResponse validateExcelFile(MultipartFile file){

        String fileName = file.getOriginalFilename();
        Optional<FileHistory> fileHistory = Optional.ofNullable(fileHistoryRepository.findByFileName(fileName));
        if (fileHistory.isPresent()){
            return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList(fileName+" is already uploaded. Please upload a different File."));
        }else {

            try (InputStream inputStream = file.getInputStream()) {
                Workbook workbook = WorkbookFactory.create(inputStream);
                Sheet sheet = workbook.getSheetAt(0);
                Map<Integer, String> plateNumberList = new HashMap<>();

                Row headerRow = sheet.getRow(0);
                String[] expectedHeaders = {
                        "S.No:", "Reg#", "PONumber", "Make", "Design", "Model", "Type", "YOM",
                        "EnginePower", "Capacity(Payload)", "FuelType", "RegistrationExpiry",
                        "RegistrationStatus", "InsuranceExpiry", "InsuranceStatus",
                        "Supplier/Agent", "Lease/CostSR.", "Leased/PurchaseDate", "LeaseExpiry"
                };

                for (int i = 0; i < expectedHeaders.length; i++) {
                    String expectedHeader = expectedHeaders[i];
                    String actualHeader = headerRow.getCell(i).toString();

                    if (!actualHeader.replaceAll("\\s", "").equalsIgnoreCase(expectedHeader)) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Error in column : " + actualHeader,
                                "Row : " + (headerRow.getRowNum() + 1)+" and Cell : " + (i + 1)
                                , "Please check the Sample Format of Excel File"));
                    }
                }

                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    String plateNumberPattern = "\\d{4} [A-Z]{3}";

                    for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                        if (String.valueOf(row.getCell(cellNum)).isEmpty()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)));
                        }
                    }

                    if (!getStringValue(row.getCell(1)).matches(plateNumberPattern)) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Plate Number Format : " + row.getCell(1),
                                "Row " + (rowNum + 1) + " and Cell 2", "Correct Format : 1234 ABC"));
                    }

                    Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(1)));
                    if (vehicle.isPresent()){
                        return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Plate Number : "+getStringValue(row.getCell(1))+
                                " is already Present in the record","Row : "+ (rowNum+1)));
                    }

                    ExcelErrorResponse checkDuplicate = checkDuplicateRecord(plateNumberList,row);
                    if(!checkDuplicate.isStatus()){
                        return checkDuplicate;
                    }


                    String regex = "^(0[1-9]|[1-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{4}$";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher insuranceMatcher = pattern.matcher(String.valueOf(row.getCell(13)));
                    Matcher registrationMatcher = pattern.matcher(String.valueOf(row.getCell(11)));
                    Matcher leaseStartMatcher = pattern.matcher(String.valueOf(row.getCell(17)));
                    Matcher leaseExpiryMatcher = pattern.matcher(String.valueOf(row.getCell(18)));


                    if (!registrationMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(11) ,"Row " + (rowNum + 1) + " and Cell 12"));
                    } else if (!String.valueOf(row.getCell(12)).replaceAll("\\s", "").equalsIgnoreCase("valid")
                            && !String.valueOf(row.getCell(12)).replaceAll("\\s", "").equalsIgnoreCase("invalid")) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( "Incorrect Value : " + row.getCell(12) ,"Row " + (rowNum + 1) + " and Cell 13","Value should be Valid or Invalid"));
                    } else if (!String.valueOf(row.getCell(14)).replaceAll("\\s", "").equalsIgnoreCase("valid")
                            && !String.valueOf(row.getCell(14)).replaceAll("\\s", "").equalsIgnoreCase("invalid")) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( "Incorrect Value : " + row.getCell(14)  ,"Row " + (rowNum + 1) + " and Cell 15","Value should be Valid or Invalid"));
                    } else if (!insuranceMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( "Incorrect Date Format : " + row.getCell(13)
                                ,"Row " + (rowNum + 1) + " and Cell 14"));
                    } else if (!leaseStartMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( "Incorrect Date Format : " + row.getCell(17),
                                "Row " + (rowNum + 1) + " and Cell 18"));
                    } else if (!leaseExpiryMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( "Incorrect Date Format : " + row.getCell(18) ,
                                "Row " + (rowNum + 1) + " and Cell 19"));
                    } else if (getIntegerValue(row.getCell(2)) == null) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: "+row.getCell(2),"Row "+(rowNum+1)+" and cell 3"));
                    } else if (getIntegerValue(row.getCell(16)) == null) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: "+row.getCell(16),"Row"+(rowNum+1)+" and cell 17"));
                    }

                    Optional<Vendor> vendor = Optional.ofNullable(vendorRepository.findByVendorNameIgnoreCase(getStringValue(row.getCell(15))));

                    if (!vendor.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList( getStringValue(row.getCell(15)) + " vendor does not exist in the record", "Row " + (rowNum + 1) + " and Cell 16"));
                    }

                }

                return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Excel File is in Correct Format"));
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
    }

    private ExcelErrorResponse checkDuplicateRecord(Map<Integer, String> plateNumberList, Row row) {
        String plateNumber = getStringValue(row.getCell(1));

        for (Map.Entry<Integer, String> entry : plateNumberList.entrySet()) {
            if(plateNumber.equals(entry.getValue())){
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Duplicate Record in the Row : "+entry.getKey()+" and "+(row.getRowNum()+1),
                        "Duplicate Plate Number : "+plateNumber));
            }
        }
        plateNumberList.put(row.getRowNum()+1,plateNumber);
        return new ExcelErrorResponse(Boolean.TRUE,Arrays.asList("No Duplicate Record"));
    }


    public List<VehicleDto> toDtoList(List<Vehicle> vehicleList){
        return vehicleList.stream().map(this::toDto).collect(Collectors.toList());
    }

    private VehicleDto toDto(Vehicle vehicle) {
        return modelMapper.map(vehicle , VehicleDto.class);
    }


    private Vehicle toEntity(VehicleDto vehicleDto){
        return modelMapper.map(vehicleDto , Vehicle.class);
    }

    public List<VehicleDto> getAllNotAssignedVehicle() {
        return toDtoList(vehicleRepository.getNotAssignedVehicle());
    }
}
