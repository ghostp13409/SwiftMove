package com.swiftmove.locationservice.service;


import com.swiftmove.locationservice.dto.AddressDTO;
import com.swiftmove.locationservice.mapper.AddressMapper;
import com.swiftmove.locationservice.model.Address;
import com.swiftmove.locationservice.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    // Adding a new Address
    public AddressDTO addNewAddress(AddressDTO addressDTO) {

        Address address = AddressMapper.toAddress(addressDTO);

        address.setCreatedAt(LocalDate.now());
        address.setUpdatedAt(LocalDate.now());

        Address savedAddress= addressRepository.save(address);
        return AddressMapper.toDTO(savedAddress);

    }
    //Update the existing address
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address existingAddress = addressRepository.findById(addressId).orElse(null);
        if (existingAddress==null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");

        existingAddress.setLine1(addressDTO.getLine1());
        existingAddress.setLine2(addressDTO.getLine2());
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setStateOrProvince(addressDTO.getStateOrProvince());
        existingAddress.setPostalOrZipCode(addressDTO.getPostalOrZipCode());
        existingAddress.setCountry(addressDTO.getCountry());
        existingAddress.setUpdatedAt(LocalDate.now());

        Address updatedAddress = addressRepository.save(existingAddress);
        return AddressMapper.toDTO(updatedAddress);

    }
    // getting all addresses
    public List<AddressDTO> getAllAddresses() {
        return addressRepository
                .findAll()
                .stream()
                .map(AddressMapper::toDTO)
                .toList();

    }

    //getByID
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        return AddressMapper.toDTO(address);
    }
    //Delete By ID
    public void deleteAddressById(Long id) {
        if (!addressRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        addressRepository.deleteById(id);
    }

}
