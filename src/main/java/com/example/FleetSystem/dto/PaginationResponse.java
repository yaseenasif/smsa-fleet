package com.example.FleetSystem.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaginationResponse {
    private List<?> content;
    private Obj pageable;
    private Integer size;
    private Integer totalElements;
    private Integer totalPages;
    private Boolean lastPage;
}
