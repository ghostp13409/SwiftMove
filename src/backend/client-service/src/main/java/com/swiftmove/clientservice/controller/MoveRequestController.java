package com.swiftmove.clientservice.controller;

import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.service.MoveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/move-request/")
public class MoveRequestController {

    private final MoveRequestService moveRequestService;


    @GetMapping("/get")
    public ResponseEntity<List<MoveRequestDTO>> getAllMoveRequest(){
        return ResponseEntity.ok(moveRequestService.getAllMoveRequest());
    }
    @GetMapping("/{id}")
    public ResponseEntity<MoveRequestDTO> getMoveRequestById(@PathVariable Long id){
        return ResponseEntity.ok(moveRequestService.getMoveRequestById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addNewMoveRequest(@RequestBody MoveReqPostDto moveReqPostDto){
        moveRequestService.addMoveRequest(moveReqPostDto);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMoveRequest(@PathVariable Long id){
        moveRequestService.deleteMoveRequest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<MoveRequestDTO> editMoveRequest(@PathVariable Long id, @RequestBody MoveReqPostDto moveReqPostDto){
        return ResponseEntity.ok(moveRequestService.updateMoveRequest(id,moveReqPostDto));
    }
}
