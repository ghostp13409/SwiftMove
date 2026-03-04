package com.swiftMove.locationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long id;
    private String line1;
    private String line2;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postalOrZipCode;
}
