package com.swiftMove.clientManagement_service.mapper;

import com.swiftMove.clientManagement_service.dto.MoveRequestDTO;
import com.swiftMove.clientManagement_service.model.MoveRequest;
import com.swiftMove.clientManagement_service.repo.MoveRequestRepo;

public class MoveRequestMapper {

    public static MoveRequestDTO toDTO(MoveRequest moveRequest ){
        return new MoveRequestDTO(
                moveRequest.getId(),
                moveRequest.getMoveDate(),
                moveRequest.getMaxBudget(),
                moveRequest.getClientId(),
                moveRequest.getFromAddressId(),
                moveRequest.getToAddressId(),
                moveRequest.getStatus()
        );

    }
    public static MoveRequest toMoveRequest(MoveRequestDTO dto){
        MoveRequest moveRequest = new MoveRequest();
        moveRequest.setMoveDate(dto.getMoveDate());
        moveRequest.setMaxBudget(dto.getMaxBudget());
        moveRequest.setClientId(dto.getClientId());
        moveRequest.setFromAddressId(dto.getFromAddressId());
        moveRequest.setToAddressId(dto.getToAddressId());
        moveRequest.setStatus(dto.getStatus());
        return moveRequest;

    }
}
