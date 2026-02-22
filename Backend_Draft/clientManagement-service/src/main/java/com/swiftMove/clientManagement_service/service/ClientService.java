package com.swiftMove.clientManagement_service.service;

import com.swiftMove.clientManagement_service.dto.MoveReqPostDto;
import com.swiftMove.clientManagement_service.dto.MoveRequestDTO;
import com.swiftMove.clientManagement_service.dto.UserResponseDTO;
import com.swiftMove.clientManagement_service.feign.UserClient;
import com.swiftMove.clientManagement_service.mapper.MoveRequestMapper;
import com.swiftMove.clientManagement_service.model.MoveRequest;
import com.swiftMove.clientManagement_service.repo.MoveRequestRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final UserClient userClient;
    private final MoveRequestRepo moveRequestRepo;

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
        UserResponseDTO user= userClient.getById(id);
        String role=user.getRole();
        if (!role.equals("CLIENT") && !role.equals("ADMIN"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"ACCESS DENIED");
        return user;

    }

    public List<MoveRequestDTO> getAllMovesClient(Long id){
        UserResponseDTO user= getClientById(id);
        if(user==null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"client not found");

        return moveRequestRepo
                .getAllMoveRequestsByClientId(id)
                .stream()
                .map(MoveRequestMapper::toDTO)
                .toList();

    }

    public List<MoveRequestDTO> getAllActiveMovesClient(Long id){
        List<MoveRequestDTO> allMoves=getAllMovesClient(id);
        List<MoveRequestDTO> activeMoves=new ArrayList<>();

        for (MoveRequestDTO dto : allMoves){
            if(dto.getStatus().equals("PAYMENT_COMPLETED")||dto.getStatus().equals("IS_IN_TRANSIT"))
                activeMoves.add(dto);
        }
        return activeMoves;
    }

    public MoveRequestDTO addMoveRequest(Long id, MoveReqPostDto dto){
        UserResponseDTO user=getClientById(id);
        if(user==null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"client not found");
        MoveRequest moveRequest=MoveRequestMapper.toMoveRequest(dto);
        moveRequest.setClientId(user.getId());
        moveRequest.setCreatedAt(LocalDate.now());
        moveRequest.setUpdatedAt(LocalDate.now());

        moveRequestRepo.save(moveRequest);
        return MoveRequestMapper.toDTO(moveRequest);

    }

}
