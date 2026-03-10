package com.swiftmove.tripservice.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleDto {
    private Long id;
    private String model;
    private String make;
    private Integer year;
    private String color;
    private Long pricePerKm;
    private Boolean isActive;
    private Boolean canCarryFurniture;
    private Long driverId;
    private Long vehicleTypeId;
}
