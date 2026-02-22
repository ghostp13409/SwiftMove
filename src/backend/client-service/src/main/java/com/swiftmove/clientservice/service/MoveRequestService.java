package com.swiftmove.clientservice.service;

import com.swiftmove.clientservice.dto.LuggageEntryDto;
import com.swiftmove.clientservice.dto.MoveReqPostDto;
import com.swiftmove.clientservice.dto.MoveRequestDTO;
import com.swiftmove.clientservice.mapper.MoveRequestMapper;
import com.swiftmove.clientservice.model.LuggageEntry;
import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.repo.LuggageEntryRepository;
import com.swiftmove.clientservice.repo.LuggageTypeRepository;
import com.swiftmove.clientservice.repo.MoveRequestRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoveRequestService {
    private final MoveRequestRepo moveRequestRepo;
    private final LuggageEntryRepository luggageEntryRepository;
    private final LuggageTypeRepository luggageTypeRepository;

    public List<MoveRequestDTO> getAllMoveRequest() {
        return moveRequestRepo.findAll().stream().map(MoveRequestMapper::toDTO).toList();
    }

    public MoveRequestDTO getMoveRequestById(Long id) {
        MoveRequest moveRequest = moveRequestRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException((HttpStatus.NOT_FOUND)));
        return MoveRequestMapper.toDTO(moveRequest);
    }

    public void addMoveRequest(MoveReqPostDto dto) {
        MoveRequest moveRequest = MoveRequestMapper.toMoveRequest(dto);
        moveRequest.setCreatedAt(LocalDate.now());
        moveRequest.setUpdatedAt(LocalDate.now());
        moveRequest = moveRequestRepo.save(moveRequest);

        // Handle luggage entries
        if (dto.getLuggageEntries() != null) {
            for (LuggageEntryDto leDto : dto.getLuggageEntries()) {
                LuggageEntry le = new LuggageEntry();
                le.setQuantity(leDto.getQuantity());
                le.setMoveRequest(moveRequest);
                LuggageType luggageType = luggageTypeRepository.findById(leDto.getLuggageTypeId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid luggage type"));
                le.setLuggageType(luggageType);
                le.setCreatedAt(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
                le.setUpdatedAt(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
                luggageEntryRepository.save(le);
            }
        }
    }

    public void deleteMoveRequest(Long id) {
        moveRequestRepo.deleteById(id);
    }

    public MoveRequestDTO updateMoveRequest(Long id, MoveReqPostDto dto) {
        MoveRequest moveRequest = moveRequestRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException((HttpStatus.NOT_FOUND)));

        // Update fields
        moveRequest.setMoveDate(dto.getMoveDate());
        moveRequest.setMaxBudget(dto.getMaxBudget());
        moveRequest.setClientId(dto.getClientId());
        moveRequest.setFromAddressId(dto.getFromAddressId());
        moveRequest.setToAddressId(dto.getToAddressId());
        moveRequest.setStatus(dto.getStatus());
        moveRequest.setUpdatedAt(LocalDate.now());

        // Handle luggage entries - for simplicity, delete old and add new
        if (moveRequest.getLuggageEntries() != null) {
            luggageEntryRepository.deleteAll(moveRequest.getLuggageEntries());
        }
        if (dto.getLuggageEntries() != null) {
            for (LuggageEntryDto leDto : dto.getLuggageEntries()) {
                LuggageEntry le = new LuggageEntry();
                le.setQuantity(leDto.getQuantity());
                le.setMoveRequest(moveRequest);
                LuggageType luggageType = luggageTypeRepository.findById(leDto.getLuggageTypeId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid luggage type"));
                le.setLuggageType(luggageType);
                le.setCreatedAt(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
                le.setUpdatedAt(java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
                luggageEntryRepository.save(le);
            }
        }

        moveRequestRepo.save(moveRequest);
        return MoveRequestMapper.toDTO(moveRequest);

    }

}
