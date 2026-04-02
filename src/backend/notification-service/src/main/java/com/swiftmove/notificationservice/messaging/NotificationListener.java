package com.swiftmove.notificationservice.messaging;

import com.swiftmove.notificationservice.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void handleNotification(NotificationMessage message) {
        log.info("Received notification for user {}: {}", message.getRecipientId(), message.getMessage());
        
        // Push to specific user via WebSocket
        // Clients/Drivers subscribe to /user/queue/notifications
        messagingTemplate.convertAndSendToUser(
                message.getRecipientId(),
                "/queue/notifications",
                message
        );

        // Optional: Broadcast to a topic if needed
        messagingTemplate.convertAndSend("/topic/global-updates", message);
    }
}
