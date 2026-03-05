package com.swiftmove.tripservice.mapper;


import com.swiftmove.tripservice.dto.CreateTripDto;
import com.swiftmove.tripservice.dto.TripDTO;
import com.swiftmove.tripservice.model.Trip;

public class TripMapper {
    // Trip -> dto
    public static TripDTO toTripDTO(Trip trip) {
        return new TripDTO
                (
                trip.getId(),
                trip.getMoveRequestId(),
                trip.getMoveOfferId(),
                trip.getStatus()
        );

    }
    //Dto -> Trip
    public static Trip toTrip(TripDTO tripDTO) {
        Trip trip = new Trip();
        trip.setId(tripDTO.getId());
        trip.setMoveRequestId(tripDTO.getMoveRequestId());
        trip.setMoveOfferId(tripDTO.getMoveOfferId());
        trip.setStatus(tripDTO.getStatus());
        return trip;
    }

    public static Trip createTripEntity(CreateTripDto createTripDto) {
        Trip trip = new Trip();
        trip.setMoveRequestId(createTripDto.getMoveRequestId());
        trip.setMoveOfferId(createTripDto.getMoveOfferId());
        trip.setStatus(createTripDto.getStatus());
        return trip;
    }
}
