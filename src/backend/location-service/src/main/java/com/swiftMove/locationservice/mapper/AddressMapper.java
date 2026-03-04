package com.swiftMove.locationservice.mapper;


import com.swiftMove.locationservice.dto.AddressDTO;
import com.swiftMove.locationservice.model.Address;

public class AddressMapper {
    //Address -> addressDTO
    public static AddressDTO toDTO(Address address) {
        return new AddressDTO(
                address.getId(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getStateOrProvince(),
                address.getCountry(),
                address.getPostalOrZipCode()

        );
    }
    // AddressDTO-> Address Entity
    public static Address toAddress(AddressDTO addressDTO) {
        Address address = new Address();
        address.setLine1(addressDTO.getLine1());
        address.setLine2(addressDTO.getLine2());
        address.setCity(addressDTO.getCity());
        address.setStateOrProvince(addressDTO.getStateOrProvince());
        address.setPostalOrZipCode(addressDTO.getPostalOrZipCode());
        address.setCountry(addressDTO.getCountry());
        return address;
    }
}
