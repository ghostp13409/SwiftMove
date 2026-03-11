package com.swiftmove.tripservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoveTripDto {
    private Long id;
    private Long moveRequestId;
    private Long moveOfferId;
    private String status;

    // TODO: Needs to be removed. the frontend should make additional calls to get
    // details.
    private MoveRequestDto moveRequest;
    private MoveOfferDto moveOffer;
    private UserResponseDto client;
    private UserResponseDto driver;
    private VehicleDto vehicle;
}
