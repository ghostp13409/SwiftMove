package com.swiftmove.clientservice.controller;

import com.swiftmove.clientservice.client.AuthClient;
import com.swiftmove.clientservice.dto.*;
import com.swiftmove.clientservice.dto.requestDto.MoveRequestDto;
import com.swiftmove.clientservice.model.LuggageEntry;
import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.service.ClientService;
import com.swiftmove.clientservice.service.LuggageService;
import com.swiftmove.clientservice.service.MoveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final MoveRequestService moveRequestService;
    private final LuggageService luggageService;
    private final AuthClient authClient;

    @GetMapping("/test")
    public Object test(@RequestHeader (value = "Authorization", required = false) String authHeader) {
        Object authUser =  authClient.getCurrentUser(authHeader);
        return authUser;
    }
//    Client Endpoints
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllClients(){
        List<UserResponseDto> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentClient(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            return ResponseEntity.ok(clientService.getCurrentClient(authHeader));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Failed to retrieve current client: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getClientById(@PathVariable Long id) {
        UserResponseDto client = clientService.getClientById(id);
        if (client == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(client);
    }

//    MoveRequest Endpoints

//     Get All Move Requests for the current client
    @GetMapping("/move-requests")
    public ResponseEntity<List<MoveRequestDto>> getMoveRequestsForCurrentClient(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            UserResponseDto user =
                    (UserResponseDto) authClient.getCurrentUser(authHeader).getBody();
            List<MoveRequestDto> moveRequests;
            assert user != null;
            if(Objects.equals(user.getRole(), "ADMIN")){
                moveRequests = moveRequestService.findAll();
            }
            else if(Objects.equals(user.getRole(), "CLIENT")){
                moveRequests = moveRequestService.findByClientId(user.getId());
            }
            else if(Objects.equals(user.getRole(), "DRIVER")){
                moveRequests = moveRequestService.findAllActive();
            }
            else{
                throw new Exception("Unauthorized role: " + user.getRole());
            }
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    TODO: Needs to be deprecated and replaced with the above endpoint with role-based access control
//    Get All Move Requests (for Admin)
    @GetMapping("/move-requests/all")
    public ResponseEntity<List<MoveRequestDto>> getAllMoveRequests() {
        try {
            List<MoveRequestDto> moveRequests = moveRequestService.findAll();
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/move-requests/by-client")
    public ResponseEntity<List<MoveRequestDto>> getMoveRequestsByClientId(@RequestParam Long clientId) {
        try {
            return ResponseEntity.ok(moveRequestService.findByClientId(clientId));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }
//  Get MoveRequest by Id
    @GetMapping("/move-requests/{id}")
    public ResponseEntity<MoveRequestDto> getMoveRequestById(@PathVariable Long id) {
        MoveRequestDto moveRequestDto = moveRequestService.findById(id);
        if (moveRequestDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(moveRequestDto);
    }

    @GetMapping("/move-requests/active")
    public ResponseEntity<List<MoveRequestDto>> getActiveMoveRequestsForCurrentClient(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            UserResponseDto authUser =
                    (UserResponseDto) authClient.getCurrentUser(authHeader).getBody();

            List<MoveRequestDto> moveRequests = moveRequestService.findActiveByClientId(authUser.getId());
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Create a new MoveRequest for the current client
//    FIXME: Change MoveRequest to MoveRequestDto and implement validation
    @PostMapping("/move-requests")
    public ResponseEntity<MoveRequestDto> createMoveRequest(@RequestBody CreateMoveRequestDto createMoveRequestDto,
                                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            UserResponseDto authUser =
                    (UserResponseDto) authClient.getCurrentUser(authHeader).getBody();
            createMoveRequestDto.setClientId(authUser.getId());
            MoveRequestDto createdMoveRequest = moveRequestService.add(createMoveRequestDto);
            if (createdMoveRequest == null) {
                // BAD Request
                return ResponseEntity.status(400).build();
            }
            return ResponseEntity.ok(createdMoveRequest);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Edit MoveRequest
    @PutMapping("/move-requests/{id}")
    public ResponseEntity<MoveRequestDto> updateMoveRequest(@PathVariable Long id, @RequestBody MoveRequestDto moveRequestDto) {
        try {
            moveRequestService.update(id, moveRequestDto);
            MoveRequestDto updatedMoveRequest = moveRequestService.findById(id);
            if (updatedMoveRequest == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedMoveRequest);
        } catch (Exception ex) {
            System.out.println("Error updating MoveRequest: " + ex.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

//    Delete MoveRequest
    @DeleteMapping("/move-requests/{id}")
    public ResponseEntity<Void> deleteMoveRequest(@PathVariable Long id) {
        try {
            moveRequestService.remove(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/move-requests/{id}/cancel")
    public ResponseEntity<Void> cancelMoveRequest(@PathVariable Long id) {
        try {
            moveRequestService.cancel(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

//    Luggage

//    Get All or by MoveRequestId
    @GetMapping("/move-requests/luggage")
    public ResponseEntity<List<LuggageEntry>> getLuggageForMoveRequest(@RequestParam(required = false) Long moveRequestId) {
        try {
            if(moveRequestId == null){
                return ResponseEntity.ok(luggageService.getAll());
            }
            List<LuggageEntry> luggageEntries = luggageService.getByMoveRequestId(moveRequestId);
            return ResponseEntity.ok(luggageEntries);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/move-requests/luggage")
    public ResponseEntity<LuggageEntry> addLuggageToMoveRequest(@RequestParam Long moveRequestId, @RequestBody AddLuggageEntryDto luggageEntryDto) {
        try {
            LuggageEntry createdLuggageEntry = luggageService.addLuggageEntry(moveRequestId, luggageEntryDto);
            if (createdLuggageEntry == null) {
                return ResponseEntity.status(400).build();
            }
            return ResponseEntity.ok(createdLuggageEntry);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/move-requests/luggage/{id}")
    public ResponseEntity<LuggageEntry> updateLuggageEntry(@PathVariable Long id, @RequestBody UpdateLuggageEntryDto luggageEntryDto) {
        try {
            LuggageEntry updatedLuggageEntry = luggageService.updateLuggageEntry(id, luggageEntryDto);
            if (updatedLuggageEntry == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedLuggageEntry);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/move-requests/luggage/{id}")
    public ResponseEntity<Void> deleteLuggageEntry(@PathVariable Long id) {
        try {
            luggageService.deleteLuggageEntry(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/move-requests/luggage/empty")
    public ResponseEntity<Void> emptyLuggageForMoveRequest(@RequestParam Long moveRequestId) {
        try {
            luggageService.deleteAllLuggageEntries(moveRequestId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

//    Get All Luggage Types
    @GetMapping("/move-requests/luggage/types")
    public ResponseEntity<List<LuggageTypeDto>> getAllLuggageTypes() {
        try {
            List<LuggageTypeDto> luggageTypes = luggageService.getAllTypes();
            return ResponseEntity.ok(luggageTypes);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get LuggageType by Id
    @GetMapping("/move-requests/luggage/types/{id}")
    public ResponseEntity<LuggageTypeDto> getLuggageTypeById(@PathVariable Long id) {
        try {
            LuggageTypeDto luggageType = luggageService.getTypeById(id);
            if (luggageType == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(luggageType);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
