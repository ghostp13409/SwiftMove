package com.swiftMove.clientManagement_service.service;

import com.swiftMove.clientManagement_service.dto.MoveRequestDTO;
import com.swiftMove.clientManagement_service.mapper.MoveRequestMapper;
import com.swiftMove.clientManagement_service.model.MoveRequest;
import com.swiftMove.clientManagement_service.repo.MoveRequestRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveRequestService {
    private final MoveRequestRepo moveRequestRepo;

    public List<MoveRequestDTO> getAllMoveRequest(){
        return moveRequestRepo.findAll().stream().map(MoveRequestMapper::toDTO).toList();
    }

    public MoveRequestDTO getMoveRequestById(Long id){
        MoveRequest moveRequest = moveRequestRepo.findById(id).
                orElseThrow(()->
                        new ResponseStatusException((HttpStatus.NOT_FOUND)));
        return MoveRequestMapper.toDTO(moveRequest);
    }

    public void acceptMoveRequest(Long id,String moveRequestStatus){
        MoveRequestDTO moveRequest=getMoveRequestById(id);


    }
}
