package com.swiftmove.clientservice.service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.swiftmove.clientservice.client.LocationServiceClient;
import com.swiftmove.clientservice.dto.AddressDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.swiftmove.clientservice.dto.CreateMoveRequestDto;
import com.swiftmove.clientservice.dto.requestDto.MoveRequestDto;
import com.swiftmove.clientservice.mapper.Mapper;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.model.MoveStatus;
import com.swiftmove.clientservice.repository.LuggageEntryRepository;
import com.swiftmove.clientservice.repository.MoveRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoveRequestService {
    private final MoveRequestRepository moveRequestRepository;
    private final LuggageEntryRepository luggageEntryRepository;
    private final LocationServiceClient locationServiceClient;


//    CRUD
    public List<MoveRequestDto> findAll() {
        List<MoveRequest> moveRequests = moveRequestRepository.findAll();
        return moveRequests.stream().map(Mapper::toMoveRequestDto).toList();
    }

    public MoveRequestDto findById(Long moveRequestId) {
        MoveRequest moveRequest = moveRequestRepository.findById(moveRequestId).orElse(null);
        if(moveRequest == null){
            System.out.println("MoveRequestRepository returned a null.");
        }
        assert moveRequest != null;
        return Mapper.toMoveRequestDto(moveRequest);
    }

    private void updateDistanceAndCoordinates(MoveRequest moveRequest) {
        if (moveRequest.getFromAddressId() != null && moveRequest.getToAddressId() != null) {
            AddressDTO from = locationServiceClient.getAddressById(moveRequest.getFromAddressId());
            AddressDTO to = locationServiceClient.getAddressById(moveRequest.getToAddressId());

            if (from != null && to != null) {
                moveRequest.setFromLatitude(from.getLatitude());
                moveRequest.setFromLongitude(from.getLongitude());
                moveRequest.setToLatitude(to.getLatitude());
                moveRequest.setToLongitude(to.getLongitude());

                double distance = DistanceUtils.calculateDistance(
                        from.getLatitude(), from.getLongitude(),
                        to.getLatitude(), to.getLongitude()
                );
                moveRequest.setDistance(distance);
            }
        }
    }

    public void update(Long id,  MoveRequestDto moveRequestDto) {
            MoveRequest existingMoveRequest = moveRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move request not found"));

        Mapper.updateMoveRequest(existingMoveRequest, moveRequestDto);
        updateDistanceAndCoordinates(existingMoveRequest);

        try{
            validateMoveRequest(existingMoveRequest);
            moveRequestRepository.save(existingMoveRequest);
        }catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Move Request: " + e.getMessage());
        }
    }

    public MoveRequestDto add(CreateMoveRequestDto createMoveRequestDto) {
        try{
            MoveRequest moveRequest = Mapper.createMoveRequestEntity(createMoveRequestDto);
            updateDistanceAndCoordinates(moveRequest);
            validateMoveRequest(moveRequest);
            // Make move Request Status to "CREATED"
            moveRequest.setStatus(MoveStatus.CREATED);
            moveRequestRepository.save(moveRequest);
            return Mapper.toMoveRequestDto(moveRequest);
        }catch(Exception e){
            System.err.println("Error adding move request: " + e.getMessage());
            return null;
        }
    }

    public void remove(Long moveRequestId) {
        if(moveRequestId != null)
        moveRequestRepository.deleteById(moveRequestId);
    }

    public void cancel(Long id) {
        MoveRequest moveRequest = moveRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Request not found"));
        moveRequest.setStatus(MoveStatus.CANCELLED);
        moveRequestRepository.save(moveRequest);
    }

    public MoveRequest getRandom(){

        Long randomLong = ThreadLocalRandom.current().nextLong(1, 77);
        return moveRequestRepository.findById(randomLong).orElse(null);
    }

    public List<MoveRequestDto> findByClientId(Long clientId)
    {

        List<MoveRequest> moveRequests = moveRequestRepository.findByClientId(clientId);

        return moveRequests.stream().map(Mapper::toMoveRequestDto).toList();
    }

    //Get all active move request for the client
    public List<MoveRequestDto> findActiveByClientId(Long clientId)
    {
        List<MoveStatus> activeStatuses = Arrays.asList(MoveStatus.CREATED, MoveStatus.OFFER_AVAILABLE);

        List<MoveRequest> moveRequests = moveRequestRepository.findByClientId(clientId);

        // Filter move requests by active statuses
        moveRequests = moveRequests.stream()
                .filter(mr -> activeStatuses.contains(mr.getStatus()))
                .toList();

        return moveRequests.stream().map(Mapper::toMoveRequestDto).toList();
    }

    public List<MoveRequestDto> findAllActive() {
        List<MoveStatus> activeStatuses = Arrays.asList(MoveStatus.CREATED, MoveStatus.OFFER_AVAILABLE);
        List<MoveRequest> moveRequests = moveRequestRepository.findAll();
        return moveRequests.stream()
                .filter(mr -> activeStatuses.contains(mr.getStatus()))
                .map(Mapper::toMoveRequestDto)
                .toList();
    }

    // Get Currently Logged in User

    private boolean validateMoveRequest(MoveRequest moveRequest) {

//        FIXME: Implement Proper Validation
        StringBuilder errors = new StringBuilder();

        // Move Date
        if(moveRequest.getMoveDate() == null){
            errors.append("Move Date is null.");
        } else if (moveRequest.getMoveDate().isBefore(Instant.now().minusSeconds(300))) {
            errors.append("Move date cannot be in the past.");
        }
        
        // Max Budget

        if(moveRequest.getMaxBudget() == null){
            errors.append("Max Budget is null.");
        }
        if(moveRequest.getMaxBudget() < 0){
            errors.append("Max budget cannot be negative.");
        }
        if(moveRequest.getClientId() == null){
            errors.append("Client Id is null.");
        }
        if(moveRequest.getFromAddressId() == null){
            errors.append("From Address Id is null.");
        }
        if(moveRequest.getToAddressId() == null){
            errors.append("To Address Id is null.");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException(errors.toString());
        }
        return true;
    }

    public MoveRequest getMoveRequestById(Long id) {
        MoveRequest moveRequest = moveRequestRepository.findById(id).orElse(null);
        if(moveRequest == null){
            System.out.println("MoveRequestRepository returned a null.");
        }
        return moveRequest;
    }


}
