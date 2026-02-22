package com.swiftMove.tripManagement_service.mapper;

import com.swiftMove.tripManagement_service.dto.TripDTO;
import com.swiftMove.tripManagement_service.model.Trip;

public class TripMapper {
    // Trip -> dto
    public static TripDTO toTripDTO(Trip trip) {
        return new TripDTO
                (
                trip.getId(),
                trip.getMoveRequestId(),
                trip.getMoveOfferId(),
                trip.getStatus(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );

    }
    //Dto -> Trip
    public static Trip toTrip(TripDTO tripDTO) {
        Trip trip = new Trip();
        trip.setId(tripDTO.getId());
        trip.setMoveRequestId(tripDTO.getMoveRequestId());
        trip.setMoveOfferId(tripDTO.getMoveOfferId());
        trip.setStatus(tripDTO.getStatus());
        trip.setCreatedAt(tripDTO.getCreatedAt());
        trip.setUpdatedAt(tripDTO.getUpdatedAt());
        return trip;
    }
}
