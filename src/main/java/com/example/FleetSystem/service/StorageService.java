package com.example.FleetSystem.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@Slf4j
public class StorageService {
    public static final String BUCKET_NAME="cdvinv";
    @Autowired
    private AmazonS3 s3Client;

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);

    public String uploadFile(byte[] fileData, String fileName) {
        try{
            ByteArrayInputStream inputStream = new ByteArrayInputStream(fileData);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(fileData.length);
            logger.info(BUCKET_NAME);
            s3Client.putObject(new PutObjectRequest(BUCKET_NAME, fileName, inputStream, metadata));
            String fileUrl =s3Client.getUrl(BUCKET_NAME,fileName).toString();
            return fileUrl;
        }catch (Exception e){
            logger.error("file not uploaded to s3 bucket",fileName);
            throw new RuntimeException(e.getMessage());
        }

    }

    public byte[] downloadFile(String fileName) {
        try {
            S3Object s3Object = s3Client.getObject(BUCKET_NAME, fileName);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            try {
                return IOUtils.toByteArray(inputStream);
            } finally {
                // Ensure the input stream is closed
                inputStream.close();
            }
        } catch (IOException e) {
            logger.error("cannot download file from s3 bucket");
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteFile(String fileName) {
        try {
            s3Client.deleteObject(BUCKET_NAME, fileName);
        } catch (AmazonServiceException e) {
            logger.error("Error deleting file from S3 bucket", e);
            throw new RuntimeException("Error deleting file from S3 bucket");
        }

    }
}
