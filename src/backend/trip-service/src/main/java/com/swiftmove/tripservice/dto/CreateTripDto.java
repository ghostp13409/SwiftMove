package com.swiftmove.tripservice.dto;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateTripDto {
    private Long moveRequestId;
    private Long moveOfferId;
    private String status;
}
