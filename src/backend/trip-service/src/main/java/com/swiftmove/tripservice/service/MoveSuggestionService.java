package com.swiftmove.tripservice.service;

import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.client.LocationServiceClient;
import com.swiftmove.tripservice.dto.AddressDTO;
import com.swiftmove.tripservice.dto.BudgetSuggestionRequest;
import com.swiftmove.tripservice.dto.BudgetSuggestionResponse;
import com.swiftmove.tripservice.dto.VehicleDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveSuggestionService {

    private final LocationServiceClient locationServiceClient;
    private final DriverServiceClient driverServiceClient;

    private double avgPricePerKmGeneral = 10.0;
    private double avgPricePerKmFurniture = 15.0;

    @PostConstruct
    public void init() {
        // We don't call it here to avoid blocking startup if other services aren't ready
    }

    @Scheduled(fixedRate = 300000)
    public void updateAveragePrices() {
        try {
            List<VehicleDto> allVehicles = driverServiceClient.getVehiclesByDriverId(null); 
            if (allVehicles == null || allVehicles.isEmpty()) return;

            double totalRateGeneral = 0;
            int countGeneral = 0;
            double totalRateFurniture = 0;
            int countFurniture = 0;

            for (VehicleDto vehicle : allVehicles) {
                if (Boolean.TRUE.equals(vehicle.getIsActive())) {
                    totalRateGeneral += vehicle.getPricePerKm();
                    countGeneral++;
                    
                    if (Boolean.TRUE.equals(vehicle.getCanCarryFurniture())) {
                        totalRateFurniture += vehicle.getPricePerKm();
                        countFurniture++;
                    }
                }
            }

            if (countGeneral > 0) {
                avgPricePerKmGeneral = totalRateGeneral / countGeneral;
            }
            if (countFurniture > 0) {
                avgPricePerKmFurniture = totalRateFurniture / countFurniture;
            }
            System.out.println("Updated avg prices: General=" + avgPricePerKmGeneral + ", Furniture=" + avgPricePerKmFurniture);
        } catch (Exception e) {
            System.err.println("Failed to update average prices: " + e.getMessage());
        }
    }

    public BudgetSuggestionResponse suggestBudget(BudgetSuggestionRequest request) {
        if (request == null || request.getFromAddressId() == null || request.getToAddressId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields: fromAddressId or toAddressId.");
        }

        System.out.println("Suggesting budget for request: " + request);
        
        AddressDTO from = locationServiceClient.getAddressById(request.getFromAddressId());
        AddressDTO to = locationServiceClient.getAddressById(request.getToAddressId());

        if (from == null || to == null) {
            System.err.println("Address not found: from=" + from + ", to=" + to);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or both addresses not found.");
        }

        System.out.println("Fetched From Address: id=" + from.getId() + ", lat=" + from.getLatitude() + ", lon=" + from.getLongitude());
        System.out.println("Fetched To Address: id=" + to.getId() + ", lat=" + to.getLatitude() + ", lon=" + to.getLongitude());

        if (from.getLatitude() == null || from.getLongitude() == null || to.getLatitude() == null || to.getLongitude() == null) {
            System.err.println("Coordinates missing in fetched addresses.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coordinates missing for addresses. Geocoding may have failed or coordinates were not returned.");
        }

        double distance = DistanceUtils.calculateDistance(
                from.getLatitude(), from.getLongitude(),
                to.getLatitude(), to.getLongitude()
        );

        if (distance <= 0) {
            distance = 1.0; 
        }

        double avgPricePerKm = Boolean.TRUE.equals(request.getHasFurniture()) ? avgPricePerKmFurniture : avgPricePerKmGeneral;
        double suggestedBudget = distance * avgPricePerKm;

        System.out.println("Distance: " + distance + ", AvgPrice: " + avgPricePerKm + ", Suggested: " + suggestedBudget);

        return new BudgetSuggestionResponse(distance, suggestedBudget, avgPricePerKm);
    }
}
