package com.example.FleetSystem.payload;

import lombok.*;
import org.springframework.core.io.ByteArrayResource;

import java.util.List;

@Builder
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadDataFileResponse {

    private boolean status;
    private List<String> message;
    private ByteArrayResource byteArrayResource;
    private boolean excelStatus;

}
