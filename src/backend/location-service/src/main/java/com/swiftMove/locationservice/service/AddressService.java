package com.swiftMove.locationservice.service;


import com.swiftMove.locationservice.dto.CreateAddressDto;
import com.swiftMove.locationservice.mapper.Mapper;
import com.swiftMove.locationservice.dto.AddressDTO;
import com.swiftMove.locationservice.model.Address;
import com.swiftMove.locationservice.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final GeocodingService geocodingService;

    // Adding a new Address
    public AddressDTO addNewAddress(CreateAddressDto createAddressDto) {

        Address address = Mapper.createAddressDto(createAddressDto);
        geocodingService.setCoordinates(address);

        Address savedAddress = addressRepository.save(address);
        return Mapper.toDTO(savedAddress);

    }

    //Update the existing address
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address existingAddress = addressRepository.findById(addressId).orElse(null);
        if (existingAddress == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");

        existingAddress.setLine1(addressDTO.getLine1());
        existingAddress.setLine2(addressDTO.getLine2());
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setStateOrProvince(addressDTO.getStateOrProvince());
        existingAddress.setPostalOrZipCode(addressDTO.getPostalOrZipCode());
        existingAddress.setCountry(addressDTO.getCountry());
        
        // Update coordinates if they are provided in DTO or if address details changed
        if (addressDTO.getLatitude() != null && addressDTO.getLongitude() != null) {
            existingAddress.setLatitude(addressDTO.getLatitude());
            existingAddress.setLongitude(addressDTO.getLongitude());
        } else {
            geocodingService.setCoordinates(existingAddress);
        }

        Address updatedAddress = addressRepository.save(existingAddress);
        return Mapper.toDTO(updatedAddress);

    }

    // getting all addresses
    public List<AddressDTO> getAllAddresses() {
        return addressRepository
                .findAll()
                .stream()
                .map(Mapper::toDTO)
                .toList();

    }

    //getByID
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        return Mapper.toDTO(address);
    }

    //Delete By ID
    public void deleteAddressById(Long id) {
        if (!addressRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        addressRepository.deleteById(id);
    }

}
