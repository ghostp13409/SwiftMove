package com.swiftmove.driverservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swiftmove.driverservice.client.AuthClient;
import com.swiftmove.driverservice.client.ClientServiceClient;
import com.swiftmove.driverservice.client.TripServiceClient;
import com.swiftmove.driverservice.dto.CreateMoveOfferDto;
import com.swiftmove.driverservice.dto.CreateMoveTripDto;
import com.swiftmove.driverservice.dto.MoveOfferDto;
import com.swiftmove.driverservice.dto.MoveRequestDto;
import com.swiftmove.driverservice.dto.VehicleDto;
import com.swiftmove.driverservice.mapper.Mapper;
import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.model.MoveStatus;
import com.swiftmove.driverservice.repository.MoveOfferRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoveOfferService {

    private final MoveOfferRepository moveOfferRepository;
    private final AuthClient authClient;
    private final ClientServiceClient clientServiceClient;
    private final TripServiceClient tripServiceClient;
    private final VehicleService vehicleService;

//    Get All
    public List<MoveOfferDto> getAll(){
        return moveOfferRepository.findAll().stream()
                .map(Mapper::toMoveOfferDto)
                .toList();
    }

//    Get by Move Request ID
    public List<MoveOfferDto> getByMoveRequestId(Long moveRequestId){
        return moveOfferRepository.findMoveOfferByMoveRequestId(moveRequestId).stream()
                .map(Mapper::toMoveOfferDto)
                .toList();
    }

//    Get by Driver ID
    public List<MoveOfferDto> getByDriverId(Long driverId){
        return moveOfferRepository.findMoveOfferByDriverId(driverId).stream()
                .map(Mapper::toMoveOfferDto)
                .toList();
    }

//    Get by Current Driver

    public List<MoveOfferDto> getByCurrentDriver(String authHeader){
        Long driverId = authClient.getCurrentUser(authHeader).getBody().getId();
        return moveOfferRepository.findMoveOfferByDriverId(driverId).stream()
                .map(Mapper::toMoveOfferDto)
                .toList();
    }

//    Get by Id
    public MoveOfferDto getById(Long id){
        return moveOfferRepository.findById(id)
                .map(Mapper::toMoveOfferDto)
                .orElse(null);
    }

//    Add
    public MoveOfferDto add(CreateMoveOfferDto newMoveOfferDto){
        try{
            validateCreateMoveOffer(newMoveOfferDto);
            
            // Check if driver already has an offer for this request
            List<MoveOffer> existingOffers = moveOfferRepository.findMoveOfferByMoveRequestId(newMoveOfferDto.getMoveRequestId());
            boolean alreadyOffered = existingOffers.stream()
                    .anyMatch(o -> o.getDriverId().equals(newMoveOfferDto.getDriverId()) && 
                                  o.getStatus() != MoveStatus.CANCELLED && 
                                  o.getStatus() != MoveStatus.REJECTED);
            
            if (alreadyOffered) {
                throw new IllegalArgumentException("You have already submitted an offer for this move request.");
            }

            validateVehicleForMoveRequest(newMoveOfferDto.getVehicleId(), newMoveOfferDto.getMoveRequestId());

            
            // Recalculate price based on distance and vehicle rate to ensure integrity
            MoveRequestDto moveRequest = clientServiceClient.getMoveRequestById(newMoveOfferDto.getMoveRequestId());
            VehicleDto vehicle = vehicleService.getById(newMoveOfferDto.getVehicleId());
            
            if (moveRequest != null && vehicle != null && moveRequest.getDistance() != null && vehicle.getPricePerKm() != null) {
                double calculatedPrice = moveRequest.getDistance() * vehicle.getPricePerKm();
                newMoveOfferDto.setPrice((long) Math.ceil(calculatedPrice));
            }

            validatePriceForMoveOffer(newMoveOfferDto.getPrice(), newMoveOfferDto.getVehicleId(), newMoveOfferDto.getMoveRequestId());

            MoveOffer newMoveOffer = Mapper.createMoveOfferEntity(newMoveOfferDto);
            newMoveOffer = moveOfferRepository.save(newMoveOffer);

            // Update Move Request Status if needed
            try {
                if ("CREATED".equals(moveRequest.getStatus())) {
                    moveRequest.setStatus("OFFER_AVAILABLE");
                    clientServiceClient.updateMoveRequest(moveRequest.getId(), moveRequest);
                }
            } catch (Exception e) {
                // Log error but don't fail offer creation
                System.err.println("Failed to update move request status: " + e.getMessage());
            }

            return Mapper.toMoveOfferDto(newMoveOffer);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to create MoveOffer: " + ex.getMessage(), ex);
        }

    }

//    Edit
    public MoveOfferDto edit(Long id, MoveOfferDto moveOfferDto){
        try{
            validateMoveOffer(moveOfferDto);
            validateVehicleForMoveRequest(moveOfferDto.getVehicleId(), moveOfferDto.getMoveRequestId());

            // Recalculate price based on distance and vehicle rate
            MoveRequestDto moveRequest = clientServiceClient.getMoveRequestById(moveOfferDto.getMoveRequestId());
            VehicleDto vehicle = vehicleService.getById(moveOfferDto.getVehicleId());

            if (moveRequest != null && vehicle != null && moveRequest.getDistance() != null && vehicle.getPricePerKm() != null) {
                double calculatedPrice = moveRequest.getDistance() * vehicle.getPricePerKm();
                moveOfferDto.setPrice((long) Math.ceil(calculatedPrice));
            }

            validatePriceForMoveOffer(moveOfferDto.getPrice(), moveOfferDto.getVehicleId(), moveOfferDto.getMoveRequestId());

            MoveOffer existingMoveOffer = moveOfferRepository.findById(id).orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));
            existingMoveOffer.setOfferedDate(moveOfferDto.getOfferDate());
            existingMoveOffer.setPrice(moveOfferDto.getPrice());
            existingMoveOffer.setStatus(MoveStatus.valueOf(moveOfferDto.getStatus()));
            existingMoveOffer.setMoveRequestId(moveOfferDto.getMoveRequestId());
            existingMoveOffer.setDriverId(moveOfferDto.getDriverId());
            existingMoveOffer.setVehicleId(moveOfferDto.getVehicleId());

            MoveOffer updatedMoveOffer = moveOfferRepository.save(existingMoveOffer);
            return Mapper.toMoveOfferDto(updatedMoveOffer);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to edit move offer: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public MoveOfferDto accept(Long id) {
        try {
            MoveOffer offer = moveOfferRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));

            // Update Offer Status
            offer.setStatus(MoveStatus.ACCEPTED);
            moveOfferRepository.save(offer);

            // Update Move Request Status
            MoveRequestDto moveRequest = clientServiceClient.getMoveRequestById(offer.getMoveRequestId());
            if (moveRequest == null) {
                throw new RuntimeException("Move request not found with id: " + offer.getMoveRequestId());
            }
            moveRequest.setStatus("ACCEPTED");
            clientServiceClient.updateMoveRequest(moveRequest.getId(), moveRequest);

            // Create Move Trip
            CreateMoveTripDto tripDto = new CreateMoveTripDto();
            tripDto.setMoveRequestId(offer.getMoveRequestId());
            tripDto.setMoveOfferId(offer.getId());
            tripDto.setStatus("SCHEDULED");
            tripServiceClient.createTrip(tripDto);

            return Mapper.toMoveOfferDto(offer);
        } catch (Exception e) {
            System.err.println("Error in MoveOfferService.accept: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    @Transactional
    public MoveOfferDto reject(Long id) {
        MoveOffer offer = moveOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));

        offer.setStatus(MoveStatus.REJECTED);
        moveOfferRepository.save(offer);
        return Mapper.toMoveOfferDto(offer);
    }

    @Transactional
    public MoveOfferDto cancel(Long id) {
        MoveOffer offer = moveOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));

        offer.setStatus(MoveStatus.CANCELLED);
        moveOfferRepository.save(offer);
        return Mapper.toMoveOfferDto(offer);
    }

//    Delete
    public MoveOfferDto delete(Long id){
        try{
            MoveOffer moveOffer = moveOfferRepository.findById(id).orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));
            moveOfferRepository.delete(moveOffer);
            return Mapper.toMoveOfferDto(moveOffer);
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to delete move offer: " + ex.getMessage(), ex);
        }
    }

    private void validateVehicleForMoveRequest(Long vehicleId, Long moveRequestId) {
        MoveRequestDto moveRequest = clientServiceClient.getMoveRequestById(moveRequestId);
        if (moveRequest != null && Boolean.TRUE.equals(moveRequest.getHasFurniture())) {
            VehicleDto vehicle = vehicleService.getById(vehicleId);
            if (vehicle != null && !Boolean.TRUE.equals(vehicle.getCanCarryFurniture())) {
                throw new IllegalArgumentException("This move request requires a vehicle that can carry furniture.");
            }
        }
    }

    private void validatePriceForMoveOffer(Long price, Long vehicleId, Long moveRequestId) {
        MoveRequestDto moveRequest = clientServiceClient.getMoveRequestById(moveRequestId);
        VehicleDto vehicle = vehicleService.getById(vehicleId);

        if (moveRequest != null && vehicle != null && moveRequest.getDistance() != null && vehicle.getPricePerKm() != null) {
            double expectedPrice = moveRequest.getDistance() * vehicle.getPricePerKm();
            // Allow a small margin (e.g., 5%) or just inform if it's too high
            if (price > moveRequest.getMaxBudget()) {
                throw new IllegalArgumentException("Offered price exceeds the move request's max budget.");
            }
            // Enforce the business rule: Price determined by distance * price_per_km
            // If we want to be strict:
            /*
            if (Math.abs(price - expectedPrice) > 1.0) { // allowing $1 difference for rounding
                 throw new IllegalArgumentException("Offered price must be " + expectedPrice + " based on distance and vehicle rate.");
            }
            */
        }
    }

    private boolean validateMoveOffer(MoveOfferDto moveOfferDto) {
        // Add validation logic here
        StringBuilder errorMessage = new StringBuilder();

        if (moveOfferDto == null) {
            errorMessage.append("Move offer cannot be null.");
        }

        if(moveOfferDto.getPrice() == null || moveOfferDto.getPrice() <= 0) {
            errorMessage.append("Price must be a positive value.");
        }

        if(moveOfferDto.getMoveRequestId() == null) {
            errorMessage.append("Move request ID cannot be null.");
        }

        if(moveOfferDto.getDriverId() == null) {
            errorMessage.append("Driver ID cannot be null.");
        }

        if(moveOfferDto.getVehicleId() == null) {
            errorMessage.append("Vehicle ID cannot be null.");
        }

        if(moveOfferDto.getStatus() == null || moveOfferDto.getStatus().trim().isEmpty()) {
            errorMessage.append("Status cannot be null or empty.");
        }

        if(errorMessage.length() > 0) {
            throw new IllegalArgumentException(errorMessage.toString());
        }

        return true;
    }
    private boolean validateCreateMoveOffer(CreateMoveOfferDto moveOfferDto) {
        // Add validation logic here
        StringBuilder errorMessage = new StringBuilder();

        if (moveOfferDto == null) {
            errorMessage.append("Move offer cannot be null.");
        }

        if(moveOfferDto.getPrice() == null || moveOfferDto.getPrice() <= 0) {
            errorMessage.append("Price must be a positive value.");
        }

        if(moveOfferDto.getMoveRequestId() == null) {
            errorMessage.append("Move request ID cannot be null.");
        }

        if(moveOfferDto.getDriverId() == null) {
            errorMessage.append("Driver ID cannot be null.");
        }

        if(moveOfferDto.getVehicleId() == null) {
            errorMessage.append("Vehicle ID cannot be null.");
        }

        if(moveOfferDto.getStatus() == null || moveOfferDto.getStatus().trim().isEmpty()) {
            errorMessage.append("Status cannot be null or empty.");
        }

        if(errorMessage.length() > 0) {
            throw new IllegalArgumentException(errorMessage.toString());
        }

        return true;
    }
}
