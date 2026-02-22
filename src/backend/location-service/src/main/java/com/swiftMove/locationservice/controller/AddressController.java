package com.swiftmove.locationservice.controller;


import com.swiftmove.locationservice.dto.AddressDTO;
import com.swiftmove.locationservice.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address/")
@RequiredArgsConstructor
public class AddressController {
    @Autowired
    private final AddressService addressService;

    //get all address
    @GetMapping("/all")
        public ResponseEntity<List<AddressDTO>> getAllAddress(){
        return ResponseEntity.ok(addressService.getAllAddresses());
    }

    //get by id
    @GetMapping("{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long id){
        AddressDTO addressDTO = addressService.getAddressById(id);
        if(addressDTO == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(addressDTO);
    }

    //Add new Address
    @PostMapping("/addNewAddress")
    public ResponseEntity<Void> addNewAddress(@RequestBody AddressDTO addressDTO){
        addressService.addNewAddress(addressDTO);
        return ResponseEntity.ok().build();
    }

    //Update an existing address
    @PutMapping("/update/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id, @RequestBody AddressDTO addressDTO){
       return ResponseEntity.ok(addressService.updateAddress(id, addressDTO));
    }

    //Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id){
        addressService.deleteAddressById(id);
        return ResponseEntity.noContent().build();
    }


}
