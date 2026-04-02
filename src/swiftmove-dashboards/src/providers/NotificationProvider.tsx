import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import SockJS from 'sockjs-client/dist/sockjs';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { API_BASE_URL } from '@/config/api';

interface NotificationMessage {
  recipientId: string;
  type: string;
  message: string;
  payload: any;
}

interface NotificationContextType {
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const userId = authService.getUserId();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Connect to notification-service via api-gateway
    // We pass userId as a query parameter for the custom HandshakeHandler in the backend
    const socket = new SockJS(`${API_BASE_URL}/ws-notifications?userId=${userId}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('STOMP:', msg);
        }
      },
      onConnect: () => {
        setIsConnected(true);
        console.log('Successfully connected to WebSocket for user:', userId);
        
        // Subscribe to user-specific notifications
        stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          console.log('Received user notification:', message.body);
          const notification: NotificationMessage = JSON.parse(message.body);
          handleNotification(notification);
        });

        // Optional: subscribe to global updates
        stompClient.subscribe('/topic/global-updates', (message) => {
          console.log('Received global notification:', message.body);
          const notification: NotificationMessage = JSON.parse(message.body);
          handleNotification(notification);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('Disconnected from WebSocket');
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [userId]);

  const handleNotification = (notification: NotificationMessage) => {
    console.log('Received notification:', notification);
    
    // Invalidate queries to refresh data based on notification type
    if (notification.type.includes('OFFER')) {
      queryClient.invalidateQueries({ queryKey: ['clientOffers'] });
      queryClient.invalidateQueries({ queryKey: ['driverOffers'] });
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
    } else if (notification.type.includes('TRIP')) {
      queryClient.invalidateQueries({ queryKey: ['clientTrips'] });
      queryClient.invalidateQueries({ queryKey: ['driverTrips'] });
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
    } else if (notification.type.includes('REQUEST')) {
      queryClient.invalidateQueries({ queryKey: ['clientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableRequests'] });
    }

    // Show toast based on notification type
    toast(notification.type.replace(/_/g, ' '), {
      description: notification.message,
      duration: 5000,
    });
  };

  return (
    <NotificationContext.Provider value={{ isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
};
