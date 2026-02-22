package com.swiftmove.locationservice;


import com.swiftmove.locationservice.controller.AddressController;
import com.swiftmove.locationservice.dto.AddressDTO;
import com.swiftmove.locationservice.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressControllerTest {

    @Mock
    private AddressService addressService;

    @InjectMocks
    private AddressController addressController;

    private AddressDTO addressDTO;

    @BeforeEach
    void setUp() {
        addressDTO = new AddressDTO();
        addressDTO.setLine1("123 Street");
        addressDTO.setCity("Waterloo");
    }

    // ==============================
    // getAllAddress
    // ==============================

    @Test
    void getAllAddress_success() {
        when(addressService.getAllAddresses())
                .thenReturn(List.of(addressDTO));

        ResponseEntity<List<AddressDTO>> response =
                addressController.getAllAddress();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    // ==============================
    // getAddress
    // ==============================

    @Test
    void getAddress_success() {
        when(addressService.getAddressById(1L))
                .thenReturn(addressDTO);

        ResponseEntity<AddressDTO> response =
                addressController.getAddress(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    // ==============================
    // addNewAddress
    // ==============================

    @Test
    void addNewAddress_success() {
        when(addressService.addNewAddress(addressDTO))
                .thenReturn(addressDTO);

        ResponseEntity<Void> response =
                addressController.addNewAddress(addressDTO);

        assertEquals(200, response.getStatusCode().value());
        verify(addressService).addNewAddress(addressDTO);
    }

    // ==============================
    // updateAddress
    // ==============================

    @Test
    void updateAddress_success() {
        when(addressService.updateAddress(1L, addressDTO))
                .thenReturn(addressDTO);

        ResponseEntity<AddressDTO> response =
                addressController.updateAddress(1L, addressDTO);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    // ==============================
    // deleteAddress
    // ==============================

    @Test
    void deleteAddress_success() {
        ResponseEntity<Void> response =
                addressController.deleteAddress(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(addressService).deleteAddressById(1L);
    }
}