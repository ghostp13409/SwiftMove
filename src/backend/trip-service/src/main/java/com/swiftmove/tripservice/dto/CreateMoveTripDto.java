package com.swiftmove.tripservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateMoveTripDto {

    private  Long moveRequestId;
    private Long moveOfferId;
    private String status;
}
