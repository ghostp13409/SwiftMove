package com.swiftmove.tripservice.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddressDTO {
    private Long id;
    private String line1;
    private String line2;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postalOrZipCode;
    private Double latitude;
    private Double longitude;
}
