package com.swiftMove.locationservice.controller;


import java.util.List;

import com.swiftMove.locationservice.dto.CreateAddressDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swiftMove.locationservice.dto.AddressDTO;
import com.swiftMove.locationservice.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {
    @Autowired
    private final AddressService addressService;

    //get all address
    @GetMapping
    public ResponseEntity<List<AddressDTO>> getAllAddress(){
        return ResponseEntity.ok(addressService.getAllAddresses());
    }

    //get by id
    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long id){
        AddressDTO addressDTO = addressService.getAddressById(id);
        if(addressDTO == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(addressDTO);
    }

    //Add new Address
    @PostMapping
    public ResponseEntity<AddressDTO> addNewAddress(@RequestBody CreateAddressDto createAddressDTO){
        AddressDTO addressDto = addressService.addNewAddress(createAddressDTO);
        return ResponseEntity.ok(addressDto);
    }

    //Update an existing address
    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id, @RequestBody AddressDTO addressDTO){
       return ResponseEntity.ok(addressService.updateAddress(id, addressDTO));
    }

    //Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id){
        addressService.deleteAddressById(id);
        return ResponseEntity.noContent().build();
    }
}
