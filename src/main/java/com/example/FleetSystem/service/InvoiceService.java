package com.example.FleetSystem.service;

import com.example.FleetSystem.criteria.InvoiceSearchCriteria;
import com.example.FleetSystem.dto.InvoiceDto;
import com.example.FleetSystem.dto.InvoiceUploadRequest;
import com.example.FleetSystem.dto.VendorDto;
import com.example.FleetSystem.exception.ExcelException;
import com.example.FleetSystem.model.*;
import com.example.FleetSystem.payload.EmailApprovalRequest;
import com.example.FleetSystem.payload.InvoiceActionPayload;
import com.example.FleetSystem.payload.ResponsePayload;
import com.example.FleetSystem.payload.UploadDataFileResponse;
import com.example.FleetSystem.repository.*;
import com.example.FleetSystem.specification.InvoiceFileSpecification;
import com.example.FleetSystem.specification.InvoiceSpecification;
import org.apache.poi.ss.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
    VehicleAssignmentRepository vehicleAssignmentRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    VendorRepository vendorRepository;
    @Autowired
    InvoiceFileRepository invoiceFileRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    StorageService storageService;
    @Autowired
    ExcelErrorService excelErrorService;
    @Autowired
    EmailService emailService;

    @Transactional
    public UploadDataFileResponse saveInvoiceExcelData(MultipartFile file , InvoiceUploadRequest invoiceUploadRequest){
        List<String> messages = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            UploadDataFileResponse checkFile = validateExcelFile(fileName, sheet , invoiceUploadRequest.getInvoiceType(), invoiceUploadRequest.getInvoiceMonth());

            if (checkFile.isStatus()) {
                if(checkFile.isExcelStatus()){
                    return checkFile;
                }
                User user = null;
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof UserDetails) {
                    String username = ((UserDetails) principal).getUsername();
                    user = userRepository.findByEmployeeIdAndStatusIsTrue(username);
                }else {
                        messages.add("UserName not Found");
                        throw new ExcelException(messages);
                    }

                SimpleDateFormat inputDateFormat = new SimpleDateFormat("d-MMM-yy");
                SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH);
                DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM-yyyy", Locale.ENGLISH);

                YearMonth formattedInvoiceMonth = YearMonth.parse(invoiceUploadRequest.getInvoiceMonth() , monthFormatter);

                InvoiceFile invoiceFile = InvoiceFile.builder()
                        .fileName(fileName)
                        .invoiceMonth(formattedInvoiceMonth).invoiceType(invoiceUploadRequest.getInvoiceType())
                        .createdAt(LocalDate.now()).createdBy(user)
                        .uuid(uuid)
                        .build();

                storageService.uploadFile(file.getBytes(), file.getOriginalFilename());
                invoiceFileRepository.save(invoiceFile);

                for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                    Row row = sheet.getRow(rowNum);

                    if (row == null || row.getPhysicalNumberOfCells() == 0 || (row.getCell(1) == null && row.getCell(2) == null && row.getCell(3) == null)) {
                        break;
                    }

                        Invoice invoice = new Invoice();

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


                            Vendor vendor = vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(getStringValue(row.getCell(2)));
                            Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(15)));

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
                            invoice.setVatAmount(getFloatValue(row.getCell(12)));
                            invoice.setAmountAfterVAT(getFloatValue(row.getCell(13)));
                            invoice.setLineNumber(getLongValue(row.getCell(14)));
//                            invoice.setPlateNumber(getStringValue(row.getCell(15)));
                            vehicle.ifPresent(invoice::setVehicle);
                            invoice.setVendorVehicleRefNumber(getLongValue(row.getCell(16)));
                            invoice.setAgreementNumber(getStringValue(row.getCell(17)));
                            invoice.setMonthlyRate(getIntegerValue(row.getCell(18)));
                            invoice.setLineAmountWithoutTax(getFloatValue(row.getCell(22)));
                            invoice.setLineTaxRate(getFloatValue(row.getCell(23)));
                            invoice.setLineTaxAmount(getFloatValue(row.getCell(24)));
                            invoice.setLineAmountWithTax(getFloatValue(row.getCell(25)));
                            invoice.setInvoiceFile(invoiceFile);
                            invoice.setCreatedBy(user);
                            invoice.setCreatedAt(LocalDate.now());
                            invoice.setUuid(uuid);

                            invoiceRepository.save(invoice);
                        }

                messages.add("File uploaded and data saved successfully.");
                return checkFile;

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

    private UploadDataFileResponse validateExcelFile(String fileName, Sheet sheet, String invoiceType, String invoiceMonth) {

        Optional<InvoiceFile> invoiceFile = Optional.ofNullable(invoiceFileRepository.findByFileName(fileName));
        if (invoiceFile.isPresent()) {
            return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList(fileName + " is already uploaded. Please upload a different File."),null,Boolean.FALSE);
        } else {

            UploadDataFileResponse headerValidation = validateHeaderRow(sheet);

            if (!headerValidation.isStatus()) {
                return headerValidation;
            }

            HashMap<Integer,List<String>> errors = new HashMap<>();
//            boolean excelErrorStatus = false;
            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);

                if (row == null || row.getPhysicalNumberOfCells() == 0 || (row.getCell(1) == null && row.getCell(2) == null && row.getCell(3) == null)) {
                    break;
                }

                    for (int cellNum = 0; cellNum <= row.getLastCellNum() - 1; cellNum++) {
                        if (cellNum != 4 && cellNum != 5 && cellNum != 16 && cellNum != 17 && cellNum != 18 && cellNum != 20 && cellNum != 21) {
                            if (String.valueOf(row.getCell(cellNum)).isEmpty() || row.getCell(cellNum) == null) {
                                return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList("Empty Value at Row " + (rowNum + 1) + " and Cell " + (cellNum + 1)),null,Boolean.FALSE);
                            }
                        }
                    }

                    if (!Objects.requireNonNull(getStringValue(row.getCell(1))).equalsIgnoreCase(invoiceType)){
                        errors.computeIfAbsent(rowNum + 1, k -> new ArrayList<>())
                                .add("Incorrect Invoice Type");
                    }

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.ENGLISH);
                DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM-yyyy", Locale.ENGLISH);
                String invoiceMonthStr = String.valueOf(row.getCell(3));
                LocalDate date = LocalDate.parse(invoiceMonthStr, formatter);
                YearMonth excelInvoiceMonth = YearMonth.from(date);

                YearMonth formattedInvoiceMonth = YearMonth.parse(invoiceMonth , monthFormatter);

                if (!excelInvoiceMonth.equals(formattedInvoiceMonth)){
                    errors.computeIfAbsent(rowNum + 1, k -> new ArrayList<>())
                            .add("Incorrect Invoice Month");
                }



                    Optional<Vehicle> vehicle = vehicleRepository.findByPlateNumber(getStringValue(row.getCell(15)));
                    if (!vehicle.isPresent()) {
                        errors.computeIfAbsent(rowNum + 1, k -> new ArrayList<>())
                                .add("Plate Number doesn't exist in fleet management");
                    }


                    String regex = "^(0[1-9]|[1-2][0-9]|3[0-1])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\\d{4}$";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher invoiceDateMatcher = pattern.matcher(String.valueOf(row.getCell(8)));

                    if (String.valueOf(row.getCell(20)).isEmpty() || row.getCell(20) == null) {
                        Matcher dateFromMatcher = pattern.matcher(String.valueOf(row.getCell(20)));
                        if (!dateFromMatcher.matches()) {
                        return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(20),
                                "Row " + (rowNum + 1) + " and Cell 21"),null,Boolean.FALSE);
                        }
                    }

                    if (String.valueOf(row.getCell(21)).isEmpty() || row.getCell(21) == null) {
                        Matcher dateToMatcher = pattern.matcher(String.valueOf(row.getCell(21)));
                        if (!dateToMatcher.matches()) {
                            return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(21),
                                "Row " + (rowNum + 1) + " and Cell 22"),null,Boolean.FALSE);
                        }
                    }


                    if (!invoiceDateMatcher.matches()) {
                        return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList("Incorrect Date Format : " + row.getCell(8),
                                "Row " + (rowNum + 1) + " and Cell 9"),null,Boolean.FALSE);

                    }

                    Optional<Vendor> vendor = Optional.ofNullable(vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(getStringValue(row.getCell(2))));
                    if (!vendor.isPresent()) {
                        errors.computeIfAbsent(rowNum + 1, k -> new ArrayList<>())
                                .add("Supplier does not exist in the Fleet Management");
                    }

            }

            if (!errors.isEmpty()){
                try {
                    ByteArrayResource errorBytes = excelErrorService.createErrorExcelFile(errors);
                    return new UploadDataFileResponse(Boolean.TRUE,null,errorBytes,Boolean.TRUE);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }
            }

            return new UploadDataFileResponse(Boolean.TRUE, Arrays.asList("File uploaded and data saved successfully."),null,Boolean.FALSE);
        }
    }

    private UploadDataFileResponse validateHeaderRow(Sheet sheet) {
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
                return new UploadDataFileResponse(Boolean.FALSE, Arrays.asList("Error in column : " + actualHeader,
                        "Row : " + (headerRow.getRowNum() + 1) + " and Cell : " + (i + 1)
                        , "Please check the Sample Format of Excel File"),null,Boolean.FALSE);
            }
        }
        return new UploadDataFileResponse(Boolean.TRUE, null,null,Boolean.FALSE);
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

    public HashMap<String,List<Invoice>> getSupplierSeparatedInvoices(Long invoiceFileId){
        Optional<InvoiceFile> invoiceFile = invoiceFileRepository.findById(invoiceFileId);
        if (invoiceFile.isPresent()){
            HashMap<String, List<Invoice>> supplierSeparatedInvoices = new HashMap<>();
            List<Invoice> invoices = invoiceRepository.findByInvoiceFile(invoiceFile.get());

            for (Invoice invoice : invoices) {
                String supplierName = invoice.getSupplier().getVendorName();

                if (supplierSeparatedInvoices.containsKey(supplierName)) {
                    supplierSeparatedInvoices.get(supplierName).add(invoice);
                } else {
                    List<Invoice> supplierInvoices = new ArrayList<>();
                    supplierInvoices.add(invoice);
                    supplierSeparatedInvoices.put(supplierName, supplierInvoices);
                }
            }
            return supplierSeparatedInvoices;
        }else throw new RuntimeException(String.format("Invoice File not found By Id : %d", invoiceFileId));
    }

    public List<InvoiceDto> getInvoicesBySupplierAndFileId(Long fileId, String supplierName){
        Optional<InvoiceFile> invoiceFile = invoiceFileRepository.findById(fileId);
        Vendor supplier = vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(supplierName);

        if (invoiceFile.isPresent()){
            return toDtoList(invoiceRepository.findByInvoiceFileAndSupplier(invoiceFile.get(),supplier));
        }else throw new RuntimeException("Error finding file id: "+fileId);
    }

    public List<Invoice> getInvoicesSuppliersByFileId(Long fileId) {
        Optional<InvoiceFile> invoiceFile = invoiceFileRepository.findById(fileId);
        if (invoiceFile.isPresent()) {
            List<Invoice> invoices = invoiceRepository.findByInvoiceFile(invoiceFile.get());
            return new ArrayList<>(invoices.stream()
                    .collect(Collectors.toMap(
                            Invoice::getSupplier,  // Key: Supplier
                            invoice -> invoice,    // Value: Invoice
                            (existing, replacement) -> existing // In case of duplicate suppliers, keep the existing one
                    ))
                    .values());

        }else throw new RuntimeException("File not found by id: "+fileId);
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


    public List<InvoiceDto> searchInvoice(String invoiceType, String invoiceCategory, String invoiceMonth, String supplierName, String invoiceNumber) {
        YearMonth formattedInvoiceMonth = null;
        if (invoiceMonth != null && !invoiceMonth.trim().isEmpty()) {
            try {
                DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM-yyyy", Locale.ENGLISH);
                formattedInvoiceMonth = YearMonth.parse(invoiceMonth.trim(), monthFormatter);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format for invoiceMonth. Expected format is MM-yyyy.", e);
            }
        }

        Specification<Invoice> invoiceSpecification = InvoiceSpecification.getSearchSpecificationByFields(
                invoiceType, invoiceCategory, formattedInvoiceMonth, supplierName, invoiceNumber
        );

        List<Invoice> invoices = invoiceRepository.findAll(invoiceSpecification);
        return toDtoList(invoices);
    };

    public HashMap<Long, VehicleAssignment> getValidatedInvoices(List<Invoice> invoices){
        HashMap<Long, VehicleAssignment> validatedInvoices = new HashMap<>();
        for (Invoice invoice: invoices) {
            Optional<VehicleAssignment> assignment = vehicleAssignmentRepository.findByVehicleAndStatusIsTrue(invoice.getVehicle());
            if (assignment.isPresent()){
                validatedInvoices.put(invoice.getId(),assignment.get());
            }else validatedInvoices.put(invoice.getId(),null);
        }
        return validatedInvoices;
    }

    @Transactional
    public void sendForApproval(EmailApprovalRequest emailApprovalRequest){
//        emailService.sendEmail("yaseenasif042@gmal.com", "Invoice Approval Request",
//                emailApprovalRequest.getSupplier(), emailApprovalRequest.getInvoiceMonth().toString(), emailApprovalRequest.getInvoiceType());

        Vendor supplier = vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(emailApprovalRequest.getSupplier());
        List<Invoice> invoices = invoiceRepository.findBySupplierAndInvoiceMonthAndInvoiceCategory(supplier,
                emailApprovalRequest.getInvoiceMonth(), emailApprovalRequest.getInvoiceType());

        if (!invoices.isEmpty()){
            invoices.forEach(invoice -> {
                invoice.setApprovalStatus("Waiting");
            });
            invoiceRepository.saveAll(invoices);
        }

    }

    public List<Invoice> getWaitingForApprovalInvoices(){
        List<Invoice> invoices = invoiceRepository.findByApprovalStatus("Waiting");

        return new ArrayList<>(
                invoices.stream()
                        .collect(Collectors.toMap(
                                invoice -> Arrays.asList(
                                        invoice.getSupplier(),
                                        invoice.getInvoiceType(),
                                        invoice.getInvoiceMonth()
                                ),
                                invoice -> invoice,
                                (existing, replacement) -> existing 
                        )).values()
        );
    }

    @Transactional
    public ResponsePayload actionOnInvoice(InvoiceActionPayload invoiceActionPayload){
        Vendor supplier = vendorRepository.findByVendorNameIgnoreCaseAndStatusIsTrue(invoiceActionPayload.getSupplierName());
        List<Invoice> invoices = invoiceRepository.findBySupplierAndInvoiceMonthAndInvoiceCategory(supplier,
                invoiceActionPayload.getInvoiceMonth(),invoiceActionPayload.getInvoiceType());

        if (!invoices.isEmpty()){
         switch (invoiceActionPayload.getStatus()) {
             case "Approve":
                invoices.forEach(invoice -> {
                    invoice.setApprovalStatus("Approved");
                    invoice.setRemarks(invoiceActionPayload.getRemarks());
                });
                break;
             case "Reject":
                 invoices.forEach(invoice -> {
                     invoice.setApprovalStatus("Reject");
                     invoice.setRemarks(invoiceActionPayload.getRemarks());
                 });
                 break;
             case "Info":
                 invoices.forEach(invoice -> {
                     invoice.setApprovalStatus("More Info");
                     invoice.setRemarks(invoiceActionPayload.getRemarks());
                 });
                 break;
             default:
                 break;
         }
            invoiceRepository.saveAll(invoices);
        }
        return new ResponsePayload("Submitted Successfully");
    }
}
