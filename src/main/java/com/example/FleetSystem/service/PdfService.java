package com.example.FleetSystem.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.example.FleetSystem.model.Vehicle;
import com.example.FleetSystem.payload.VehicleHistoryResponse;

import com.example.FleetSystem.repository.VehicleRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class PdfService {

    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    private AmazonS3 s3Client;

    public static final String BUCKET_NAME="fms.smsaexpress.com";


    public byte[] generateVehicleHistoryPdf (List <VehicleHistoryResponse> historyList,Long vehicleId) throws
        IOException, DocumentException {
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                Document document = new Document(PageSize.A4);

                Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);

                PdfWriter.getInstance(document, outputStream);
                document.open();

                Image img = downloadImage("smsa-logo.jpeg");
                img.setAbsolutePosition(10, 770); // Adjust X and Y coordinates as needed
                img.scaleToFit(100, 100);
                document.add(img);
                document.add(Chunk.NEWLINE);

                Font headerFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
                Paragraph header = new Paragraph("Vehicle History", headerFont);
                header.setAlignment(Element.ALIGN_CENTER);
                document.add(header);
                document.add(Chunk.NEWLINE);

                Font subheaderFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD);
                Paragraph subHeader = new Paragraph("Plate Number: "+vehicle.get().getPlateNumber()+
                        "      Vendor: "+vehicle.get().getVendor().getVendorName()+"      Lease Expiry: "+vehicle.get().getLeaseExpiryDate(), subheaderFont);
                subHeader.setAlignment(Element.ALIGN_CENTER);
                document.add(subHeader);
                document.add(Chunk.NEWLINE);

                Class<?> clazz = historyList.get(0).getClass();
                Field[] fields = clazz.getDeclaredFields();

                PdfPTable table = new PdfPTable(fields.length+1);
                addTableHeader(table);
                addRows(table, historyList);

                document.add(table);
                document.close();

                return outputStream.toByteArray();

            }catch (IOException | DocumentException e) {
                e.printStackTrace();
                throw e;
            }
        }
        private static void addTableHeader (PdfPTable table){
            table.addCell("Action");
            table.addCell("Date");
            table.addCell("Time");
            table.addCell("Created By");
            table.addCell("Emp No");
            table.addCell("Emp Name");
            table.addCell("Plate Number");
        }

        private static void addRows (PdfPTable table, List<VehicleHistoryResponse> historyList){
            for (VehicleHistoryResponse history : historyList) {
                table.addCell(history.getType());
                table.addCell(history.getCreatedAt().toLocalDate().toString());
                table.addCell(history.getCreatedAt().toLocalTime().toString());
                table.addCell(history.getCreatedBy());
                if(history.getEmpNo() != null) {
                    table.addCell(history.getEmpNo().toString());
                    table.addCell(history.getEmpName());
                }else { table.addCell("");
                 table.addCell("");
                }
                if (history.getPlateNumber() != null) {
                    table.addCell(history.getPlateNumber());
                }else table.addCell("");
            }
        }

    public Image downloadImage(String fileName) {
        try {
            S3Object s3Object = s3Client.getObject(BUCKET_NAME, fileName);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            try {
                byte[] imageData = IOUtils.toByteArray(inputStream);
                return Image.getInstance(imageData);
            } finally {
                inputStream.close();
            }
        } catch (IOException | BadElementException e) {
            log.error("cannot download file from s3 bucket");
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }
}
