package com.swiftmove.tripservice.service;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.mapper.Mapper;
import com.swiftmove.tripservice.model.MoveTrip;
import com.swiftmove.tripservice.repository.MoveTripRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveTripService {

    private final MoveTripRepository moveTripRepository;

    public List<MoveTripDto> getAll(){
        return moveTripRepository
                .findAll()
                .stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }
    public MoveTripDto getById(Long id) {
        MoveTrip moveTrip=moveTripRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Move Trip Not Found"));
        return Mapper.toMoveTripDto(moveTrip);
    }

    public MoveTripDto add(CreateMoveTripDto newMoveTripDto) {
        try {
            validate(newMoveTripDto);
            MoveTrip newMoveTrip = Mapper.createMoveTripEntity(newMoveTripDto);
            newMoveTrip=moveTripRepository.save(newMoveTrip);
            return Mapper.toMoveTripDto(newMoveTrip);
        }
        catch (Exception ex) {
            throw new RuntimeException("Failed to create MoveTrip: " + ex.getMessage(), ex);
        }

    }


    private void validate ( CreateMoveTripDto newMoveTripDto) {
        StringBuilder errorMessages = new StringBuilder();
      if (newMoveTripDto.getMoveRequestId()==null)
          errorMessages.append("Move Request Id is required");
      if (newMoveTripDto.getMoveOfferId()==null)
          errorMessages.append("Move Offer Id is required");
      if (newMoveTripDto.getStatus()==null||newMoveTripDto.getStatus().trim().isEmpty())
          errorMessages.append("Status is required");
      if (!errorMessages.isEmpty())
          throw new IllegalArgumentException(errorMessages.toString());
    }
}
