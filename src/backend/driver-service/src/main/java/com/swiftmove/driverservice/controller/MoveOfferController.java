package com.swiftmove.driverservice.controller;

import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.services.IMoveOfferService;
import com.swiftmove.driverservice.services.MoveOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MoveOfferController {

    private final MoveOfferService moveOfferService;

    @Autowired
    public MoveOfferController(MoveOfferService moveOfferService) {
        this.moveOfferService = moveOfferService;
    }

    // GET /offers?driverId=1
    @GetMapping("/offers")
    public List<MoveOffer> getOffersByDriver(@RequestParam Long driverId) {
        return moveOfferService.getOffersByDriver(driverId);
    }

    // POST /offers
    @PostMapping("/offers")
    public MoveOffer createOffer(@RequestBody MoveOffer moveOffer) {
        return moveOfferService.createOffer(moveOffer);
    }

    // PUT /offers/{id}
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
}