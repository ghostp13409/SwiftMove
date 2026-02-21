package com.swiftMove.clientManagement_service.controller;

import com.swiftMove.clientManagement_service.dto.MoveRequestDTO;
import com.swiftMove.clientManagement_service.dto.UserResponseDTO;
import com.swiftMove.clientManagement_service.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/client/")
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/allClients")
    public ResponseEntity<List<UserResponseDTO>> getAllClients(){
        List<UserResponseDTO> allClients=clientService.getAllClients();
        return ResponseEntity.ok(allClients);
    }
    @GetMapping("/getClient/{id}")
    public ResponseEntity<UserResponseDTO> getClient(@PathVariable Long id){
        return ResponseEntity.ok(clientService.getClientById(id));
    }
    @GetMapping("/{id}/move-requests/history")
    public ResponseEntity<List<MoveRequestDTO>>getHistory(@PathVariable Long id){
        return ResponseEntity.ok(clientService.getAllMovesClient(id));
    }

    @GetMapping("/{id}/move-requests/active")
    public ResponseEntity<List<MoveRequestDTO>> getActiveMoves(@PathVariable Long id){
        return ResponseEntity.ok(clientService.getAllActiveMovesClient(id));
    }
    @PostMapping("/{id}/addMoveRequest")
    public ResponseEntity<MoveRequestDTO> addMoveRequest(@PathVariable Long id,@RequestBody MoveRequestDTO moveRequestDTO){
        return ResponseEntity.ok(clientService.addMoveRequest(id,moveRequestDTO));
    }


}
