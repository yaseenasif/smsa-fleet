package com.example.FleetSystem.service;

import com.amazonaws.services.dynamodbv2.xspec.S;
import com.example.FleetSystem.dto.JobTitleDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ExcelErrorResponse;
import com.example.FleetSystem.repository.FileHistoryRepository;
import com.example.FleetSystem.repository.JobTitleRepository;
import com.example.FleetSystem.repository.ProductFieldRepository;
import org.apache.poi.ss.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
public class JobTitleService {

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    JobTitleRepository jobTitleRepository;
    @Autowired
    FileHistoryRepository fileHistoryRepository;
    @Autowired
    ProductFieldRepository productFieldRepository;

    public JobTitleDto addJobTitle(JobTitleDto jobTitleDto) {
        JobTitle jobTitle = toEntity(jobTitleDto);
        jobTitle.setStatus(Boolean.TRUE);
        return toDto(jobTitleRepository.save(jobTitle));
    }

    private JobTitle toEntity(JobTitleDto jobTitleDto) {
        return modelMapper.map(jobTitleDto, JobTitle.class);
    }

    public JobTitleDto toDto(JobTitle jobTitle) {
        return modelMapper.map(jobTitle, JobTitleDto.class);
    }

    public List<JobTitleDto> toDtoList(List<JobTitle> jobTitleList) {
        return jobTitleList.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<JobTitleDto> getAllJobTitles() {
        return toDtoList(jobTitleRepository.getActiveJobTitles());
    }

    public JobTitleDto getJobTitleById(Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if(optionalJobTitle.isPresent()) {
           return toDto(optionalJobTitle.get());
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }

    public JobTitleDto updateJobTitleById(JobTitleDto jobTitleDto, Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if(optionalJobTitle.isPresent()) {
            optionalJobTitle.get().setJobTitle(jobTitleDto.getJobTitle());
            optionalJobTitle.get().setDivision(jobTitleDto.getDivision());
            optionalJobTitle.get().setDepartment(jobTitleDto.getDepartment());
            optionalJobTitle.get().setSection(jobTitleDto.getSection());
            optionalJobTitle.get().setFleetClassification(jobTitleDto.getFleetClassification());
            optionalJobTitle.get().setVehicleEligible(jobTitleDto.getVehicleEligible());

            return toDto(jobTitleRepository.save(optionalJobTitle.get()));
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }

    public JobTitleDto deleteJobTitle(Long id) {
        Optional<JobTitle> optionalJobTitle = jobTitleRepository.findById(id);
        if (optionalJobTitle.isPresent()) {
            optionalJobTitle.get().setStatus(Boolean.FALSE);
            return toDto(jobTitleRepository.save(optionalJobTitle.get()));
        }
        throw new RuntimeException(String.format("Job Title not found by id: => %d", id));
    }

    @Transactional
    public List<String> addBulkJobTitles(MultipartFile file){
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

                        JobTitle jobTitle = new JobTitle();

                        try {

                            jobTitle.setJobTitle(getStringValue(row.getCell(1)));
                            jobTitle.setDepartment(getStringValue(row.getCell(2)));
                            jobTitle.setDivision(getStringValue(row.getCell(0)));
                            jobTitle.setSection(getStringValue(row.getCell(3)));
                            jobTitle.setFleetClassification(getStringValue(row.getCell(4)));
                            jobTitle.setVehicleEligible(getStringValue(row.getCell(5)));
                            jobTitle.setStatus(Boolean.TRUE);

                            jobTitleRepository.save(jobTitle);

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


    private ExcelErrorResponse validateExcelFile(String fileName, Sheet sheet) {
        Optional<FileHistory> fileHistory = Optional.ofNullable(fileHistoryRepository.findByFileName(fileName));
        if (fileHistory.isPresent()){
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(fileName+" is already uploaded. Please upload a different File."));
        }else {

            Map<Integer, String> jobTitleList = new HashMap<>();

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

                    Optional<JobTitle> jobTitle = jobTitleRepository.findByJobTitleAndStatusIsTrue(getStringValue(row.getCell(1)));
                    if (jobTitle.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Job Title : " + getStringValue(row.getCell(1)) +
                                " is already Present in the record", "Row : " + (rowNum + 1)));
                    }

                    ExcelErrorResponse checkDuplicate = checkDuplicateRecord(jobTitleList, row);
                    if (!checkDuplicate.isStatus()) {
                        return checkDuplicate;
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

    private ExcelErrorResponse validateProductFieldValues(Sheet sheet) {
        Map<Integer , String> productFields = new HashMap<>();
        productFields.put(0,"Division");
        productFields.put(2,"Department");
        productFields.put(3,"Section");
        productFields.put(4,"Fleet Classification");
        productFields.put(5,"Vehicle Eligible");

        for (Map.Entry<Integer, String> entry : productFields.entrySet()) {
            ProductField productField = productFieldRepository.findByNameAndStatusIsActive(entry.getValue());
            if(productField != null) {
                for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                    Row row = sheet.getRow(rowIndex);
                    if (row != null && row.getPhysicalNumberOfCells() > 0) {
                        String cellValue;
                        cellValue = getStringValue(row.getCell(entry.getKey())).toString();

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
                "Division", "JobTitle", "Department", "Section", "FleetClassification", "VehicleEligible"
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

    private ExcelErrorResponse checkDuplicateRecord(Map<Integer, String> jobTitleList, Row row) {
        String jobTitle = getStringValue(row.getCell(1));

        for (Map.Entry<Integer, String> entry : jobTitleList.entrySet()) {
            if(jobTitle.equals(entry.getValue())){
                return new ExcelErrorResponse(Boolean.FALSE,Arrays.asList("Duplicate Record in the Row : "+entry.getKey()+" and "+(row.getRowNum()+1),
                        "Duplicate Employee Number : "+jobTitle));
            }
        }
        jobTitleList.put(row.getRowNum()+1,jobTitle);
        return new ExcelErrorResponse(Boolean.TRUE,Arrays.asList("No Duplicate Record"));
    }


}
