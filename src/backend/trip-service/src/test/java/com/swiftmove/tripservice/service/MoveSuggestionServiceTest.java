package com.swiftmove.tripservice.service;

import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.client.LocationServiceClient;
import com.swiftmove.tripservice.dto.AddressDTO;
import com.swiftmove.tripservice.dto.BudgetSuggestionRequest;
import com.swiftmove.tripservice.dto.BudgetSuggestionResponse;
import com.swiftmove.tripservice.dto.VehicleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MoveSuggestionServiceTest {

    @Mock
    private LocationServiceClient locationServiceClient;

    @Mock
    private DriverServiceClient driverServiceClient;

    @InjectMocks
    private MoveSuggestionService moveSuggestionService;

    private AddressDTO fromAddress;
    private AddressDTO toAddress;

    @BeforeEach
    void setUp() {
        fromAddress = new AddressDTO();
        fromAddress.setId(1L);
        fromAddress.setLatitude(10.0);
        fromAddress.setLongitude(10.0);

        toAddress = new AddressDTO();
        toAddress.setId(2L);
        toAddress.setLatitude(10.1);
        toAddress.setLongitude(10.1);
    }

    @Test
    void updateAveragePrices_CalculatesCorrectly() {
        VehicleDto v1 = new VehicleDto();
        v1.setIsActive(true);
        v1.setCanCarryFurniture(false);
        v1.setPricePerKm(10L);

        VehicleDto v2 = new VehicleDto();
        v2.setIsActive(true);
        v2.setCanCarryFurniture(true);
        v2.setPricePerKm(20L);

        VehicleDto v3 = new VehicleDto();
        v3.setIsActive(false); // Should be ignored
        v3.setCanCarryFurniture(true);
        v3.setPricePerKm(100L);

        when(driverServiceClient.getVehiclesByDriverId(null)).thenReturn(Arrays.asList(v1, v2, v3));

        moveSuggestionService.updateAveragePrices();

        BudgetSuggestionRequest requestNoFurniture = new BudgetSuggestionRequest();
        requestNoFurniture.setFromAddressId(1L);
        requestNoFurniture.setToAddressId(2L);
        requestNoFurniture.setHasFurniture(false);

        when(locationServiceClient.getAddressById(1L)).thenReturn(fromAddress);
        when(locationServiceClient.getAddressById(2L)).thenReturn(toAddress);

        BudgetSuggestionResponse response = moveSuggestionService.suggestBudget(requestNoFurniture);
        
        // v1 (10) + v2 (20) / 2 = 15.0
        assertEquals(15.0, response.getAveragePricePerKm(), 0.01);
    }

    @Test
    void updateAveragePrices_FurnitureOnly_CalculatesCorrectly() {
        VehicleDto v1 = new VehicleDto();
        v1.setIsActive(true);
        v1.setCanCarryFurniture(false);
        v1.setPricePerKm(10L);

        VehicleDto v2 = new VehicleDto();
        v2.setIsActive(true);
        v2.setCanCarryFurniture(true);
        v2.setPricePerKm(20L);

        when(driverServiceClient.getVehiclesByDriverId(null)).thenReturn(Arrays.asList(v1, v2));

        moveSuggestionService.updateAveragePrices();

        BudgetSuggestionRequest requestWithFurniture = new BudgetSuggestionRequest();
        requestWithFurniture.setFromAddressId(1L);
        requestWithFurniture.setToAddressId(2L);
        requestWithFurniture.setHasFurniture(true);

        when(locationServiceClient.getAddressById(1L)).thenReturn(fromAddress);
        when(locationServiceClient.getAddressById(2L)).thenReturn(toAddress);

        BudgetSuggestionResponse response = moveSuggestionService.suggestBudget(requestWithFurniture);
        
        // Only v2 can carry furniture
        assertEquals(20.0, response.getAveragePricePerKm(), 0.01);
    }

    @Test
    void suggestBudget_NoActiveVehicles_ReturnsFallbackPrice() {
        when(driverServiceClient.getVehiclesByDriverId(null)).thenReturn(Collections.emptyList());
        moveSuggestionService.updateAveragePrices();

        BudgetSuggestionRequest request = new BudgetSuggestionRequest();
        request.setFromAddressId(1L);
        request.setToAddressId(2L);
        request.setHasFurniture(false);

        when(locationServiceClient.getAddressById(1L)).thenReturn(fromAddress);
        when(locationServiceClient.getAddressById(2L)).thenReturn(toAddress);

        BudgetSuggestionResponse response = moveSuggestionService.suggestBudget(request);

        // Fallback is 10.0
        assertEquals(10.0, response.getAveragePricePerKm(), 0.01);
        assertTrue(response.getDistance() > 0);
        assertEquals(response.getDistance() * 10.0, response.getSuggestedMaxBudget(), 0.01);
    }

    @Test
    void suggestBudget_AddressNotFound_ThrowsException() {
        BudgetSuggestionRequest request = new BudgetSuggestionRequest();
        request.setFromAddressId(1L);
        request.setToAddressId(2L);

        when(locationServiceClient.getAddressById(1L)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> moveSuggestionService.suggestBudget(request));
    }

    @Test
    void suggestBudget_AddressCoordinatesNull_ThrowsException() {
        fromAddress.setLatitude(null);
        
        BudgetSuggestionRequest request = new BudgetSuggestionRequest();
        request.setFromAddressId(1L);
        request.setToAddressId(2L);

        when(locationServiceClient.getAddressById(1L)).thenReturn(fromAddress);
        when(locationServiceClient.getAddressById(2L)).thenReturn(toAddress);

        assertThrows(IllegalArgumentException.class, () -> moveSuggestionService.suggestBudget(request));
    }
}
