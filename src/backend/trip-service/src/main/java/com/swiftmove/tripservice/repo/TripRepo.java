package com.swiftmove.tripservice.repo;

import com.swiftmove.tripservice.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepo extends JpaRepository<Trip,Long> {
}
