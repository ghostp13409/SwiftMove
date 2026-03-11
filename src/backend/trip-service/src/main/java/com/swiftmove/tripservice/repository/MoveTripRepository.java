package com.swiftmove.tripservice.repository;

import com.swiftmove.tripservice.model.MoveTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoveTripRepository extends JpaRepository<MoveTrip, Long> {
    List<MoveTrip> findByMoveRequestIdIn(List<Long> moveRequestIds);
    List<MoveTrip> findByMoveOfferIdIn(List<Long> moveOfferIds);
}
