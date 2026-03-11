package com.swiftmove.driverservice.service;

import com.swiftmove.driverservice.client.AuthClient;
import com.swiftmove.driverservice.client.TripServiceClient;
import com.swiftmove.driverservice.client.UserClient;
import com.swiftmove.driverservice.dto.CreateDriverInfoDto;
import com.swiftmove.driverservice.dto.DriverInfoDto;
import com.swiftmove.driverservice.dto.MoveTripDto;
import com.swiftmove.driverservice.dto.UserResponseDto;
import com.swiftmove.driverservice.mapper.Mapper;
import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.repository.DriverInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverInfoService {
    private final DriverInfoRepository driverInfoRepository;
    private final AuthClient authClient;
    private final TripServiceClient tripServiceClient;
    private final UserClient userClient;

    public List<DriverInfoDto> getAll() {
        return driverInfoRepository.findAll().stream()
                .map(this::toDetailedDto)
                .toList();
    }

    public DriverInfoDto getCurrent(String authHeader) {
        try{
            Long driverId = authClient.getCurrentUser(authHeader).getBody().getId();
            DriverInfo driverInfo = driverInfoRepository.findByUserId(driverId);
            return toDetailedDto(driverInfo);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to retrieve current driver info: " + ex.getMessage(), ex);
        }
    }
    public DriverInfoDto getById(Long id) {
        try{
            DriverInfo driverInfo = driverInfoRepository.findById(id).orElse(null);
            return toDetailedDto(driverInfo);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to retrieve driver info: " + ex.getMessage(), ex);
        }
    }

    public DriverInfoDto getByDriverId(Long driverId) {
        try{
            DriverInfo driverInfo = driverInfoRepository.findByUserId(driverId);
            return toDetailedDto(driverInfo);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to retrieve driver info: " + ex.getMessage(), ex);
        }
    }

    private DriverInfoDto toDetailedDto(DriverInfo driverInfo) {
        if (driverInfo == null) return null;
        DriverInfoDto dto = Mapper.toDriverInfoDto(driverInfo);
        
        // Populate metrics
        try {
            List<MoveTripDto> trips = tripServiceClient.getTripsByDriverId(driverInfo.getUserId());
            if (trips != null) {
                long completedCount = trips.stream()
                        .filter(t -> "COMPLETED".equals(t.getStatus()))
                        .count();
                dto.setTotalTripsCompleted((int) completedCount);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch trips for metrics: " + e.getMessage());
            dto.setTotalTripsCompleted(0);
        }

        return dto;
    }

    public DriverInfoDto add(CreateDriverInfoDto driverInfoDto) {
        try{
            DriverInfo newDriverInfo = Mapper.toDriverInfoEntityFromCreateDto(driverInfoDto);
                newDriverInfo = driverInfoRepository.save(newDriverInfo);
            return Mapper.toDriverInfoDto(newDriverInfo);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to create driver info: " + ex.getMessage(), ex);
        }
    }

    public DriverInfoDto update(Long id, DriverInfoDto driverInfoDto) {
        try{
            DriverInfo existingInfo = driverInfoRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver info not found with id: " + id));

            if (validateUserInfo(driverInfoDto)) {
                existingInfo.setDrivingLicense(driverInfoDto.getDrivingLicense());
                existingInfo.setDrivingExperience(driverInfoDto.getDrivingExperience());
                existingInfo.setRange(driverInfoDto.getRange());
                DriverInfo updatedDriverInfo =  driverInfoRepository.save(existingInfo);
                return Mapper.toDriverInfoDto(updatedDriverInfo);
            } else {
                throw new RuntimeException("Invalid driver info data");
            }
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to update driver info: " + ex.getMessage(), ex);
        }
    }

    private boolean validateUserInfo(DriverInfoDto driverInfoDto) {

        // Validate driverInfo

        StringBuilder validationErrors = new StringBuilder();

        if (driverInfoDto.getDrivingLicense() == null || driverInfoDto.getDrivingLicense().trim().isEmpty()) {
            validationErrors.append("Driving license is required. ");
        }

        // TODO: Check License Regex for Canedian License
        // if (driverInfoDto.getDrivingLicense() != null) {
        //     // Add regex validation for Canadian license
        //     if (!driverInfoDto.getDrivingLicense().matches("^[A-Z]{2}[0-9]{6}$")) {
        //         validationErrors.append("Invalid Canadian driving license format. ");
        //     }
        // }

        if (driverInfoDto.getDrivingExperience() == null) {
            validationErrors.append("Driving experience is required. ");
        }

        if (driverInfoDto.getDrivingExperience() != null && driverInfoDto.getDrivingExperience() < 0) {
            validationErrors.append("Driving experience cannot be negative. ");
        }

        if (driverInfoDto.getRange() == null) {
            validationErrors.append("Range is required. ");
        }

        if (driverInfoDto.getRange() != null && driverInfoDto.getRange() < 0) {
            validationErrors.append("Range cannot be negative. ");
        }

        if (validationErrors.length() > 0) {
            throw new RuntimeException("Invalid driver info data: " + validationErrors.toString());
        }

        return true; // Placeholder for actual validation logic
    }
}
