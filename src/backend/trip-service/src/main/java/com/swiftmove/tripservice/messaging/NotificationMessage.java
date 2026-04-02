package com.swiftmove.tripservice.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage {
    private String recipientId;
    private String type;
    private String message;
    private Object payload;
}
