package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.services.MoveOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/move-offer")
public class MoveOfferController {

    private final MoveOfferService moveOfferService;

    @Autowired
    public MoveOfferController(MoveOfferService moveOfferService) {
        this.moveOfferService = moveOfferService;
    }

    // GET /move-offer/driver/{driverId}
    @GetMapping("/driver/{driverId}")
    public List<MoveOffer> getOffersByDriver(@PathVariable Long driverId) {
        return moveOfferService.getOffersByDriver(driverId);
    }

    // POST /offers
    @PostMapping("/offers")
    public MoveOffer createOffer(@RequestBody MoveOffer moveOffer) {
        return moveOfferService.createOffer(moveOffer);
    }

    //PUT /offers/{id}
    @PutMapping("/offers/{id}")
    public MoveOffer updateOffer(@PathVariable Long id,
                                 @RequestBody MoveOffer moveOffer) {
        return moveOfferService.updateOffer(id, moveOffer);
    }

    // GET /move-requests/{id}/offers
    @GetMapping("/move-requests/{id}/offers")
    public List<MoveOffer> getOffersByMoveRequest(@PathVariable Long id) {
        return moveOfferService.getOffersByMoveRequest(id);
    }

    // PUT /offers/{id}/accept
    @PutMapping("/offers/{id}/accept")
    public MoveOffer acceptOffer(@PathVariable Long id) {
        return moveOfferService.acceptOffer(id);
    }

    @GetMapping("/move-offers/test")
    public String test() {
        return "Move Offer Service is up and running!";
    }

    // DELETE /move-offer/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        moveOfferService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
}
