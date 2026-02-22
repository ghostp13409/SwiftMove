package com.swiftmove.clientservice.mapper;

import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.model.MoveRequest;

public class MoveRequestMapper {

    public static MoveRequestDTO toDTO(MoveRequest moveRequest) {
        return new MoveRequestDTO(
                moveRequest.getId(),
                moveRequest.getMoveDate(),
                moveRequest.getMaxBudget(),
                moveRequest.getClientId(),
                moveRequest.getFromAddressId(),
                moveRequest.getToAddressId(),
                moveRequest.getStatus(),
                null // luggageEntries not mapped yet
        );

    }

    public static MoveRequest toMoveRequest(MoveReqPostDto dto) {
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
