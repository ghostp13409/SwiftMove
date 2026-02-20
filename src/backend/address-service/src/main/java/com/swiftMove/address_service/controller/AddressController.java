package com.swiftMove.address_service.controller;

import com.swiftMove.address_service.dto.AddressDTO;
import com.swiftMove.address_service.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AddressController {
    @Autowired
    private final AddressService addressService;

    @GetMapping("/test")
    public ResponseEntity<AddressDTO> getAddress(){
        return addressService.execute(11L);
    }
}
