package com.swiftmove.driverservice.services;
import java.util.List;

import com.swiftmove.driverservice.model.MoveOffer;


public interface IMoveOfferService {
    // GET
    List<MoveOffer> getOffersByDriver(Long driverId);

    // POST
    MoveOffer createOffer(MoveOffer moveOffer);

    // PUT
    MoveOffer updateOffer(Long id, MoveOffer moveOffer);

    // DELETE
    void deleteOffer(Long id);

    // GET
    List<MoveOffer> getOffersByMoveRequest(Long moveRequestId);

    // PUT
    MoveOffer acceptOffer(Long id);

}
