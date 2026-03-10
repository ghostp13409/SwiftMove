package com.swiftmove.tripservice.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DriverInfoDto {
    private Long id;
    private Long userId;
    private String drivingLicense;
    private Integer drivingExperience;
    private Double range;
    private Double currentLatitude;
    private Double currentLongitude;
}
