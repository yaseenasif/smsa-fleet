package com.example.FleetSystem.controller;
import com.example.FleetSystem.payload.VehicleHistoryResponse;
import com.example.FleetSystem.service.PdfService;
import com.example.FleetSystem.service.VehicleService;
import com.itextpdf.text.DocumentException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
public class PdfController {

    @Autowired
    private PdfService pdfService;
    @Autowired
    VehicleService vehicleService;

    @GetMapping("/vehicle-history-download/{id}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id){
      log.info("In Controller");
        try {
            List<VehicleHistoryResponse> historyList = vehicleService.getVehicleHistoryById(id);
            byte[] pdfBytes = pdfService.generateVehicleHistoryPdf(historyList,id);

            log.info("After service call");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            log.info("Headers =>"+headers.toString());
            String filename = "vehicle_history_" + id + ".pdf";
            headers.setContentDispositionFormData("attachment", filename);

            log.info("header =>"+headers.toString());
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (IOException | DocumentException e) {
            e.printStackTrace();
//            return ResponseEntity.status(500).body(null);
            throw new RuntimeException("error in controller",e);
        }
    }
}
