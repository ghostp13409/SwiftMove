package com.swiftMove.clientManagement_service.controller;

import com.swiftMove.clientManagement_service.dto.MoveRequestDTO;
import com.swiftMove.clientManagement_service.repo.MoveRequestRepo;
import com.swiftMove.clientManagement_service.service.MoveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/move-request/")
public class MoveRequestController {

    private final MoveRequestService moveRequestService;

    @GetMapping("/{id}")
    public ResponseEntity<MoveRequestDTO> getMoveRequestById(@PathVariable Long id){
        return ResponseEntity.ok(moveRequestService.getMoveRequestById(id));
    }
}
