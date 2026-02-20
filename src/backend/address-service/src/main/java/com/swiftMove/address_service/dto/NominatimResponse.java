package com.swiftMove.address_service.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class NominatimResponse {

    private Address address;

    @Getter
    @Setter
    public static class Address {
        private String house_number;
        private String road;
        private String city;
        private String town;
        private String village;
        private String state;
        private String postcode;
        private String country;
    }
}
