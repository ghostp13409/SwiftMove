package com.swiftmove.tripservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.MoveOfferDto;
import com.swiftmove.tripservice.mapper.Mapper;
import com.swiftmove.tripservice.model.MoveStatus;
import com.swiftmove.tripservice.model.MoveTrip;
import com.swiftmove.tripservice.repository.MoveTripRepository;
import com.swiftmove.tripservice.client.ClientServiceClient;
import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.client.UserServiceClient;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoveTripService {

    private final MoveTripRepository moveTripRepository;
    private final ClientServiceClient clientServiceClient;
    private final DriverServiceClient driverServiceClient;
    private final UserServiceClient userServiceClient;

    public List<MoveTripDto> getAll(){
        return moveTripRepository
                .findAll()
                .stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public List<MoveTripDto> getByClientId(Long clientId) {
        List<MoveRequestDto> requests = clientServiceClient.getMoveRequestsByClientId(clientId);
        if (requests == null || requests.isEmpty()) return List.of();
        
        List<Long> requestIds = requests.stream().map(MoveRequestDto::getId).toList();
        return moveTripRepository.findByMoveRequestIdIn(requestIds).stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public List<MoveTripDto> getByDriverId(Long driverId) {
        List<MoveOfferDto> offers = driverServiceClient.getMoveOffersByDriverId(driverId);
        if (offers == null || offers.isEmpty()) return List.of();

        List<Long> offerIds = offers.stream().map(MoveOfferDto::getId).toList();
        return moveTripRepository.findByMoveOfferIdIn(offerIds).stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public MoveTripDto getById(Long id) {
        MoveTrip moveTrip=moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));
        return Mapper.toMoveTripDto(moveTrip);
    }

    public MoveTripDto add(CreateMoveTripDto newMoveTripDto) {
        try {
            validate(newMoveTripDto);
            MoveTrip newMoveTrip = Mapper.createMoveTripEntity(newMoveTripDto);
            newMoveTrip=moveTripRepository.save(newMoveTrip);
            return Mapper.toMoveTripDto(newMoveTrip);
        }
        catch (Exception ex) {
            throw new RuntimeException("Failed to create MoveTrip: " + ex.getMessage(), ex);
        }

    }

    public MoveTripDto updateStatus(Long id, String status) {
        MoveTrip trip = moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));
        
        MoveStatus newStatus = MoveStatus.valueOf(status);

        // Enforce flow: only if status is changing to COMPLETED
        if (newStatus == MoveStatus.COMPLETED) {
            if (trip.getStatus() != MoveStatus.COMPLETED_BY_DRIVER) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Move must be marked as completed by driver first.");
            }
        }
        
        if (status != null) {
            trip.setStatus(newStatus);
        }
        return Mapper.toMoveTripDto(moveTripRepository.save(trip));
    }


    public void delete(Long id) {
        MoveTrip trip = moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));
        
        // 1. Delete Move Offer
        try {
            driverServiceClient.deleteMoveOffer(trip.getMoveOfferId());
        } catch (Exception e) {
            System.err.println("Failed to delete MoveOffer: " + e.getMessage());
        }

        // 2. Delete Move Request
        try {
            clientServiceClient.deleteMoveRequest(trip.getMoveRequestId());
        } catch (Exception e) {
            System.err.println("Failed to delete MoveRequest: " + e.getMessage());
        }

        // 3. Delete the Trip itself
        moveTripRepository.delete(trip);
    }


    private void validate ( CreateMoveTripDto newMoveTripDto) {
        StringBuilder errorMessages = new StringBuilder();
      if (newMoveTripDto.getMoveRequestId()==null)
          errorMessages.append("Move Request Id is required");
      if (newMoveTripDto.getMoveOfferId()==null)
          errorMessages.append("Move Offer Id is required");
      if (newMoveTripDto.getStatus()==null||newMoveTripDto.getStatus().trim().isEmpty())
          errorMessages.append("Status is required");
      if (!errorMessages.isEmpty())
          throw new IllegalArgumentException(errorMessages.toString());
    }
}
