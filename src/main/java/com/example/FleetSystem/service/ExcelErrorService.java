package com.example.FleetSystem.service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExcelErrorService {

    public ByteArrayResource createErrorExcelFile(HashMap<Integer,List<String>> errorRows) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet errorSheet = workbook.createSheet("Errors");

        Row headerRow = errorSheet.createRow(0);
        headerRow.createCell(0).setCellValue("Row Number");
        headerRow.createCell(1).setCellValue("Error Description");

        int rowNum = 1;
        for (Map.Entry<Integer, List<String>> entry : errorRows.entrySet()) {
            Row row = errorSheet.createRow(rowNum++);

            // Row number
            row.createCell(0).setCellValue(entry.getKey());

            // Join the list of errors into a single string separated by '~'
            String errors = String.join(" ~ ", entry.getValue());

            // Error description
            row.createCell(1).setCellValue(errors);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayResource(outputStream.toByteArray());
    }

}


