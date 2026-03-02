package com.swiftmove.driverservice.services;

import com.swiftmove.driverservice.model.MoveOffer;
import com.swiftmove.driverservice.repository.MoveOfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
        MoveOffer existingOffer = moveOfferRepository.findById(id)
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
        MoveOffer offer = moveOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setStatusId(2L); // accepted status
        return moveOfferRepository.save(offer);
    }

    @Override
    public void deleteOffer(Long id) {
        moveOfferRepository.deleteById(id);
    }

    public List<MoveOffer> getAllOffers() {
        return moveOfferRepository.findAll();
    }

    public MoveOffer getOfferById(Long id) {
        return moveOfferRepository.findById(id).orElse(null);
    }
}
