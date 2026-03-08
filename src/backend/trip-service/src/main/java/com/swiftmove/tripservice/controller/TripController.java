package com.swiftmove.tripservice.controller;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.service.MoveTripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
class TripController {

    private final MoveTripService moveTripService;

    // For Admin: GET /trips - get all trips
    @GetMapping
    public ResponseEntity<List<MoveTripDto>> getAll()
    {
        List<MoveTripDto> trips = moveTripService.getAll();
        return ResponseEntity.ok(trips);
    }
    //Get By ID
    @GetMapping("/{id}")
    public ResponseEntity<MoveTripDto> getById(@PathVariable Long id)
    {
        MoveTripDto trip = moveTripService.getById(id);
        if (trip == null)
            return ResponseEntity.notFound().build();
      return  ResponseEntity.ok(moveTripService.getById(id));
    }
    //Create a new Move Trip
    @PostMapping
    public ResponseEntity<MoveTripDto> create(@RequestBody CreateMoveTripDto newMoveTrip)
    {
        try {
            MoveTripDto createdTrip = moveTripService.add(newMoveTrip);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTrip);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<MoveTripDto>> getByClientId(@PathVariable Long clientId) {
        // For now, return all trips as we don't store clientId in move_trips table
        // and would need to call client-service for each trip to filter.
        // In a real app, we'd store clientId in the trip table or use a join.
        return ResponseEntity.ok(moveTripService.getAll());
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<MoveTripDto>> getByDriverId(@PathVariable Long driverId) {
        return ResponseEntity.ok(moveTripService.getAll());
    }

    @GetMapping("/allTrips")
    public ResponseEntity<List<MoveTripDto>> getAllTrips() {
        return ResponseEntity.ok(moveTripService.getAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MoveTripDto> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(moveTripService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
