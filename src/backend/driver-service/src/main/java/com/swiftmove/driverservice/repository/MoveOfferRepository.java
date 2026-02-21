package com.swiftmove.driverservice.repository;

import com.swiftmove.driverservice.model.DriverInfo;
import com.swiftmove.driverservice.model.MoveOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MoveOfferRepository extends JpaRepository<MoveOffer, Long> {
    // GET /offers   Get offers for driver
    List<MoveOffer> findByDriverId(Long driverId);

    // GET /move-requests/{id}/offers  Get offers for request
    List<MoveOffer> findByMoveRequestId(Long moveRequestId);

}