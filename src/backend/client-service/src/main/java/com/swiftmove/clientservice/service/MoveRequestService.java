package com.swiftmove.clientservice.service;

import com.swiftmove.clientservice.dto.requestDto.MoveRequestDto;
import com.swiftmove.clientservice.mapper.Mapper;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.repository.LuggageEntryRepository;
import com.swiftmove.clientservice.repository.MoveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class MoveRequestService {
    private final MoveRequestRepository moveRequestRepository;
    private final LuggageEntryRepository luggageEntryRepository;


//    CRUD
    public List<MoveRequest> findAll() {
        return moveRequestRepository.findAll();
    }

    public MoveRequest findById(Long moveRequestId) {
        MoveRequest moveRequest = moveRequestRepository.findById(moveRequestId).orElse(null);
        if(moveRequest == null){
            System.out.println("MoveRequestRepository returned a null.");
        }
        return moveRequestRepository.findById(moveRequestId).orElse(null);
    }
    public void update(Long id,  MoveRequestDto moveRequestDto) {
            MoveRequest existingMoveRequest = moveRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Mapper.updateMoveRequest(existingMoveRequest, moveRequestDto);

        try{
            validateMoveRequest(existingMoveRequest);
            moveRequestRepository.save(existingMoveRequest);
        }catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Move Request: " + e.getMessage());
        }
    }

    public MoveRequest add(MoveRequest moveRequest) {
        try{
            validateMoveRequest(moveRequest);
            return moveRequestRepository.save(moveRequest);
        }catch(Exception e){
            return null;
        }
    }

    public void remove(Long moveRequestId) {
        if(moveRequestId != null)
        moveRequestRepository.deleteById(moveRequestId);
    }

    public MoveRequest getRandom(){

        Long randomLong = ThreadLocalRandom.current().nextLong(1, 77);
        MoveRequest moveRequest = moveRequestRepository.findById(randomLong).orElse(null);
        return moveRequest;
    }

    public List<MoveRequest> findByClientId(Long clientId)
    {

        List<MoveRequest> moveRequests = moveRequestRepository.findByClientId(clientId);

//        // Add Move Offers to All Move Requests
//        for(MoveRequest mr : moveRequests){
//            addMoveOffers(mr);
//        }

        return moveRequests;
    }

    //Get all active move request for the client
    public List<MoveRequest> findActiveByClientId(Long clientId)
    {
        String [] activeStatuses = {"PENDING", "OFFER_AVAILABLE", "CREATED"};

        List<MoveRequest> moveRequests = moveRequestRepository.findByClientId(clientId);

        // Filter move requests by active statuses
        moveRequests = moveRequests.stream()
                .filter(mr -> Arrays.asList(activeStatuses).contains(mr.getStatus()))
                .toList();

        return moveRequests;
    }

    // Get Currently Logged in User

    private boolean validateMoveRequest(MoveRequest moveRequest) {

//        FIXME: Implement Proper Validation
        StringBuilder errors = new StringBuilder();
        // Id
        if(moveRequest.getId() == null){
           errors.append("Id is null.");
        }

        // Move Date
        if(moveRequest.getMoveDate() == null){
            errors.append("Move Date is null.");
        }
        // Move date cannot be in the past
        if(moveRequest.getMoveDate() != null && moveRequest.getMoveDate().isBefore(LocalDateTime.now())){
            errors.append("Move Date cannot be in the past.");
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
        if(errors.length() > 0){
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
