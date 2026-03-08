package com.swiftmove.tripservice.repository;

import com.swiftmove.tripservice.model.MoveTrip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoveTripRepository extends JpaRepository<MoveTrip, Long> {
}
