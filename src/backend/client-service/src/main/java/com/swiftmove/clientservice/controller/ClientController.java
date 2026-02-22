package com.swiftmove.clientservice.controller;


import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.dto.UserResponseDTO;
import com.swiftmove.clientservice.service.ClientService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<MoveRequestDTO> addMoveRequest(@PathVariable Long id,@RequestBody MoveReqPostDto moveRequestDTO){
        return ResponseEntity.ok(clientService.addMoveRequest(id,moveRequestDTO));
    }


}
