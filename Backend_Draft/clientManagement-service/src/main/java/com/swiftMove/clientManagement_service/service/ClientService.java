package com.swiftMove.clientManagement_service.service;

import com.swiftMove.clientManagement_service.dto.UserResponseDTO;
import com.swiftMove.clientManagement_service.feign.UserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final UserClient userClient;

    // Getting all Clients
    public List<UserResponseDTO> getAllClients(){
        List<UserResponseDTO> userResponseDTOS=userClient.getAll();
        List<UserResponseDTO> clientResponseDTOS = new ArrayList<>();
        for (UserResponseDTO dto : userResponseDTOS)
        {
            if(dto.getRole().equals("CLIENT")){

                clientResponseDTOS.add(dto);
            }

        }
        return clientResponseDTOS;
    }

    public UserResponseDTO getClientById(Long id){
        List<UserResponseDTO> allClients=getAllClients();
        UserResponseDTO clientResponseDTO=null;
        boolean clientFound=false;
        for(UserResponseDTO dto : allClients){
            if (dto.getId().equals(id)) {
                clientFound = true;
                clientResponseDTO = dto;
                break;
            }

        }
        if(clientFound)
            return userClient.getById(id);

        else
            return null;
    }
}
