package com.swiftmove.driverservice.repository;

import com.swiftmove.driverservice.model.MoveOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoveOfferRepository extends JpaRepository<MoveOffer, Long> {
    List<MoveOffer> findMoveOfferByMoveRequestId(Long moveRequestId);
    List<MoveOffer> findMoveOfferByDriverId(Long driverId);
}
