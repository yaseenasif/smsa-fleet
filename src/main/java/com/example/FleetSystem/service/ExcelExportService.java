package com.example.FleetSystem.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;

@Service
public class ExcelExportService {

    public <T> byte[] exportToExcel(List<T> dataList) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sheet1");
            int rowNum = 0;

            if (!dataList.isEmpty()) {
                T firstObject = dataList.get(0);
                Field[] fields = firstObject.getClass().getDeclaredFields();

                // Create header row
                Row headerRow = sheet.createRow(rowNum++);
                CellStyle headerCellStyle = workbook.createCellStyle();
                Font headerFont = workbook.createFont();
                headerFont.setBold(true);
                headerCellStyle.setFont(headerFont);
                headerCellStyle.setBorderBottom(BorderStyle.THIN);
                headerCellStyle.setBorderTop(BorderStyle.THIN);
                headerCellStyle.setBorderLeft(BorderStyle.THIN);
                headerCellStyle.setBorderRight(BorderStyle.THIN);
                for (int i = 0; i < fields.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(fields[i].getName());
                    cell.setCellStyle(headerCellStyle);
                }

                // Populate data rows
                for (T data : dataList) {
                    Row row = sheet.createRow(rowNum++);
                    for (int i = 0; i < fields.length; i++) {
                        fields[i].setAccessible(true);
                        Object value = fields[i].get(data);
                        Cell cell = row.createCell(i);
                        if (value != null) {
                            if (value instanceof String) {
                                cell.setCellValue((String) value);
                            } else if (value instanceof Number) {
                                cell.setCellValue(((Number) value).doubleValue());
                            } else {
                                cell.setCellValue(value.toString());
                            }
                        }
                    }
                }

                for (int i = 0; i < fields.length; i++) {
                    sheet.autoSizeColumn(i);
                }

                sheet.setDisplayGridlines(true);
                sheet.setPrintGridlines(true);
                sheet.setFitToPage(true);
                sheet.setHorizontallyCenter(true);
                sheet.setVerticallyCenter(true);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (IOException | IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}
