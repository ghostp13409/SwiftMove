package com.swiftmove.tripservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.swiftmove.tripservice.dto.CreateMoveTripDto;
import com.swiftmove.tripservice.dto.DriverInfoDto;
import com.swiftmove.tripservice.dto.MoveTripDto;
import com.swiftmove.tripservice.dto.MoveRequestDto;
import com.swiftmove.tripservice.dto.MoveOfferDto;
import com.swiftmove.tripservice.mapper.Mapper;
import com.swiftmove.tripservice.model.MoveStatus;
import com.swiftmove.tripservice.model.MoveTrip;
import com.swiftmove.tripservice.repository.MoveTripRepository;
import com.swiftmove.tripservice.client.ClientServiceClient;
import com.swiftmove.tripservice.client.DriverServiceClient;
import com.swiftmove.tripservice.client.UserServiceClient;
import com.swiftmove.tripservice.messaging.NotificationService;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoveTripService {

    private final MoveTripRepository moveTripRepository;
    private final ClientServiceClient clientServiceClient;
    private final DriverServiceClient driverServiceClient;
    private final UserServiceClient userServiceClient;
    private final NotificationService notificationService;

    public List<MoveTripDto> getAll() {
        return moveTripRepository
                .findAll()
                .stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public List<MoveTripDto> getByClientId(Long clientId) {
        List<MoveRequestDto> requests = clientServiceClient.getMoveRequestsByClientId(clientId);
        if (requests == null || requests.isEmpty())
            return List.of();

        List<Long> requestIds = requests.stream().map(MoveRequestDto::getId).toList();
        return moveTripRepository.findByMoveRequestIdIn(requestIds).stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public List<MoveTripDto> getByDriverId(Long driverId) {
        List<MoveOfferDto> offers = driverServiceClient.getMoveOffersByDriverId(driverId);
        if (offers == null || offers.isEmpty())
            return List.of();

        List<Long> offerIds = offers.stream().map(MoveOfferDto::getId).toList();
        return moveTripRepository.findByMoveOfferIdIn(offerIds).stream()
                .map(Mapper::toMoveTripDto)
                .toList();
    }

    public MoveTripDto getById(Long id) {
        MoveTrip moveTrip = moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));
        return Mapper.toMoveTripDto(moveTrip);
    }

    public MoveTripDto add(CreateMoveTripDto newMoveTripDto) {
        try {
            validate(newMoveTripDto);
            MoveTrip newMoveTrip = Mapper.createMoveTripEntity(newMoveTripDto);
            newMoveTrip = moveTripRepository.save(newMoveTrip);
            return Mapper.toMoveTripDto(newMoveTrip);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to create MoveTrip: " + ex.getMessage(), ex);
        }

    }

    public MoveTripDto updateStatus(Long id, String status) {
        MoveTrip trip = moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));

        MoveStatus newStatus = MoveStatus.valueOf(status);
        MoveStatus currentStatus = trip.getStatus();

        // Enforce Flow as per demo_flow.md
        if (newStatus == MoveStatus.SCHEDULED) {
            if (currentStatus != MoveStatus.PAYMENT_PENDING) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Trip must be in PAYMENT_PENDING to become SCHEDULED");
            }
        } else if (newStatus == MoveStatus.IN_PROGRESS) {
            if (currentStatus != MoveStatus.SCHEDULED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Trip must be SCHEDULED to become IN_PROGRESS");
            }
        } else if (newStatus == MoveStatus.DRIVER_COMPLETED || newStatus == MoveStatus.COMPLETED_BY_DRIVER) {
            if (currentStatus != MoveStatus.IN_PROGRESS) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Trip must be IN_PROGRESS to be marked as completed by driver");
            }
            // Use DRIVER_COMPLETED for consistency
            newStatus = MoveStatus.DRIVER_COMPLETED;
        } else if (newStatus == MoveStatus.COMPLETED) {
            if (currentStatus != MoveStatus.DRIVER_COMPLETED && currentStatus != MoveStatus.COMPLETED_BY_DRIVER) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Move must be marked as completed by driver first.");
            }
        }

        trip.setStatus(newStatus);
        MoveTrip savedTrip = moveTripRepository.save(trip);

        // SEND NOTIFICATIONS
        try {
            if (newStatus == MoveStatus.SCHEDULED) {
                // Notify Client
                MoveRequestDto request = clientServiceClient.getMoveRequestById(trip.getMoveRequestId());
                if (request != null) {
                    notificationService.sendNotification(
                            request.getClientId().toString(),
                            "TRIP_SCHEDULED",
                            "Your payment was successful! Your move is now scheduled.",
                            Mapper.toMoveTripDto(savedTrip));
                }
                // Notify Driver
                MoveOfferDto offer = driverServiceClient.getMoveOfferById(trip.getMoveOfferId());
                if (offer != null) {
                    DriverInfoDto driverInfo = driverServiceClient.getDriverInfoByDriverId(offer.getDriverId());
                    if (driverInfo != null) {
                        notificationService.sendNotification(
                                driverInfo.getUserId().toString(),
                                "TRIP_SCHEDULED",
                                "Payment received for move #" + trip.getMoveRequestId() + ". It is now scheduled!",
                                Mapper.toMoveTripDto(savedTrip));
                    }
                }
            } else if (newStatus == MoveStatus.IN_PROGRESS || newStatus == MoveStatus.DRIVER_COMPLETED) {
                // Notify Client
                MoveRequestDto request = clientServiceClient.getMoveRequestById(trip.getMoveRequestId());
                if (request != null) {
                    notificationService.sendNotification(
                            request.getClientId().toString(),
                            "TRIP_STATUS_UPDATED",
                            "Your move is now " + newStatus.name().replace("_", " ").toLowerCase() + "!",
                            Mapper.toMoveTripDto(savedTrip));
                }
            } else if (newStatus == MoveStatus.COMPLETED) {
                // Notify Driver
                MoveOfferDto offer = driverServiceClient.getMoveOfferById(trip.getMoveOfferId());
                if (offer != null) {
                    DriverInfoDto driverInfo = driverServiceClient.getDriverInfoByDriverId(offer.getDriverId());
                    if (driverInfo != null) {
                        notificationService.sendNotification(
                                driverInfo.getUserId().toString(),
                                "TRIP_COMPLETED",
                                "The client has confirmed the completion of move #" + trip.getMoveRequestId() + "!",
                                Mapper.toMoveTripDto(savedTrip));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to send trip status notification: " + e.getMessage());
        }

        return Mapper.toMoveTripDto(savedTrip);
    }

    public void delete(Long id) {
        MoveTrip trip = moveTripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Move Trip Not Found"));

        // 1. Delete Move Offer
        try {
            driverServiceClient.deleteMoveOffer(trip.getMoveOfferId());
        } catch (Exception e) {
            System.err.println("Failed to delete MoveOffer: " + e.getMessage());
        }

        // 2. Delete Move Request
        try {
            clientServiceClient.deleteMoveRequest(trip.getMoveRequestId());
        } catch (Exception e) {
            System.err.println("Failed to delete MoveRequest: " + e.getMessage());
        }

        // 3. Delete the Trip itself
        moveTripRepository.delete(trip);
    }

    private void validate(CreateMoveTripDto newMoveTripDto) {
        StringBuilder errorMessages = new StringBuilder();
        if (newMoveTripDto.getMoveRequestId() == null)
            errorMessages.append("Move Request Id is required");
        if (newMoveTripDto.getMoveOfferId() == null)
            errorMessages.append("Move Offer Id is required");
        if (newMoveTripDto.getStatus() == null || newMoveTripDto.getStatus().trim().isEmpty())
            errorMessages.append("Status is required");
        if (!errorMessages.isEmpty())
            throw new IllegalArgumentException(errorMessages.toString());
    }
}
