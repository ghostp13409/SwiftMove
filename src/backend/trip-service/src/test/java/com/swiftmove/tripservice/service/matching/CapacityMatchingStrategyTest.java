package com.swiftmove.tripservice.service.matching;

import com.swiftmove.tripservice.client.ClientServiceClient;
import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CapacityMatchingStrategyTest {

    @Mock
    private ClientServiceClient clientServiceClient;

    @Mock
    private DriverServiceClient driverServiceClient;

    @InjectMocks
    private CapacityMatchingStrategy capacityMatchingStrategy;

    private MoveRequestDto moveRequest;
    private DriverInfoDto driverInfo;
    private VehicleDto vehicle;
    private VehicleTypeDto vehicleType;

    @BeforeEach
    void setUp() {
        moveRequest = new MoveRequestDto();
        moveRequest.setId(1L);

        driverInfo = new DriverInfoDto();
        vehicle = new VehicleDto();
        vehicle.setId(1L);

        vehicleType = new VehicleTypeDto();
        vehicleType.setId(1L);
        vehicleType.setMaxCapacity(100.0);
        vehicleType.setMaxWeight(500.0);
    }

    @Test
    void matches_VehicleTypeNull_ReturnsFalse() {
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(null);
        assertFalse(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_NoLuggageEntries_ReturnsTrue() {
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(Collections.emptyList());

        assertTrue(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_WithinCapacityAndWeight_ReturnsTrue() {
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);

        LuggageEntryDto entry = new LuggageEntryDto();
        entry.setLuggageTypeId(1L);
        entry.setQuantity(2);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(List.of(entry));

        LuggageTypeDto type = new LuggageTypeDto();
        type.setVolume(20.0); // 20 * 2 = 40 <= 100
        type.setWeight(100.0); // 100 * 2 = 200 <= 500
        when(clientServiceClient.getLuggageTypeById(1L)).thenReturn(type);

        assertTrue(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_ExceedsVolume_ReturnsFalse() {
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);

        LuggageEntryDto entry = new LuggageEntryDto();
        entry.setLuggageTypeId(1L);
        entry.setQuantity(3);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(List.of(entry));

        LuggageTypeDto type = new LuggageTypeDto();
        type.setVolume(40.0); // 40 * 3 = 120 > 100
        type.setWeight(100.0);
        when(clientServiceClient.getLuggageTypeById(1L)).thenReturn(type);

        assertFalse(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_ExceedsWeight_ReturnsFalse() {
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);

        LuggageEntryDto entry = new LuggageEntryDto();
        entry.setLuggageTypeId(1L);
        entry.setQuantity(2);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(List.of(entry));

        LuggageTypeDto type = new LuggageTypeDto();
        type.setVolume(20.0);
        type.setWeight(300.0); // 300 * 2 = 600 > 500
        when(clientServiceClient.getLuggageTypeById(1L)).thenReturn(type);

        assertFalse(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_ZeroVolumeVehicle_HasLuggage_ReturnsFalse() {
        vehicleType.setMaxCapacity(0.0);
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);

        LuggageEntryDto entry = new LuggageEntryDto();
        entry.setLuggageTypeId(1L);
        entry.setQuantity(1);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(List.of(entry));

        LuggageTypeDto type = new LuggageTypeDto();
        type.setVolume(10.0);
        type.setWeight(10.0);
        when(clientServiceClient.getLuggageTypeById(1L)).thenReturn(type);

        assertFalse(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }

    @Test
    void matches_ZeroVolumeVehicle_ZeroVolumeLuggage_ReturnsTrue() {
        vehicleType.setMaxCapacity(0.0);
        when(driverServiceClient.getVehicleTypeByVehicleId(vehicle.getId())).thenReturn(vehicleType);

        LuggageEntryDto entry = new LuggageEntryDto();
        entry.setLuggageTypeId(1L);
        entry.setQuantity(1);
        when(clientServiceClient.getLuggageForMoveRequest(moveRequest.getId())).thenReturn(List.of(entry));

        LuggageTypeDto type = new LuggageTypeDto();
        type.setVolume(0.0);
        type.setWeight(0.0);
        when(clientServiceClient.getLuggageTypeById(1L)).thenReturn(type);

        assertTrue(capacityMatchingStrategy.matches(moveRequest, driverInfo, vehicle));
    }
}
