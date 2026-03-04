package com.swiftmove.driverservice.service;

import com.swiftmove.driverservice.client.AuthClient;
import com.swiftmove.driverservice.dto.MoveOfferDto;
import com.swiftmove.driverservice.mapper.Mapper;
import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.repository.MoveOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveOfferService {

    private final MoveOfferRepository moveOfferRepository;
    private final AuthClient authClient;

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
    public MoveOfferDto add(MoveOfferDto moveOfferDto){
        validateMoveOffer(moveOfferDto);
        return Mapper.toMoveOfferDto(moveOfferRepository.save(Mapper.toMoveOfferEntity(moveOfferDto)));
    }

//    Edit
    public MoveOfferDto edit(Long id, MoveOfferDto moveOfferDto){
        try{
            validateMoveOffer(moveOfferDto);
            MoveOffer existingMoveOffer = moveOfferRepository.findById(id).orElseThrow(() -> new RuntimeException("Move offer not found with id: " + id));
            existingMoveOffer.setOfferedDate(moveOfferDto.getOfferedDate());
            existingMoveOffer.setPrice(moveOfferDto.getPrice());
            existingMoveOffer.setStatus(moveOfferDto.getStatus());
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
}
