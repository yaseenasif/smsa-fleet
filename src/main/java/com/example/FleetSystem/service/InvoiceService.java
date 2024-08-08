package com.example.FleetSystem.service;

import com.example.FleetSystem.dto.InvoiceDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.ExcelErrorResponse;
import com.example.FleetSystem.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FileHistoryRepository fileHistoryRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    ModelMapper modelMapper;

    @Transactional
    public List<String> saveInvoiceExcelData(MultipartFile file){
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

                    if (row == null || row.getPhysicalNumberOfCells() == 0 || (row.getCell(1) == null && row.getCell(2) == null && row.getCell(3) == null)) {
                        break;
                    }

                        Invoice invoice = new Invoice();

                        SimpleDateFormat inputDateFormat = new SimpleDateFormat("d-MMM-yy");
                        SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH);
                        String invoiceMonthStr = String.valueOf(row.getCell(3));
                        String invoiceDate = String.valueOf(row.getCell(8));
                        String dateFrom = String.valueOf(row.getCell(20));
                        String dateTo = String.valueOf(row.getCell(21));


                        try {

                            if (!invoiceDate.isEmpty()) {
                                java.util.Date invoiceUtilDate = inputDateFormat.parse(invoiceDate);
                                String invoiceSqlDateStr = outputDateFormat.format(invoiceUtilDate);
                                java.sql.Date invoiceSqlDate = java.sql.Date.valueOf(invoiceSqlDateStr);
                                invoice.setInvoiceDate(invoiceSqlDate);
                            }

                            if (!dateFrom.isEmpty()) {
                                java.util.Date utilDateFrom = inputDateFormat.parse(dateFrom);
                                String sqlDateFromStr = outputDateFormat.format(utilDateFrom);
                                java.sql.Date SqlDateFrom = java.sql.Date.valueOf(sqlDateFromStr);
                                invoice.setDateFrom(SqlDateFrom);
                            }

                            if (!dateTo.isEmpty()) {
                                java.util.Date utilDateTo = inputDateFormat.parse(dateTo);
                                String sqlDateToStr = outputDateFormat.format(utilDateTo);
                                java.sql.Date sqlDateTo = java.sql.Date.valueOf(sqlDateToStr);
                                invoice.setDateTo(sqlDateTo);
                            }


                            LocalDate date = LocalDate.parse(invoiceMonthStr, formatter);
                            YearMonth invoiceMonth = YearMonth.from(date);
                            invoice.setInvoiceMonth(invoiceMonth);


                        } catch (ParseException e) {
                            e.printStackTrace();
                            throw new RuntimeException("Error processing the Date: " + e.getMessage());
                        }

                        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                        if (principal instanceof UserDetails) {
                            String username = ((UserDetails) principal).getUsername();
                            User user = userRepository.findByEmployeeIdAndStatusIsTrue(username);

                            Vendor vendor = vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(getStringValue(row.getCell(2)));

                            invoice.setBusinessUnit(getStringValue(row.getCell(0)));
                            invoice.setInvoiceCategory(getStringValue(row.getCell(1)));
                            invoice.setSupplier(vendor);
                            invoice.setInvoiceFrom(getStringValue(row.getCell(4)));
                            invoice.setInvoiceTo(getStringValue(row.getCell(5)));
                            invoice.setInvoiceType(getStringValue(row.getCell(6)));
                            invoice.setInvoiceNumber(getStringValue(row.getCell(7)));
                            invoice.setAmountBeforeTax(getFloatValue(row.getCell(9)));
                            invoice.setTaxableAmount(getFloatValue(row.getCell(10)));
                            invoice.setTaxPercent(getFloatValue(row.getCell(11)));
                            invoice.setVATAmount(getFloatValue(row.getCell(12)));
                            invoice.setAmountAfterVAT(getFloatValue(row.getCell(13)));
                            invoice.setLineNumber(getLongValue(row.getCell(14)));
                            invoice.setPlateNumber(getStringValue(row.getCell(15)));
                            invoice.setVendorVehicleRefNumber(getLongValue(row.getCell(16)));
                            invoice.setAgreementNumber(getStringValue(row.getCell(17)));
                            invoice.setMonthlyRate(getIntegerValue(row.getCell(18)));
                            invoice.setLineAmountWithoutTax(getFloatValue(row.getCell(22)));
                            invoice.setLineTaxRate(getFloatValue(row.getCell(23)));
                            invoice.setLineTaxAmount(getFloatValue(row.getCell(24)));
                            invoice.setLineAmountWithTax(getFloatValue(row.getCell(25)));
                            invoice.setCreatedBy(user);
                            invoice.setCreatedAt(LocalDateTime.now());
                            invoice.setUuid(uuid);
                            invoice.setFileName(fileName);


                            invoiceRepository.save(invoice);
                        } else {
                            messages.add("UserName not Found");
                            throw new ExcelException(messages);
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

        }catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading the file: " + e.getMessage());
        }
    }


    private String getStringValue(Cell cell) {

        if (cell == null){
            return null;
        }
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

    private Long getLongValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (long) cell.getNumericCellValue();
            }
        }
        return null;
    }

    private Float getFloatValue(Cell cell) {
        if (cell != null) {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (float) cell.getNumericCellValue();
            }
        }
        return null;
    }

    private ExcelErrorResponse validateExcelFile(String fileName, Sheet sheet) {

        Optional<FileHistory> fileHistory = Optional.ofNullable(fileHistoryRepository.findByFileName(fileName));
        if (fileHistory.isPresent()) {
            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(fileName + " is already uploaded. Please upload a different File."));
        } else {

            ExcelErrorResponse headerValidation = validateHeaderRow(sheet);

            if (!headerValidation.isStatus()) {
                return headerValidation;
            }

            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);

                if (row == null || row.getPhysicalNumberOfCells() == 0 || (row.getCell(1) == null && row.getCell(2) == null && row.getCell(3) == null)) {
                    break;
                }

                    String plateNumberPattern = "\\d{4} [A-Z]{3}";

                    for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                        if (cellNum != 4 && cellNum != 5 && cellNum != 16 && cellNum != 17 && cellNum != 18 && cellNum != 20 && cellNum != 21) {
                            if (String.valueOf(row.getCell(cellNum)).isEmpty() || row.getCell(cellNum) == null) {
                                return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)));
                            }
                        }
                    }

                    if (!getStringValue(row.getCell(15)).matches(plateNumberPattern)) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Plate Number Format : " + row.getCell(15),
                                "Row " + (rowNum + 1) + " and Cell 16", "Correct Format : 1234 ABC"));
                    }

                    Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(15)));
                    if (!vehicle.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Plate Number : " + getStringValue(row.getCell(15)) +
                                "doesn't exist in fleet management", "Row : " + (rowNum + 1)));
                    }


                    String regex = "^(0[1-9]|[1-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{4}$";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher invoiceDateMatcher = pattern.matcher(String.valueOf(row.getCell(8)));

                    if (String.valueOf(row.getCell(20)).isEmpty() || row.getCell(20) == null) {
                        Matcher dateFromMatcher = pattern.matcher(String.valueOf(row.getCell(20)));
                        if (!dateFromMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(20),
                                "Row " + (rowNum + 1) + " and Cell 21"));
                        }
                    }

                    if (String.valueOf(row.getCell(21)).isEmpty() || row.getCell(21) == null) {
                        Matcher dateToMatcher = pattern.matcher(String.valueOf(row.getCell(21)));
                        if (!dateToMatcher.matches()) {
                            return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(21),
                                "Row " + (rowNum + 1) + " and Cell 22"));
                        }
                    }


                    if (!invoiceDateMatcher.matches()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(8),
                                "Row " + (rowNum + 1) + " and Cell 9"));

                    }

                    Optional<Vendor> vendor = Optional.ofNullable(vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(getStringValue(row.getCell(2))));
                    if (!vendor.isPresent()) {
                        return new ExcelErrorResponse(Boolean.FALSE, Arrays.asList(getStringValue(row.getCell(2)) + " Supplier does not exist in the Fleet Management", "Row " + (rowNum + 1) + " and Cell 3"));
                    }



            }

            return new ExcelErrorResponse(Boolean.TRUE, Arrays.asList("Excel File is in Correct Format"));
        }
    }

    private ExcelErrorResponse validateHeaderRow(Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        String[] expectedHeaders = {
                "BusinessUnit", "InvoiceCategory", "SupplierName", "InvoiceMonth", "InvoiceFrom", "InvoiceTo", "InvoiceType",
                "InvoiceNumber", "InvoiceDate", "TotalAmountBeforeTax", "TotalTaxableAmount", "Tax%", "TotalVatAmount(SAR)",
                "TotalAmountAfterVat(SAR)", "LineNo.", "PlateNo.", "VendorVehicleRefNumber", "POAgreementContractNo.",
                "MonthlyRate", "SupplierSite", "DateFrom", "DateTo", "LineAmount(withoutTax)", "LineTaxRate", "LineTaxAmount",
                "LineAmount(InclTax)"
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

    public List<InvoiceDto> getAll(){
        return toDtoList(invoiceRepository.findAll());
    }

    public InvoiceDto getById(Long id){
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if (invoice.isPresent()) {
            return toDto(invoice.get());
        }

        throw new RuntimeException(String.format("Invoice not found by id: %d",id));
    }

    public List<InvoiceDto> toDtoList(List<Invoice> Invoices){
        return Invoices.stream().map(this::toDto).collect(Collectors.toList());
    }

    public InvoiceDto toDto(Invoice Invoice){
        return modelMapper.map(Invoice, InvoiceDto.class);
    }

    private Invoice toEntity(InvoiceDto InvoiceDto){
        return modelMapper.map(InvoiceDto , Invoice.class);
    }
}
