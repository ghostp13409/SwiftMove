package com.swiftmove.tripservice.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(String recipientId, String type, String message, Object payload) {
        NotificationMessage notification = new NotificationMessage(recipientId, type, message, payload);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.key", notification);
    }
}
