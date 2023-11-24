package com.example.FleetSystem.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class FileMetaDataDto {

    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileExtension;
    private String attachmentType;
}
