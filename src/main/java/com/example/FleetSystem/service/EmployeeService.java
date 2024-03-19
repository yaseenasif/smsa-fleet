package com.example.FleetSystem.service;

import com.example.FleetSystem.criteria.EmployeeSearchCriteria;
import com.example.FleetSystem.dto.EmployeeDto;
import com.example.FleetSystem.dto.EmployeeExcelDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.CheckAssignEmployee;
import com.example.FleetSystem.payload.ExcelErrorResponse;
import com.example.FleetSystem.payload.ResponseMessage;
import com.example.FleetSystem.repository.*;
import com.example.FleetSystem.specification.EmployeeSpecification;
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
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    FileHistoryRepository fileHistoryRepository;

    @Autowired
    FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    StorageService storageService;
    @Autowired
    VehicleAssignmentRepository vehicleAssignmentRepository;
    @Autowired
    ExcelExportService excelExportService;
    @Autowired
    ProductFieldRepository productFieldRepository;
    @Autowired
    JobTitleRepository jobTitleRepository;
    @Autowired
    GradeRepository gradeRepository;
    @Autowired
    RegionRepository regionRepository;

    public EmployeeDto deleteEmployeeById(Long id , EmployeeDto employeeDto) {
        Optional<Employee> employee = employeeRepository.findById(id);
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(employee.isPresent()){
//            Optional<Driver> driver = driverRepository.findByEmpId(employee.get());
//            if (driver.isPresent()){
//                driver.get().setAssignedVehicle(null);
//                driver.get().setStatus(Boolean.FALSE);
//                driverRepository.save(driver.get());
//            }

            if(principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByAssignToEmpId(employee.get());
                if (vehicleAssignment.isPresent()) {
                    vehicleAssignment.get().setDeletedAt(LocalDate.now());
                    vehicleAssignment.get().setDeletedBy(user);
                    vehicleAssignment.get().setAssignToEmpName(null);
                    vehicleAssignment.get().setAssignToEmpId(null);
                    vehicleAssignment.get().setStatus(Boolean.FALSE);
                }
            }
            employee.get().setStatus(employeeDto.getStatus());
            employee.get().setDeleteStatus(Boolean.FALSE);
            return toDto(employeeRepository.save(employee.get()));
        }

        throw new RuntimeException("Record doesn't exist");

    }

    public EmployeeDto save(EmployeeDto employeeDto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

            Optional<Employee> employee = employeeRepository.findByEmployeeNumber(employeeDto.getEmployeeNumber());

            if (employee.isPresent()){
                throw new RuntimeException("Employee Number already exist in the record : "+employeeDto.getEmployeeNumber());
            }

            Employee employee1 = toEntity(employeeDto);
            employee1.setCreatedBy(user);
            employee1.setCreatedAt(LocalDate.now());
            employee1.setStatus('A');
            employee1.setDeleteStatus(Boolean.TRUE);

            return toDto(employeeRepository.save(employee1));
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
                User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                employee.get().setEmployeeNumber(employeeDto.getEmployeeNumber());
                employee.get().setEmpName(employeeDto.getEmpName());
                employee.get().setSvEmployeeName(employeeDto.getSvEmployeeName());
                employee.get().setSvEmployeeNumber(employeeDto.getSvEmployeeNumber());
                employee.get().setJobTitle(employeeDto.getJobTitle());
                employee.get().setJoiningDate(employeeDto.getJoiningDate());
                employee.get().setDateOfBirth(employeeDto.getDateOfBirth());
                employee.get().setBudgetRef(employeeDto.getBudgetRef());
                employee.get().setGender(employeeDto.getGender());
                employee.get().setMaritalStatus(employeeDto.getMaritalStatus());
                employee.get().setDepartment(employeeDto.getDepartment());
                employee.get().setSection(employeeDto.getSection());
                employee.get().setLocation(employeeDto.getLocation());
                employee.get().setRegion(employeeDto.getRegion());
                employee.get().setCountry(employeeDto.getCountry());
                employee.get().setNationality(employeeDto.getNationality());
                employee.get().setContactNumber(employeeDto.getContactNumber());
                employee.get().setCompanyEmailAddress(employeeDto.getCompanyEmailAddress());
                employee.get().setGrade(employeeDto.getGrade());
                employee.get().setLicenseNumber(employeeDto.getLicenseNumber());
                employee.get().setVehicleBudget(employeeDto.getVehicleBudget());
                employee.get().setCostCentre(employeeDto.getCostCentre());
                employee.get().setNationalIdNumber(employeeDto.getNationalIdNumber());
                employee.get().setLocation(employeeDto.getLocation());
                employee.get().setOrganization(employeeDto.getOrganization());
                employee.get().setDivision(employeeDto.getDivision());
                employee.get().setFleetClassification(employeeDto.getFleetClassification());
                employee.get().setVehicleEligible(employeeDto.getVehicleEligible());
                employee.get().setDeptCode(employeeDto.getDeptCode());
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
            if(employee.get().isDeleteStatus()){
                throw new RuntimeException("Record is already Active");
            }
            employee.get().setDeleteStatus(Boolean.TRUE);
            return toDto(employeeRepository.save(employee.get()));
        }
        throw new RuntimeException(String.format("Employee Not Found by this Id => %d" , id));
    }


    @Transactional
    public List<String> addBulkEmployee(MultipartFile file){
        List<String> messages = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            ExcelErrorResponse checkFile = validateExcelFile(fileName,sheet);

            if(checkFile.isStatus()) {
                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {

                        Employee employee = new Employee();

                        SimpleDateFormat inputDateFormat = new SimpleDateFormat("d-MMM-yy");
                        SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");

                        String dateOfBirthValue = String.valueOf(row.getCell(5));
                        String joiningDateValue = String.valueOf(row.getCell(6));

                        try {
                            if (!dateOfBirthValue.isEmpty()) {
                                java.util.Date birthDateUtil = inputDateFormat.parse(dateOfBirthValue);
                                String birthDateSqlDateStr = outputDateFormat.format(birthDateUtil);
                                Date birthDateSql = Date.valueOf(birthDateSqlDateStr);
                                employee.setDateOfBirth(birthDateSql);
                            }

                            if (!joiningDateValue.isEmpty()) {
                                java.util.Date joiningDateUtil = inputDateFormat.parse(joiningDateValue);
                                String joiningDateSqlDateStr = outputDateFormat.format(joiningDateUtil);
                                Date joiningDateSql = Date.valueOf(joiningDateSqlDateStr);
                                employee.setJoiningDate(joiningDateSql);
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
                                DataFormatter dataFormatter = new DataFormatter();

                                Optional<JobTitle> jobTitle = jobTitleRepository.findByJobTitleAndStatusIsTrue(getStringValue(row.getCell(7)));
                                Optional<Grade> grade = gradeRepository.findByNameAndStatusIsTrue(getIntegerValue(row.getCell(19)));

                                employee.setEmployeeNumber(getLongValue(row.getCell(0)));
                                employee.setBudgetRef(getStringValue(row.getCell(1)));
                                employee.setEmpName(getStringValue(row.getCell(2)));
                                employee.setGender(row.getCell(3).getStringCellValue().charAt(0));
                                employee.setMaritalStatus(row.getCell(4).getStringCellValue().charAt(0));
                                employee.setRegion(getStringValue(row.getCell(8)));
                                employee.setCountry(getStringValue(row.getCell(9)));
                                employee.setLocation(getStringValue(row.getCell(10)));
                                employee.setOrganization(Objects.requireNonNull(getStringValue(row.getCell(12))).toUpperCase());
                                employee.setNationalIdNumber(getLongValue(row.getCell(13)));
                                employee.setSvEmployeeNumber(getLongValue(row.getCell(14)));
                                employee.setSvEmployeeName(getStringValue(row.getCell(15)));
                                employee.setCostCentre(getStringValue(row.getCell(16)));
                                employee.setNationality(Objects.requireNonNull(getStringValue(row.getCell(17))).toUpperCase());
                                employee.setCompanyEmailAddress(getStringValue(row.getCell(18)));
                                employee.setLicenseNumber(getStringValue(row.getCell(20)));
                                employee.setContactNumber(dataFormatter.formatCellValue(row.getCell(21)));
                                employee.setStatus('A');
                                employee.setCreatedBy(user);
                                employee.setCreatedAt(LocalDate.now());
                                employee.setDeleteStatus(Boolean.TRUE);
                                employee.setUuid(uuid);

                                if (row.getCell(11).getCellType() == CellType.STRING){
                                    employee.setDeptCode(Objects.requireNonNull(getStringValue(row.getCell(11))).toUpperCase());
                                }else{
                                    employee.setDeptCode(Objects.requireNonNull(getIntegerValue(row.getCell(11)).toString()).toUpperCase());
                                }
                                if (jobTitle.isPresent()) {
                                    employee.setJobTitle(jobTitle.get().getJobTitle());
                                    employee.setDivision(jobTitle.get().getDivision());
                                    employee.setDepartment(jobTitle.get().getDepartment());
                                    employee.setSection(jobTitle.get().getSection());
                                    employee.setFleetClassification(jobTitle.get().getFleetClassification());
                                    employee.setVehicleEligible(jobTitle.get().getVehicleEligible());
                                }

                                if (grade.isPresent()) {
                                    employee.setGrade(grade.get().getName());
                                    employee.setVehicleBudget(grade.get().getVehicleBudget());
                                }

                                employeeRepository.save(employee);

                            } else {
                                messages.add("UserName not Found");
                                return messages;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            throw new RuntimeException("Error processing data in the Excel file:" + e.getMessage());
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
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        }
            return null;
    }

    private Number getNumericValue(Cell cell){
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return cell.getNumericCellValue();
            }
        }
        return null;
    }
    private Long getLongValue(Cell cell){
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (long) cell.getNumericCellValue();
            }
        }
        return null;
    }

    private Integer getIntegerValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            }
        }
        return null;
    }

    private ExcelErrorResponse validateExcelFile(String fileName,Sheet sheet){

        Optional<FileHistory> fileHistory = Optional.ofNullable(fileHistoryRepository.findByFileName(fileName));
        if (fileHistory.isPresent()){
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(fileName+" is already uploaded. Please upload a different File."));
        }else {

            Map<Integer, Long> employeeNumberList = new HashMap<>();

            ExcelErrorResponse headerValidation = validateHeaderRow(sheet);

            if(!headerValidation.isStatus()){
                return headerValidation;
            }


                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {

                        for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                            if (String.valueOf(row.getCell(cellNum)).isEmpty()) {
                                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)));
                            }
                        }

                        Optional<Employee> employee = employeeRepository.findByEmployeeNumber(getLongValue(row.getCell(0)));
                        if (employee.isPresent()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Employee Number : " + getLongValue(row.getCell(0)) +
                                    " is already Present in the record", "Row : " + (rowNum + 1)));
                        }

                        ExcelErrorResponse checkDuplicate = checkDuplicateRecord(employeeNumberList, row);
                        if (!checkDuplicate.isStatus()) {
                            return checkDuplicate;
                        }

                        String regex = "^(0[1-9]|[1-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{4}$";
                        Pattern pattern = Pattern.compile(regex);
                        Matcher dateOfBirthMatcher = pattern.matcher(String.valueOf(row.getCell(5)));
                        Matcher joiningDateMatcher = pattern.matcher(String.valueOf(row.getCell(6)));


                        if (!dateOfBirthMatcher.matches()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(5), "Row " + (rowNum + 1) + " and Cell 6"));
                        } else if (!joiningDateMatcher.matches()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(6),
                                    "Row " + (rowNum + 1) + " and Cell 7"));
                        } else if (getNumericValue(row.getCell(0)) == null) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(0), "Row " + (rowNum + 1) + " and cell 1"));
                        } else if (getNumericValue(row.getCell(13)) == null) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(13), "Row " + (rowNum + 1) + " and cell 14"));
                        } else if (getNumericValue(row.getCell(14)) == null) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(14), "Row " + (rowNum + 1) + " and cell 15"));
                        } else if (getNumericValue(row.getCell(19)) == null) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("The cell does not contain a numeric value: " + row.getCell(19), "Row " + (rowNum + 1) + " and cell 20"));
                        } else if (!String.valueOf(row.getCell(3)).equalsIgnoreCase("M")
                                && !String.valueOf(row.getCell(3)).equalsIgnoreCase("F")) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Value : " + row.getCell(3), "Row " + (rowNum + 1) + " and Cell 4", "Correct Value : 'M' or 'F'"));
                        } else if (!String.valueOf(row.getCell(4)).equalsIgnoreCase("M")
                                && !String.valueOf(row.getCell(4)).equalsIgnoreCase("U")) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Value : " + row.getCell(4), "Row " + (rowNum + 1) + " and Cell 5", "Correct Value : 'M' or 'U'"));
                        }

                        Optional<JobTitle> jobTitle = jobTitleRepository.findByJobTitleAndStatusIsTrue(getStringValue(row.getCell(7)));
                        if (!jobTitle.isPresent()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(getStringValue(row.getCell(7)) + " job title does not exist in the record", "Row " + (rowNum + 1) + " and Cell 8"));
                        }

                        Optional<Grade> grade = gradeRepository.findByNameAndStatusIsTrue(getIntegerValue(row.getCell(19)));
                        if (!grade.isPresent()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(getStringValue(row.getCell(19)) + " job title does not exist in the record", "Row " + (rowNum + 1) + " and Cell 20"));
                        }

                        ExcelErrorResponse regionValidation = validateRegion(row);
                        if (!regionValidation.isStatus()) {
                            return regionValidation;
                        }
                    }else break;
                }


            ExcelErrorResponse productFieldValidation = validateProductFieldValues(sheet);
            if(!productFieldValidation.isStatus()){
                return productFieldValidation;
            }

            return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Excel File is in Correct Format"));
        }
    }

    private ExcelErrorResponse validateRegion(Row row){

        String region = getStringValue(row.getCell(8));
        String country = getStringValue(row.getCell(9));
        String city = getStringValue(row.getCell(10));

        Optional<Region> optionalRegion = regionRepository.findByNameAndStatusIsTrue(region);
        if (optionalRegion.isPresent()){
            String cities = optionalRegion.get().getCities();

            if(Objects.equals(optionalRegion.get().getCountry(), country)){

               cities = cities.replaceAll("\\[", "").replaceAll("\\]", "");
               String[] citiesArray = cities.split(",");
               boolean cityCheck = false;
                for (String cityList : citiesArray) {
                    if (cityList.trim().replaceAll("\"", "").equals(city)) {
                        cityCheck=true;
                        break;
                    }
                }
                if (!cityCheck){
                    return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList(city+" city doesn't exist in "+region+" region",
                            "Row "+(row.getRowNum()+1)));
                }

            }else {
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList(country+" doesn't have region '"+region+"'",
                        "Row: "+(row.getRowNum()+1)));
            }
        }else {
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(region+" region doesn't exist",
                    "Row "+(row.getRowNum()+1)));
        }
        return new ExcelErrorResponse(Boolean.TRUE,null);
    }
    private ExcelErrorResponse validateProductFieldValues(Sheet sheet){

        Map<Integer , String> productFields = new HashMap<>();
        productFields.put(11,"Dept Code");
        productFields.put(12,"Organization");
        productFields.put(17,"Nationality");

        for (Map.Entry<Integer, String> entry : productFields.entrySet()) {
            ProductField productField = productFieldRepository.findByNameAndStatusIsActive(entry.getValue());
            if(productField != null) {
                for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                    Row row = sheet.getRow(rowIndex);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {
                        String cellValue;
                        if(row.getCell(entry.getKey()).getCellType() == CellType.NUMERIC){
                            cellValue = getIntegerValue(row.getCell(entry.getKey())).toString();
                        }else{
                            cellValue = getStringValue(row.getCell(entry.getKey()));
                        }

                        Optional<String> checkDuplicateValues = productField.getProductFieldValuesList().stream()
                                .map(ProductFieldValues::getName)
                                .filter(value -> value.equalsIgnoreCase(cellValue))
                                .findFirst();

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
                    }else break;
                }
            }else {
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Product Field '"+entry.getValue()+"' doesn't exist in the record"));
            }
        }
        return new ExcelErrorResponse(Boolean.TRUE,Arrays.asList("Product Field validation successful"));
    }

    private ExcelErrorResponse validateHeaderRow(Sheet sheet) {

        Row headerRow = sheet.getRow(0);
        String[] expectedHeaders = {
                "EmployeeNumber", "BudgetRef", "EmployeeName", "Gender", "MaritalStatus", "DateOfBirth", "JoiningDate",
                "JobTitle", "Region", "Country", "Location", "DeptCode", "Organization", "NationalIdNumber",
                "SVEmployeeNumber", "SVEmployeeName",  "CostCentre", "Nationality", "CompanyEmailAddress", "Grade",
                "LicenseNumber","ContactNumber"
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
        return new ExcelErrorResponse(Boolean.TRUE,null);
    }

    private ExcelErrorResponse checkDuplicateRecord(Map<Integer, Long> employeeNumbers, Row row){

        Long empNum = getLongValue(row.getCell(0));

        for (Map.Entry<Integer, Long> entry : employeeNumbers.entrySet()) {
            if(empNum.equals(entry.getValue())){
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Duplicate Record in the Row : "+entry.getKey()+" and "+(row.getRowNum()+1),
                        "Duplicate Employee Number : "+empNum));
            }
        }
        employeeNumbers.put(row.getRowNum()+1,empNum);
        return new ExcelErrorResponse(Boolean.TRUE,Arrays.asList("No Duplicate Record"));
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

    public List<EmployeeDto> getAllUnAssignedEmployee() {
        return toDtoList(employeeRepository.getUnAssignedEmployee());
    }

    public ResponseMessage addAttachment(Long id, String attachmentType, MultipartFile multipartFile) throws IOException{
        Optional<Employee> employee = employeeRepository.findById(id);
        FileMetaData byFileName = fileMetaDataRepository.findByFileName(multipartFile.getOriginalFilename());

        if(byFileName == null) {
            String fileUrl = storageService.uploadFile(multipartFile.getBytes(), multipartFile.getOriginalFilename());
            String originalFileName = multipartFile.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            FileMetaData fileMetaData = new FileMetaData();
            fileMetaData.setFileUrl(fileUrl);
            fileMetaData.setFileExtension(fileExtension);
            fileMetaData.setFileName(multipartFile.getOriginalFilename());
            fileMetaData.setEmployee(employee.get());
            fileMetaData.setAttachmentType(attachmentType);
            fileMetaDataRepository.save(fileMetaData);

            return ResponseMessage.builder()
                    .message(Collections.singletonList("File uploaded to the server successfully"))
                    .build();
        }
        else {
            throw new RuntimeException(String.format("File already exists on the bucket with the same name"));
        }
    }

    public ResponseMessage deleteAttachment(Long id) {
        Optional<FileMetaData> fileMetaData = fileMetaDataRepository.findById(id);
        if(fileMetaData.isPresent()) {
            FileMetaData existingFileMetaData = fileMetaData.get();
            String fileName = existingFileMetaData.getFileName();

            fileMetaDataRepository.deleteById(id);

            storageService.deleteFile(fileName);

            return ResponseMessage.builder()
                    .message(Collections.singletonList("Attachment deleted successfully"))
                    .build();
        }
        else {
            throw new RuntimeException(String.format("Attachment with ID %d not found", id));
        }
    }

    public Page<EmployeeDto> searchEmployee(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Employee> employeeSpecification = EmployeeSpecification.getSearchSpecification(employeeSearchCriteria);
        Page<Employee> employeePage = employeeRepository.findAll(employeeSpecification,pageable);
        return employeePage.map(this::toDto);
    }

    public CheckAssignEmployee checkAssignedEmployee(Long empId){
        Optional<Employee> employee = employeeRepository.findById(empId);
        if (employee.isPresent()) {
            Optional<VehicleAssignment> vehicleAssignment = vehicleAssignmentRepository.findByAssignToEmpId(employee.get());
            CheckAssignEmployee check = new CheckAssignEmployee();
            if (vehicleAssignment.isPresent()) {
                check.setCheck(Boolean.TRUE);
            } else check.setCheck(Boolean.FALSE);

            return check;
        }
        throw new RuntimeException(String.format("employee not found by id =>%d",empId));
    }

//    public List<EmployeeDto> getEmployeesNotDriver() {
//        return toDtoList(employeeRepository.getEmployeesNotDriver());
//    }

    public Page<EmployeeDto> searchInactiveEmployee(EmployeeSearchCriteria employeeSearchCriteria, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Employee> employeeSpecification = EmployeeSpecification.getInactiveSearchSpecification(employeeSearchCriteria);
        Page<Employee> employeePage = employeeRepository.findAll(employeeSpecification, pageable);
        return employeePage.map(this::toDto);
    }

    private EmployeeExcelDto toEmployeeExcelDto(Employee employee){
        return modelMapper.map(employee, EmployeeExcelDto.class);
    }
    private List<EmployeeExcelDto> toEmployeeExcelDtoList(List<Employee> employeeList){
        return employeeList.stream().map(this::toEmployeeExcelDto).collect(Collectors.toList());
    }
    public byte[] downloadExcel(){
        List<Employee> employees = employeeRepository.findByDeleteStatusTrue();
        List<EmployeeExcelDto> employeeExcelDtoList = toEmployeeExcelDtoList(employees);
        return excelExportService.exportToExcel(employeeExcelDtoList);
    }
}
