package com.swiftmove.tripservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.swiftmove.tripservice.dto.TripDTO;
import com.swiftmove.tripservice.service.TripService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
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

    @GetMapping("/user")
    public ResponseEntity<List<TripDTO>> getTripsByUserId(@RequestParam Long userId) {

        // Return Not Implemented
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    // GET /trips/client/{clientId} - Get trips for a client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TripDTO>> getTripsForClient(@PathVariable Long clientId) {
        List<TripDTO> trips = tripService.getTripsByClient(clientId);
        return ResponseEntity.ok(trips);
    }

    // GET /trips/driver/{driverId} - Get trips for a driver
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<TripDTO>> getTripsForDriver(@PathVariable Long driverId) {
        List<TripDTO> trips = tripService.getTripsByDriver(driverId);
        return ResponseEntity.ok(trips);
    }

}
