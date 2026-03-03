package com.swiftmove.locationservice.controller;


import java.util.List;

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

import com.swiftmove.locationservice.dto.AddressDTO;
import com.swiftmove.locationservice.service.AddressService;

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
    public ResponseEntity<Void> addNewAddress(@RequestBody AddressDTO addressDTO){
        addressService.addNewAddress(addressDTO);
        return ResponseEntity.ok().build();
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
