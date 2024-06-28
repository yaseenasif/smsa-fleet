package com.example.FleetSystem.controller;
import com.example.FleetSystem.payload.VehicleHistoryResponse;
import com.example.FleetSystem.service.PdfService;
import com.example.FleetSystem.service.VehicleService;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PdfController {

    @Autowired
    private PdfService pdfService;
    @Autowired
    VehicleService vehicleService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_SUPERVISOR','ROLE_FLEETMANAGER','ROLE_PROJECTMANAGER','ROLE_FINANCE')")
    @GetMapping("/vehicle-history-download/{id}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id){
        try {
            List<VehicleHistoryResponse> historyList = vehicleService.getVehicleHistoryById(id);
            byte[] pdfBytes = pdfService.generateVehicleHistoryPdf(historyList,id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            String filename = "vehicle_history_" + id + ".pdf";
            headers.setContentDispositionFormData("attachment", filename);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (IOException | DocumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
