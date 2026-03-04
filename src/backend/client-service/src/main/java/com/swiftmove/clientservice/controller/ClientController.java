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
    public ResponseEntity<List<MoveRequest>> getMoveRequestsForCurrentClient(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            AuthUserResponseDto authUser =
                    (AuthUserResponseDto) authClient.getCurrentUser(authHeader).getBody();

            List<MoveRequest> moveRequests = moveRequestService.findByClientId(authUser.getId());
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Get All Move Requests (for Admin)
    @GetMapping("/move-requests/all")
    public ResponseEntity<List<MoveRequest>> getAllMoveRequests() {
        try {
            List<MoveRequest> moveRequests = moveRequestService.findAll();
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }
//  Get MoveRequest by Id
    @GetMapping("/move-requests/{id}")
    public ResponseEntity<MoveRequest> getMoveRequestById(@PathVariable Long id) {
        MoveRequest moveRequest = moveRequestService.findById(id);
        if (moveRequest == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(moveRequest);
    }

    @GetMapping("/move-requests/active")
    public ResponseEntity<List<MoveRequest>> getActiveMoveRequestsForCurrentClient(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            AuthUserResponseDto authUser =
                    (AuthUserResponseDto) authClient.getCurrentUser(authHeader).getBody();

            List<MoveRequest> moveRequests = moveRequestService.findActiveByClientId(authUser.getId());
            return ResponseEntity.ok(moveRequests);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

//    Create a new MoveRequest for the current client
//    FIXME: Change MoveRequest to MoveRequestDto and implement validation
    @PostMapping("/move-requests")
    public ResponseEntity<MoveRequest> createMoveRequest(@RequestBody MoveRequest moveRequest,
                                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            AuthUserResponseDto authUser =
                    (AuthUserResponseDto) authClient.getCurrentUser(authHeader).getBody();
            moveRequest.setClientId(authUser.getId());
            MoveRequest createdMoveRequest = moveRequestService.add(moveRequest);
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
    public ResponseEntity<MoveRequest> updateMoveRequest(@PathVariable Long id, @RequestBody MoveRequestDto moveRequestDto) {
        try {
            moveRequestService.update(id, moveRequestDto);
            MoveRequest updatedMoveRequest = moveRequestService.findById(id);
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
    public ResponseEntity<List<LuggageType>> getAllLuggageTypes() {
        try {
            List<LuggageType> luggageTypes = luggageService.getAllTypes();
            return ResponseEntity.ok(luggageTypes);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
