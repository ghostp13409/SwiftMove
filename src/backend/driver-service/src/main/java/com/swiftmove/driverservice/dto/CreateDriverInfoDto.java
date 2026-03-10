package com.swiftmove.driverservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateDriverInfoDto {

    private Long userId;
    private String drivingLicense;
    private Integer drivingExperience;
    private Double range;
    private Double currentLatitude;
    private Double currentLongitude;
}
