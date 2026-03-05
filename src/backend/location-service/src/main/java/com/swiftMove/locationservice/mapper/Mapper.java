package com.swiftMove.locationservice.mapper;


import com.swiftMove.locationservice.dto.AddressDTO;
import com.swiftMove.locationservice.dto.CreateAddressDto;
import com.swiftMove.locationservice.model.Address;

public class Mapper {
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

    public static Address createAddressDto(CreateAddressDto createAddressDto) {
        Address address = new Address();
        address.setLine1(createAddressDto.getLine1());
        address.setLine2(createAddressDto.getLine2());
        address.setCity(createAddressDto.getCity());
        address.setStateOrProvince(createAddressDto.getStateOrProvince());
        address.setPostalOrZipCode(createAddressDto.getPostalOrZipCode());
        address.setCountry(createAddressDto.getCountry());
        return address;
    }
}
