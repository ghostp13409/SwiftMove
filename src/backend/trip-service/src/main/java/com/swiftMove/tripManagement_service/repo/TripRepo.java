package com.swiftMove.tripManagement_service.repo;

import com.swiftMove.tripManagement_service.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepo extends JpaRepository<Trip,Long> {
}
