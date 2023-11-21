package com.example.FleetSystem.payload;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMessage {

//    @JsonRawValue
    private List<String> message;

}
