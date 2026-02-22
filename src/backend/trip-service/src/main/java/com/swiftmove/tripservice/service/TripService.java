package com.swiftmove.tripservice.service;


import com.swiftmove.tripservice.dto.TripDTO;
import com.swiftmove.tripservice.mapper.TripMapper;
import com.swiftmove.tripservice.model.Trip;
import com.swiftmove.tripservice.repo.TripRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepo tripRepo;

    public List<TripDTO> getAllTrips() {
        return tripRepo
                .findAll()
                .stream()
                .map(TripMapper::toTripDTO)
                .toList();

    }

    public TripDTO getTripById(Long id) {
        Trip trip = tripRepo.findById(id).orElse(null);
        if (trip==null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found");
        return TripMapper.toTripDTO(trip);
    }
}
