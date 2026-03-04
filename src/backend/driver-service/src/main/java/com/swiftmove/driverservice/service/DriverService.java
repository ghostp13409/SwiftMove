package com.swiftmove.driverservice.service;

import com.swiftmove.driverservice.client.AuthClient;
import com.swiftmove.driverservice.client.UserClient;
import com.swiftmove.driverservice.dto.AuthUserResponseDto;
import com.swiftmove.driverservice.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final UserClient userClient;
    private final AuthClient authClient;

    public List<UserResponseDto> getAllDrivers() {
        try {
            ResponseEntity<List<UserResponseDto>> users = userClient.getAll();

            // Filter Clients by roles
            return users.getBody().stream().filter(user -> user.getRole().equals("DRIVER")).toList();

        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve drivers from user service: " + ex.getMessage(), ex);
        }
    }

    public UserResponseDto getDriverById(Long id) {
        try {
            ResponseEntity<UserResponseDto> userResponse = userClient.getById(id);
            UserResponseDto user = userResponse.getBody();
            if (user != null && user.getRole().equals("DRIVER")) {
                return user;
            } else {
                return null; // Not found or not a driver
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve driver from user service: " + ex.getMessage(), ex);
        }
    }

    public UserResponseDto getCurrentDriver(String authHeader) {

        try{
            AuthUserResponseDto authUser =
                    authClient.getCurrentUser(authHeader).getBody();

            UserResponseDto user = userClient.getById(authUser.getId()).getBody();

            return user;
        }
        catch (Exception ex){
            throw new RuntimeException("Failed to retrieve current driver from auth service: " + ex.getMessage(), ex);
        }
    }

    public UserResponseDto delete(Long id) {
        try {
            ResponseEntity<UserResponseDto> userResponse = userClient.getById(id);
            UserResponseDto user = userResponse.getBody();
            if (user != null && user.getRole().equals("DRIVER")) {
                userClient.deleteUser(id);
//              TODO: delete the associated driver info as well
                return user;
            } else {
                return null; // Not found or not a client
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve driver from user service: " + ex.getMessage(), ex);
        }
    }







}
