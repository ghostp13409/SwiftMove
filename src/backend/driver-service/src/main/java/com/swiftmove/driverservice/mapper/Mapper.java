package com.swiftmove.driverservice.mapper;

import com.swiftmove.driverservice.dto.*;
import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.model.Vehicle;
import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.model.VehicleType;

public class Mapper {
    public static DriverInfoDto toDriverInfoDto(DriverInfo driverInfo) {
        DriverInfoDto driverInfoDto = new DriverInfoDto();
        driverInfoDto.setId(driverInfo.getId());
        driverInfoDto.setUserId(driverInfo.getUserId());
        driverInfoDto.setDrivingLicense(driverInfo.getDrivingLicense());
        driverInfoDto.setDrivingExperience(driverInfo.getDrivingExperience());
        driverInfoDto.setRange(driverInfo.getRange());
        return driverInfoDto;
    }

    public static DriverInfo toDriverInfoEntity(DriverInfoDto driverInfoDto) {
        DriverInfo driverInfo = new DriverInfo();
        driverInfo.setId(driverInfoDto.getId());
        driverInfo.setUserId(driverInfoDto.getUserId());
        driverInfo.setDrivingLicense(driverInfoDto.getDrivingLicense());
        driverInfo.setDrivingExperience(driverInfoDto.getDrivingExperience());
        driverInfo.setRange(driverInfoDto.getRange());
        return driverInfo;
    }

    // Vehicle mappings
    public static VehicleDto toVehicleDto(Vehicle vehicle) {
        if (vehicle == null) return null;
        VehicleDto dto = new VehicleDto();
        dto.setId(vehicle.getId());
        dto.setModel(vehicle.getModel());
        dto.setMake(vehicle.getMake());
        dto.setYear(vehicle.getYear());
        dto.setColor(vehicle.getColor());
        dto.setPricePerKm(vehicle.getPricePerKm());
        dto.setIsActive(vehicle.getIsActive());
        dto.setCanCarryFurniture(vehicle.getCanCarryFurniture());
        dto.setDriverId(vehicle.getDriverId());
        dto.setVehicleTypeId(vehicle.getVehicleTypeId());
        return dto;
    }

    public static Vehicle toVehicleEntity(VehicleDto vehicleDto) {
        if (vehicleDto == null) return null;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(vehicleDto.getId());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setMake(vehicleDto.getMake());
        vehicle.setYear(vehicleDto.getYear());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setPricePerKm(vehicleDto.getPricePerKm());
        vehicle.setIsActive(vehicleDto.getIsActive());
        vehicle.setCanCarryFurniture(vehicleDto.getCanCarryFurniture());
        vehicle.setDriverId(vehicleDto.getDriverId());
        vehicle.setVehicleTypeId(vehicleDto.getVehicleTypeId());
        return vehicle;
    }

    // MoveOffer mappings
    public static MoveOfferDto toMoveOfferDto(MoveOffer offer) {
        if (offer == null) return null;
        MoveOfferDto dto = new MoveOfferDto();
        dto.setId(offer.getId());
        dto.setPrice(offer.getPrice());
        dto.setOfferDate(offer.getOfferedDate());
        dto.setMoveRequestId(offer.getMoveRequestId());
        dto.setDriverId(offer.getDriverId());
        dto.setVehicleId(offer.getVehicleId());
        dto.setStatus(offer.getStatus());
        return dto;
    }

    public static MoveOffer toMoveOfferEntity(MoveOfferDto offerDto) {
        if (offerDto == null) return null;
        MoveOffer offer = new MoveOffer();
        offer.setId(offerDto.getId());
        offer.setPrice(offerDto.getPrice());
        offer.setOfferedDate(offerDto.getOfferDate());
        offer.setMoveRequestId(offerDto.getMoveRequestId());
        offer.setDriverId(offerDto.getDriverId());
        offer.setVehicleId(offerDto.getVehicleId());
        offer.setStatus(offerDto.getStatus());
        return offer;
    }

    public static VehicleTypeDto toVehicleTypeDto(VehicleType vehicleType) {
        if (vehicleType == null) return null;
        VehicleTypeDto dto = new VehicleTypeDto();
        dto.setId(vehicleType.getId());
        dto.setType(vehicleType.getType());
        dto.setMaxWeight(vehicleType.getMaxWeight());
        dto.setMaxCapacity(vehicleType.getCapacity());
        return dto;
    }

    public static DriverInfo toDriverInfoEntityFromCreateDto(CreateDriverInfoDto createDriverInfoDto) {
        DriverInfo driverInfo = new DriverInfo();
        driverInfo.setUserId(createDriverInfoDto.getUserId());
        driverInfo.setDrivingLicense(createDriverInfoDto.getDrivingLicense());
        driverInfo.setDrivingExperience(createDriverInfoDto.getDrivingExperience());
        driverInfo.setRange(createDriverInfoDto.getRange());
        return driverInfo;
    }

    public static MoveOffer createMoveOfferEntity(CreateMoveOfferDto createMoveOfferDto) {
        MoveOffer offer = new MoveOffer();

        offer.setPrice(createMoveOfferDto.getPrice());
        offer.setOfferedDate(createMoveOfferDto.getOfferDate());
        offer.setMoveRequestId(createMoveOfferDto.getMoveRequestId());
        offer.setDriverId(createMoveOfferDto.getDriverId());
        offer.setVehicleId(createMoveOfferDto.getVehicleId());
        offer.setStatus(createMoveOfferDto.getStatus());

        return offer;
    }
    public  static Vehicle createVehicleEntity(CreateVehicleDto createVehicleDto) {
        Vehicle vehicle = new Vehicle();

        vehicle.setModel(createVehicleDto.getModel());
        vehicle.setMake(createVehicleDto.getMake());
        vehicle.setYear(createVehicleDto.getYear());
        vehicle.setColor(createVehicleDto.getColor());
        vehicle.setPricePerKm(createVehicleDto.getPricePerKm());
        vehicle.setIsActive(createVehicleDto.getIsActive());
        vehicle.setCanCarryFurniture(createVehicleDto.getCanCarryFurniture());
        vehicle.setDriverId(createVehicleDto.getDriverId());
        vehicle.setVehicleTypeId(createVehicleDto.getVehicleTypeId());

        return vehicle;
    }
}
