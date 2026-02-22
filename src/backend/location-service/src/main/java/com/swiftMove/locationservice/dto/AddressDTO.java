package com.swiftmove.locationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private String line1;
    private String line2;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postalOrZipCode;
}
