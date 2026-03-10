package com.swiftmove.tripservice.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleTypeDto {
    private Long id;
    private String type;
    private Double maxWeight;
    private Double maxCapacity;
}
