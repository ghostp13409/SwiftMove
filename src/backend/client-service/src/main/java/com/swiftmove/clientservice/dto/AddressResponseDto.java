package com.swiftmove.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddressResponseDto {
    private String line1;
    private String line2;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postalOrZipCode;
}
