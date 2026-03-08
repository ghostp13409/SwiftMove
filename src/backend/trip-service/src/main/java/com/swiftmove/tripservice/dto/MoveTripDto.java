package com.swiftmove.tripservice.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MoveTripDto {

    private Long id;
    private  Long moveRequestId;
    private Long moveOfferId;
    private String status;
}
