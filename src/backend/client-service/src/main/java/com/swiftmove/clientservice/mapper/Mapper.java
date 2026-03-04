package com.swiftmove.clientservice.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.swiftmove.clientservice.dto.AddLuggageEntryDto;
import com.swiftmove.clientservice.dto.UserResponseDto;
import com.swiftmove.clientservice.dto.requestDto.MoveRequestDto;
import com.swiftmove.clientservice.model.Client;
import com.swiftmove.clientservice.model.LuggageEntry;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.service.MoveRequestService;


public class Mapper {

    public static Client toClientEntity(UserResponseDto userResponseDTO, MoveRequestService moveRequestService)
    {

        Client client = new Client();
        client.setId(userResponseDTO.getId());
        client.setUsername(userResponseDTO.getUsername());
        client.setFirstName(userResponseDTO.getFirstName());
        client.setLastName(userResponseDTO.getLastName());
        client.setEmail(userResponseDTO.getEmail());
        client.setDob(userResponseDTO.getDob());
        client.setRating(userResponseDTO.getRating());
        client.setAddressId(userResponseDTO.getAddressId());
        client.setMoveRequests(moveRequestService.findByClientId(userResponseDTO.getId()));

        return client;

    }

    public static MoveRequest toMoveRequestEntity(MoveRequestDto moveRequestDto) {
        MoveRequest moveRequest = new MoveRequest();
        moveRequest.setId(moveRequestDto.getId());
        moveRequest.setClientId(moveRequestDto.getClientId());
        moveRequest.setFromAddressId(moveRequestDto.getFromAddressId());
        moveRequest.setToAddressId(moveRequestDto.getToAddressId());
        moveRequest.setMaxBudget(moveRequestDto.getMaxBudget());
        moveRequest.setMoveDate(moveRequestDto.getMoveDate());
        moveRequest.setStatus(moveRequestDto.getStatus());
        moveRequest.setCreatedAt(LocalDateTime.now());
        moveRequest.setUpdatedAt(LocalDateTime.now());
        return moveRequest;
    }

    public static MoveRequestDto toMoveRequestDto(MoveRequest moveRequest) {
        MoveRequestDto moveRequestDto = new MoveRequestDto();
        moveRequestDto.setId(moveRequest.getId());
        moveRequestDto.setClientId(moveRequest.getClientId());
        moveRequestDto.setFromAddressId(moveRequest.getFromAddressId());
        moveRequestDto.setToAddressId(moveRequest.getToAddressId());
        moveRequestDto.setMaxBudget(moveRequest.getMaxBudget());
        moveRequestDto.setMoveDate(moveRequest.getMoveDate());
        moveRequestDto.setStatus(moveRequest.getStatus());
        return moveRequestDto;
    }

    public static void updateMoveRequest(MoveRequest moveRequest, MoveRequestDto moveRequestDto) {
        moveRequest.setClientId(moveRequestDto.getClientId());
        moveRequest.setFromAddressId(moveRequestDto.getFromAddressId());
        moveRequest.setToAddressId(moveRequestDto.getToAddressId());
        moveRequest.setMaxBudget(moveRequestDto.getMaxBudget());
        moveRequest.setMoveDate(moveRequestDto.getMoveDate());
        moveRequest.setStatus(moveRequestDto.getStatus());
        moveRequest.setUpdatedAt(LocalDateTime.now());
    }

//    LuggageEntry

    public static LuggageEntry toLuggageEntryEntity(AddLuggageEntryDto luggageEntryDto) {
        LuggageEntry luggageEntry = new LuggageEntry();

        luggageEntry.setId(luggageEntryDto.getId());
        luggageEntry.setQuantity(luggageEntryDto.getQuantity());
        return luggageEntry;

    }

}
