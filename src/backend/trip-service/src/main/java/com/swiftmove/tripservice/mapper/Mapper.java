package com.swiftmove.tripservice.mapper;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.model.MoveStatus;
import com.swiftmove.tripservice.model.MoveTrip;

public class Mapper {
    public static MoveTripDto toMoveTripDto(MoveTrip moveTrip)
    {
        return  new MoveTripDto(
                moveTrip.getId(),
                moveTrip.getMoveRequestId(),
                moveTrip.getMoveOfferId(),
                moveTrip.getStatus() != null ? moveTrip.getStatus().name() : null
        );
    }
    public static MoveTrip createMoveTripEntity(CreateMoveTripDto moveTripDto)
    {
        MoveTrip moveTrip = new MoveTrip();

        moveTrip.setMoveRequestId(moveTripDto.getMoveRequestId());
        moveTrip.setMoveOfferId(moveTripDto.getMoveOfferId());
        if (moveTripDto.getStatus() != null) {
            moveTrip.setStatus(MoveStatus.valueOf(moveTripDto.getStatus()));
        }
        return moveTrip;
    }
}
