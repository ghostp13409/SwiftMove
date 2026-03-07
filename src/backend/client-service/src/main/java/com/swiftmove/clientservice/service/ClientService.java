package com.swiftmove.clientservice.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.swiftmove.clientservice.client.AuthClient;
import com.swiftmove.clientservice.client.UserClient;
import com.swiftmove.clientservice.dto.AuthUserResponseDto;
import com.swiftmove.clientservice.dto.UserResponseDto;
import com.swiftmove.clientservice.model.Client;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final AuthClient authClient;
    private final UserClient userClient;
    private final MoveRequestService moveRequestService;

    public UserResponseDto getCurrentClient(String authHeader) {

        try{
            UserResponseDto user =
                     authClient.getCurrentUser(authHeader).getBody();
            return user;
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to retrieve current user from auth service: " + ex.getMessage(), ex);
        }
    }

    public List<UserResponseDto> getAllClients() {
        try {
            ResponseEntity<List<UserResponseDto>> users = userClient.getAll();
            
            // Filter Clients by roles
            return users.getBody().stream().filter(user -> user.getRole().equals("CLIENT")).toList();

        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve clients from user service: " + ex.getMessage(), ex);
        }
    }
    public UserResponseDto getClientById(Long id) {
        try {
            ResponseEntity<UserResponseDto> userResponse = userClient.getById(id);
            UserResponseDto user = userResponse.getBody();
            if (user != null && user.getRole().equals("CLIENT")) {
                return user;
            } else {
                return null; // Not found or not a client
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve client from user service: " + ex.getMessage(), ex);
        }
    }

}
