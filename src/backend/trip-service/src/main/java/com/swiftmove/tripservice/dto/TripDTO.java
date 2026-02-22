package com.swiftmove.tripservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripDTO {
    private Long id;
    private Long moveRequestId;
    private Long moveOfferId;
    private String status;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
