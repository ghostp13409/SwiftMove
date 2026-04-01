package com.swiftmove.tripservice.controller;

import com.swiftmove.tripservice.dto.*;
import com.swiftmove.tripservice.service.MoveMatchingService;
import com.swiftmove.tripservice.service.MoveSuggestionService;
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
    private final MoveSuggestionService moveSuggestionService;
    private final MoveMatchingService moveMatchingService;

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
        return ResponseEntity.ok(moveTripService.getByClientId(clientId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<MoveTripDto>> getByDriverId(@PathVariable Long driverId) {
        return ResponseEntity.ok(moveTripService.getByDriverId(driverId));
    }

    @GetMapping("/allTrips")
    public ResponseEntity<List<MoveTripDto>> getAllTrips() {
        return ResponseEntity.ok(moveTripService.getAll());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<MoveTripDto> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(moveTripService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        try {
            moveTripService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/browse-requests")
    public ResponseEntity<List<MoveRequestDto>> browseRequests(@RequestParam Long driverId) {
        try {
            return ResponseEntity.ok(moveMatchingService.getMatchingRequestsForDriver(driverId));
        } catch (Exception e) {
            System.err.println("Error browsing requests for driver " + driverId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(null);
        }
    }

    @PostMapping("/suggest-budget")
    public ResponseEntity<BudgetSuggestionResponse> suggestBudget(@RequestBody BudgetSuggestionRequest request) {
        try {
            BudgetSuggestionResponse response = moveSuggestionService.suggestBudget(request);
            if (response == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error suggesting budget: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(null);
        }
    }
}
