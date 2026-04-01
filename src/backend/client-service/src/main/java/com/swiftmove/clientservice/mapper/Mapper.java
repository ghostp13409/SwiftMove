package com.swiftmove.clientservice.mapper;

import com.swiftmove.clientservice.dto.AddLuggageEntryDto;
import com.swiftmove.clientservice.dto.CreateMoveRequestDto;
import com.swiftmove.clientservice.dto.LuggageEntryDto;
import com.swiftmove.clientservice.dto.LuggageTypeDto;
import com.swiftmove.clientservice.dto.UserResponseDto;
import com.swiftmove.clientservice.dto.requestDto.MoveRequestDto;
import com.swiftmove.clientservice.model.Client;
import com.swiftmove.clientservice.model.LuggageEntry;
import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.model.MoveStatus;
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

        return client;

    }

    public static MoveRequest toMoveRequestEntity(MoveRequestDto moveRequestDto) {
        if (moveRequestDto == null) return null;
        MoveRequest moveRequest = new MoveRequest();
        moveRequest.setId(moveRequestDto.getId());
        moveRequest.setClientId(moveRequestDto.getClientId());
        moveRequest.setFromAddressId(moveRequestDto.getFromAddressId());
        moveRequest.setToAddressId(moveRequestDto.getToAddressId());
        moveRequest.setDistance(moveRequestDto.getDistance());
        moveRequest.setFromLatitude(moveRequestDto.getFromLatitude());
        moveRequest.setFromLongitude(moveRequestDto.getFromLongitude());
        moveRequest.setToLatitude(moveRequestDto.getToLatitude());
        moveRequest.setToLongitude(moveRequestDto.getToLongitude());
        moveRequest.setMaxBudget(moveRequestDto.getMaxBudget());
        moveRequest.setMoveDate(moveRequestDto.getMoveDate());
        moveRequest.setHasFurniture(moveRequestDto.getHasFurniture());
        moveRequest.setNote(moveRequestDto.getNote());
        if (moveRequestDto.getStatus() != null) {
            moveRequest.setStatus(MoveStatus.valueOf(moveRequestDto.getStatus()));
        }
        return moveRequest;
    }

//    Move Request
    public static MoveRequestDto toMoveRequestDto(MoveRequest moveRequest) {
        if (moveRequest == null) return null;
        MoveRequestDto moveRequestDto = new MoveRequestDto();
        moveRequestDto.setId(moveRequest.getId());
        moveRequestDto.setClientId(moveRequest.getClientId());
        moveRequestDto.setFromAddressId(moveRequest.getFromAddressId());
        moveRequestDto.setToAddressId(moveRequest.getToAddressId());
        moveRequestDto.setDistance(moveRequest.getDistance());
        moveRequestDto.setFromLatitude(moveRequest.getFromLatitude());
        moveRequestDto.setFromLongitude(moveRequest.getFromLongitude());
        moveRequestDto.setToLatitude(moveRequest.getToLatitude());
        moveRequestDto.setToLongitude(moveRequest.getToLongitude());
        moveRequestDto.setMaxBudget(moveRequest.getMaxBudget());
        moveRequestDto.setMoveDate(moveRequest.getMoveDate());
        moveRequestDto.setHasFurniture(moveRequest.getHasFurniture());
        moveRequestDto.setNote(moveRequest.getNote());
        if (moveRequest.getStatus() != null) {
            moveRequestDto.setStatus(moveRequest.getStatus().name());
        }
        return moveRequestDto;
    }

    public static MoveRequest createMoveRequestEntity(CreateMoveRequestDto createMoveRequestDto) {
        if (createMoveRequestDto == null) return null;
        MoveRequest moveRequest = new MoveRequest();
            moveRequest.setClientId(createMoveRequestDto.getClientId());
            moveRequest.setFromAddressId(createMoveRequestDto.getFromAddressId());
            moveRequest.setToAddressId(createMoveRequestDto.getToAddressId());
            moveRequest.setDistance(createMoveRequestDto.getDistance());
            moveRequest.setFromLatitude(createMoveRequestDto.getFromLatitude());
            moveRequest.setFromLongitude(createMoveRequestDto.getFromLongitude());
            moveRequest.setToLatitude(createMoveRequestDto.getToLatitude());
            moveRequest.setToLongitude(createMoveRequestDto.getToLongitude());
            moveRequest.setMaxBudget(createMoveRequestDto.getMaxBudget());
            moveRequest.setMoveDate(createMoveRequestDto.getMoveDate());
            moveRequest.setHasFurniture(createMoveRequestDto.getHasFurniture());
            moveRequest.setNote(createMoveRequestDto.getNote());
            if (createMoveRequestDto.getStatus() != null) {
                moveRequest.setStatus(MoveStatus.valueOf(createMoveRequestDto.getStatus()));
            }

            return moveRequest;
    }

    public static void updateMoveRequest(MoveRequest moveRequest, MoveRequestDto moveRequestDto) {
        if (moveRequest == null || moveRequestDto == null) return;
        moveRequest.setClientId(moveRequestDto.getClientId());
        moveRequest.setFromAddressId(moveRequestDto.getFromAddressId());
        moveRequest.setToAddressId(moveRequestDto.getToAddressId());
        moveRequest.setDistance(moveRequestDto.getDistance());
        moveRequest.setFromLatitude(moveRequestDto.getFromLatitude());
        moveRequest.setFromLongitude(moveRequestDto.getFromLongitude());
        moveRequest.setToLatitude(moveRequestDto.getToLatitude());
        moveRequest.setToLongitude(moveRequestDto.getToLongitude());
        moveRequest.setMaxBudget(moveRequestDto.getMaxBudget());
        moveRequest.setMoveDate(moveRequestDto.getMoveDate());
        moveRequest.setHasFurniture(moveRequestDto.getHasFurniture());
        moveRequest.setNote(moveRequestDto.getNote());
        if (moveRequestDto.getStatus() != null) {
            moveRequest.setStatus(MoveStatus.valueOf(moveRequestDto.getStatus()));
        }
    }

//    LuggageEntry

    public static LuggageEntryDto toLuggageEntryDto(LuggageEntry luggageEntry) {
        if (luggageEntry == null) return null;
        LuggageEntryDto luggageEntryDto = new LuggageEntryDto();
        luggageEntryDto.setId(luggageEntry.getId());
        luggageEntryDto.setQuantity(luggageEntry.getQuantity());
        luggageEntryDto.setMoveRequestId(luggageEntry.getMoveRequestId());
        luggageEntryDto.setLuggageTypeId(luggageEntry.getLuggageTypeId());
        return luggageEntryDto;
    }

    public static LuggageEntry toLuggageEntryEntity(LuggageEntryDto luggageEntryDto) {
        if (luggageEntryDto == null) return null;
        LuggageEntry luggageEntry = new LuggageEntry();
        luggageEntry.setId(luggageEntryDto.getId());
        luggageEntry.setQuantity(luggageEntryDto.getQuantity());
        luggageEntry.setMoveRequestId(luggageEntryDto.getMoveRequestId());
        luggageEntry.setLuggageTypeId(luggageEntryDto.getLuggageTypeId());
        return luggageEntry;
    }
    public static LuggageEntry toLuggageEntryEntity(AddLuggageEntryDto luggageEntryDto) {
        if (luggageEntryDto == null) return null;
        LuggageEntry luggageEntry = new LuggageEntry();
        luggageEntry.setId(luggageEntryDto.getId());
        luggageEntry.setQuantity(luggageEntryDto.getQuantity());
        luggageEntry.setMoveRequestId(luggageEntryDto.getMoveRequestId());
        // Note: luggageTypeId needs to be set by the service using the enum from DTO
        return luggageEntry;

    }

    public static LuggageTypeDto toLuggageTypeDto(LuggageType luggageType) {
        if (luggageType == null) return null;
        LuggageTypeDto luggageTypeDto = new LuggageTypeDto();
        luggageTypeDto.setId(luggageType.getId());
        luggageTypeDto.setType(luggageType.getType());
        luggageTypeDto.setLuggageTypeEnum(luggageType.getType());
        luggageTypeDto.setName(luggageType.getName());
        luggageTypeDto.setVolume(luggageType.getVolume());
        luggageTypeDto.setWeight(luggageType.getWeight());
        return luggageTypeDto;
    }

}
