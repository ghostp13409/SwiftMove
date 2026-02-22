package com.swiftmove.driverservice.services;
import com.swiftmove.driverservice.model.MoveOffer;

import java.util.List;


public interface IMoveOfferService {
    // GET
    List<MoveOffer> getOffersByDriver(Long driverId);

    // POST
    MoveOffer createOffer(MoveOffer moveOffer);

    // PUT
    MoveOffer updateOffer(Long id, MoveOffer moveOffer);

    // GET
    List<MoveOffer> getOffersByMoveRequest(Long moveRequestId);

    // PUT
    MoveOffer acceptOffer(Long id);

}