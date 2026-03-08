package com.swiftmove.tripservice.mapper;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.model.MoveTrip;

public class Mapper {
    public static MoveTripDto toMoveTripDto(MoveTrip moveTrip)
    {
        return  new MoveTripDto(
                moveTrip.getId(),
                moveTrip.getMoveRequestId(),
                moveTrip.getMoveOfferId(),
                moveTrip.getStatus()
        );
    }
    public static MoveTrip createMoveTripEntity(CreateMoveTripDto moveTripDto)
    {
        MoveTrip moveTrip = new MoveTrip();

        moveTrip.setMoveRequestId(moveTripDto.getMoveRequestId());
        moveTrip.setMoveOfferId(moveTripDto.getMoveOfferId());
        moveTrip.setStatus(moveTripDto.getStatus());
        return moveTrip;
    }
}
