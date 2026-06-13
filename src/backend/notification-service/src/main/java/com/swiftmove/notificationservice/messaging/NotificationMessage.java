package com.swiftmove.notificationservice.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage {
    private String recipientId; // UserId
    private String type;        // MOVE_REQUEST_CREATED, OFFER_RECEIVED, TRIP_STATUS_UPDATED, etc.
    private String message;
    private Object payload;
}
