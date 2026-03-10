package com.swiftmove.tripservice.client;

import com.swiftmove.tripservice.dto.DriverInfoDto;
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
}
