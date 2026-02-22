package com.swiftMove.tripManagement_service.controller;

import com.swiftMove.tripManagement_service.dto.TripDTO;
import com.swiftMove.tripManagement_service.repo.TripRepo;
import com.swiftMove.tripManagement_service.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips/")
public class TripController {
    private final TripService tripService;

    @GetMapping("/allTrips")
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable Long id) {
        TripDTO trip = tripService.getTripById(id);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }
}
