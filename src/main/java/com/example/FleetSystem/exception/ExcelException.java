package com.example.FleetSystem.exception;

import java.util.List;

public class ExcelException extends RuntimeException {
    public ExcelException(List<String> message) {
        super(String.join("\n", message));
    }
}
