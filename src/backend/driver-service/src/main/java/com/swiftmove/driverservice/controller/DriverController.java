package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.dto.*;
import com.swiftmove.driverservice.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/drivers")
public class DriverController {
    private final DriverService driverService;
    private final DriverInfoService driverInfoService;
    private final MoveOfferService moveOfferService;
    private final VehicleService vehicleService;
    private final VehicleTypeService vehicleTypeService;

    @GetMapping("/test")
    public String test() {
        return "Driver Service is up and running and Annlin is Gay!";
    }

//    Driver

//    Get All Drivers
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllDrivers() {
        List<UserResponseDto> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

//    Get by Id
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getDriverById(@PathVariable  Long id) {
        UserResponseDto driver = driverService.getDriverById(id);
        if (driver == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(driver);
    }

//    Get Current Driver
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentDriver(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserResponseDto driver = driverService.getCurrentDriver(authHeader);
        if (driver == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(driver);
    }

//    Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }

//    Driver Info Endpionts

//    Get All
    @GetMapping("/info")
    public ResponseEntity<List<DriverInfoDto>> getAllDriverInfo() {
        try{
            List<DriverInfoDto> driverInfos = driverInfoService.getAll();
            return ResponseEntity.ok(driverInfos);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//     Get All for Current Driver
    @GetMapping("/info/me")
    public ResponseEntity<DriverInfoDto> getCurrentDriverInfo(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try{
            DriverInfoDto driverInfo = driverInfoService.getCurrent(authHeader);
            if (driverInfo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(driverInfo);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get by Id
    @GetMapping("/info/{id}")
    public ResponseEntity<DriverInfoDto> getDriverInfoById(@PathVariable Long id) {
        try{
            DriverInfoDto driverInfo = driverInfoService.getById(id);
            if (driverInfo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(driverInfo);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get by Driver Id    driverId = userId
    @GetMapping("/info/by-driver")
    public ResponseEntity<DriverInfoDto> getDriverInfoByDriverId(@RequestParam Long driverId) {
        try{
            DriverInfoDto driverInfo = driverInfoService.getByDriverId(driverId);
            if (driverInfo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(driverInfo);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Add
    @PostMapping("/info")
    public ResponseEntity<DriverInfoDto> addDriverInfo(@RequestBody CreateDriverInfoDto driverInfoDto) {
        try {
            DriverInfoDto newDriverInfo = driverInfoService.add(driverInfoDto);
            return ResponseEntity.ok(newDriverInfo);
        }
        catch (Exception ex){

            return ResponseEntity.status(500).body(null);
        }
    }

//    Edit
    @PutMapping("/info/{id}")
    public ResponseEntity<DriverInfoDto> updateDriverInfo(@PathVariable Long id, @RequestBody DriverInfoDto driverInfoDto) {
        try {
            DriverInfoDto updatedDriverInfo = driverInfoService.update(id, driverInfoDto);
            return ResponseEntity.ok(updatedDriverInfo);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    NOTE: Delete handled by Driver Service when Driver gets deleted

//    Move Offers Endpoints

//    Get All, by Move Request Id or by Driver Id
    @GetMapping("/move-offers")
    public ResponseEntity<List<MoveOfferDto>> getAllMoveOffers(@RequestParam(required = false) Long moveRequestId, @RequestParam(required = false) Long driverId) {
        try{
            List<MoveOfferDto> moveOffers;
            if (moveRequestId != null) {
                moveOffers = moveOfferService.getByMoveRequestId(moveRequestId);
            } else if (driverId != null) {
                moveOffers = moveOfferService.getByDriverId(driverId);
            } else {
                moveOffers = moveOfferService.getAll();
            }
            return ResponseEntity.ok(moveOffers);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get for Current Driver
    @GetMapping("/move-offers/me")
    public ResponseEntity<List<MoveOfferDto>> getMoveOffersForCurrentDriver(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try{
            List<MoveOfferDto> moveOffers = moveOfferService.getByCurrentDriver(authHeader);
            return ResponseEntity.ok(moveOffers);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

// Get by Id
    @GetMapping("/move-offers/{id}")
    public ResponseEntity<MoveOfferDto> getMoveOfferById(@PathVariable Long id) {
        try{
            MoveOfferDto moveOffer = moveOfferService.getById(id);
            if (moveOffer == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(moveOffer);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Create
    @PostMapping("/move-offers")
    public ResponseEntity<MoveOfferDto> createMoveOffer(@RequestBody CreateMoveOfferDto createMoveOfferDto) {
        try{
            MoveOfferDto newMoveOffer = moveOfferService.add(createMoveOfferDto);
            return ResponseEntity.ok(newMoveOffer);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Edit
    @PutMapping("/move-offers/{id}")
    public ResponseEntity<MoveOfferDto> editMoveOffer(@PathVariable Long id, @RequestBody MoveOfferDto moveOfferDto) {
        try {
            MoveOfferDto updatedMoveOffer = moveOfferService.edit(id, moveOfferDto);
            return ResponseEntity.ok(updatedMoveOffer);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Delete
    @DeleteMapping("/move-offers/{id}")
    public ResponseEntity<Void> deleteMoveOffer(@PathVariable Long id) {
        try {
            moveOfferService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/move-offers/{id}/accept")
    public ResponseEntity<MoveOfferDto> acceptMoveOffer(@PathVariable Long id) {
        try {
            MoveOfferDto acceptedOffer = moveOfferService.accept(id);
            return ResponseEntity.ok(acceptedOffer);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PatchMapping("/move-offers/{id}/reject")
    public ResponseEntity<MoveOfferDto> rejectMoveOffer(@PathVariable Long id) {
        try {
            MoveOfferDto rejectedOffer = moveOfferService.reject(id);
            return ResponseEntity.ok(rejectedOffer);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PatchMapping("/move-offers/{id}/cancel")
    public ResponseEntity<MoveOfferDto> cancelMoveOffer(@PathVariable Long id) {
        try {
            MoveOfferDto cancelledOffer = moveOfferService.cancel(id);
            return ResponseEntity.ok(cancelledOffer);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Vehicle Endpoints

//    Get All, by Driver Id. DriverId = driverInfoId
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDto>> getAllVehicles(@RequestParam(required = false) Long driverId) {
        try{
            List<VehicleDto> vehicles;
            if (driverId != null) {
                vehicles = vehicleService.getByDriverInfoId(driverId);
            }  else {
                vehicles = vehicleService.getAll();
            }
            return ResponseEntity.ok(vehicles);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get Vehicles for Current Driver
    @GetMapping("/vehicles/me")
    public ResponseEntity<List<VehicleDto>> getVehiclesForCurrentDriver(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try{
            List<VehicleDto> vehicles = vehicleService.getByCurrentDriver(authHeader);
            return ResponseEntity.ok(vehicles);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get by Id
    @GetMapping("/vehicles/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        try{
            VehicleDto vehicle = vehicleService.getById(id);
            if (vehicle == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(vehicle);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Add
    @PostMapping("/vehicles")
    public ResponseEntity<VehicleDto> addVehicle(@RequestBody CreateVehicleDto vehicleDto) {
        try{
            VehicleDto newVehicle = vehicleService.add(vehicleDto);
            return ResponseEntity.ok(newVehicle);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Edit
    @PutMapping("/vehicles/{id}")
    public ResponseEntity<VehicleDto> editVehicle(@PathVariable Long id, @RequestBody VehicleDto vehicleDto) {
        try{
            VehicleDto updatedVehicle = vehicleService.edit(id, vehicleDto);
            return ResponseEntity.ok(updatedVehicle);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Delete
    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        try{
            vehicleService.delete(id);
            return ResponseEntity.noContent().build();
        }
        catch (Exception ex){
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/vehicles/{id}/toggle-active")
    public ResponseEntity<VehicleDto> toggleVehicleActive(@PathVariable Long id) {
        try{
            VehicleDto updatedVehicle = vehicleService.toggleActive(id);
            return ResponseEntity.ok(updatedVehicle);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Vehicle Type Endpoints

//    Get All
    @GetMapping("/vehicle-types")
    public ResponseEntity<List<VehicleTypeDto>> getAllVehicleTypes() {
        try{
            List<VehicleTypeDto> vehicleTypes = vehicleTypeService.getAll();
            return ResponseEntity.ok(vehicleTypes);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get by Vehicle Id
    @GetMapping("/vehicle-types/by-vehicle")
    public ResponseEntity<VehicleTypeDto> getVehicleTypeByVehicleId(@RequestParam Long vehicleId) {
        try{
            VehicleTypeDto vehicleType = vehicleTypeService.getVehicleId(vehicleId);
            if (vehicleType == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(vehicleType);
        }
        catch (Exception ex){
            return ResponseEntity.status(500).body(null);
        }
    }
}