package com.swiftmove.clientservice.mapper;

import com.swiftmove.clientservice.dto.UserResponseDto;
import com.swiftmove.clientservice.model.Client;
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

}
