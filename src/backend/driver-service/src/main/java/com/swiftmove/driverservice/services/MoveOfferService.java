package com.swiftmove.driverservice.services;

import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.repository.MoveOfferRepository;

import java.util.List;

public class MoveOfferService implements IMoveOfferService {
    private final MoveOfferRepository moveOfferRepository;

    public MoveOfferService(MoveOfferRepository moveOfferRepository) {
        this.moveOfferRepository = moveOfferRepository;
    }

    @Override
    public List<MoveOffer> getOffersByDriver(Long driverId) {
        return moveOfferRepository.findByDriverId(driverId);
    }

    @Override
    public MoveOffer createOffer(MoveOffer moveOffer) {
        return moveOfferRepository.save(moveOffer);
    }

    @Override
    public MoveOffer updateOffer(Long id, MoveOffer moveOffer) {
        MoveOffer existingOffer = moveOfferRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        existingOffer.setPrice(moveOffer.getPrice());
        existingOffer.setOfferedDate(moveOffer.getOfferedDate());
        existingOffer.setVehicleId(moveOffer.getVehicleId());
        existingOffer.setStatusId(moveOffer.getStatusId());

        return moveOfferRepository.save(existingOffer);
    }

    @Override
    public List<MoveOffer> getOffersByMoveRequest(Long moveRequestId) {
        return moveOfferRepository.findByMoveRequestId(moveRequestId);
    }

    @Override
    public MoveOffer acceptOffer(Long id) {
        MoveOffer offer = moveOfferRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        // Example: 2 = ACCEPTED (you can replace with constant later)
        offer.setStatusId(2L);

        return moveOfferRepository.save(offer);
    }
}
