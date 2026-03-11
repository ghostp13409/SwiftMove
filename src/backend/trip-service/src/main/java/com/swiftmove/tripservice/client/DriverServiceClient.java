package com.swiftmove.tripservice.client;

import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveOfferDto;
import com.swiftmove.tripservice.dto.VehicleDto;
import com.swiftmove.tripservice.dto.VehicleTypeDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "driver-service")
public interface DriverServiceClient {
    @GetMapping("/drivers/info/by-driver")
    DriverInfoDto getDriverInfoByDriverId(@RequestParam("driverId") Long driverId);

    @GetMapping("/drivers/vehicles")
    List<VehicleDto> getVehiclesByDriverId(@RequestParam("driverId") Long driverId);

    @GetMapping("/drivers/vehicle-types/by-vehicle")
    VehicleTypeDto getVehicleTypeByVehicleId(@RequestParam("vehicleId") Long vehicleId);

    @GetMapping("/drivers/move-offers")
    List<MoveOfferDto> getMoveOffersByDriverId(@RequestParam("driverId") Long driverId);

    @GetMapping("/drivers/move-offers/{id}")
    MoveOfferDto getMoveOfferById(@PathVariable("id") Long id);

    @GetMapping("/drivers/vehicles/{id}")
    VehicleDto getVehicleById(@PathVariable("id") Long id);

    @org.springframework.web.bind.annotation.DeleteMapping("/drivers/move-offers/{id}")
    void deleteMoveOffer(@PathVariable("id") Long id);
}
