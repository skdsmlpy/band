import { Client, Frame, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  message?: string;
}

export interface EquipmentUpdateMessage extends WebSocketMessage {
  equipment?: any;
}

export interface AssignmentUpdateMessage extends WebSocketMessage {
  assignment?: any;
}

export interface MaintenanceUpdateMessage extends WebSocketMessage {
  equipmentId: string;
  maintenanceType: string;
  scheduledDate: string;
}

export interface DashboardRefreshMessage extends WebSocketMessage {
  role: string;
}

export interface ErrorMessage {
  error: string;
  timestamp: string;
}

export type MessageHandler<T = WebSocketMessage> = (message: T) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private userToken: string | null = null;
  private isConnected = false;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.send = this.send.bind(this);
  }

  async connect(token?: string): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        if (token) {
          this.userToken = token;
        }

        // Use SockJS for better browser compatibility
        const socket = new SockJS(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/ws`
        );

        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: this.userToken ? `Bearer ${this.userToken}` : '',
          },
          debug: (str) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('WebSocket Debug:', str);
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame: Frame) => {
            console.log('WebSocket connected:', frame);
            this.isConnected = true;
            resolve();
          },
          onStompError: (frame: Frame) => {
            console.error('WebSocket STOMP error:', frame.headers['message'], frame.body);
            reject(new Error(`WebSocket STOMP error: ${frame.headers['message']}`));
          },
          onWebSocketError: (event) => {
            console.error('WebSocket error:', event);
            reject(new Error('WebSocket connection failed'));
          },
          onDisconnect: (frame: Frame) => {
            console.log('WebSocket disconnected:', frame);
            this.isConnected = false;
            this.connectionPromise = null;
          },
        });

        this.client.activate();
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((subscription, key) => {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
      });
      
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.connectionPromise = null;
    }
  }

  async subscribe<T = WebSocketMessage>(
    destination: string, 
    handler: MessageHandler<T>,
    headers?: Record<string, string>
  ): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('WebSocket client not initialized');
    }

    // Unsubscribe if already subscribed to this destination
    if (this.subscriptions.has(destination)) {
      this.subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as T;
        handler(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }, headers);

    this.subscriptions.set(destination, subscription);
  }

  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  async send(destination: string, body: any, headers?: Record<string, string>): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('WebSocket client not initialized');
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }

  // Equipment-specific methods
  async subscribeToEquipmentUpdates(handler: MessageHandler<EquipmentUpdateMessage>): Promise<void> {
    await this.subscribe('/topic/equipment/updates', handler);
    
    // Send subscription message to confirm
    await this.send('/app/equipment/subscribe', { action: 'subscribe' });
  }

  async updateEquipmentStatus(equipmentId: string, newStatus: string): Promise<void> {
    await this.send(`/app/equipment/${equipmentId}/status`, {
      equipmentId,
      newStatus,
    });
  }

  async checkoutEquipment(checkout: {
    qrCode: string;
    studentId: string;
    eventId?: string;
    expectedReturnDate: string;
    purpose: string;
  }): Promise<void> {
    await this.send('/app/assignment/checkout', checkout);
  }

  async returnEquipment(returnData: {
    assignmentId: string;
    returnCondition: string;
    damageNotes?: string;
    returnedById: string;
  }): Promise<void> {
    await this.send('/app/assignment/return', returnData);
  }

  async scheduleMaintenance(maintenance: {
    equipmentId: string;
    maintenanceType: string;
    scheduledDate: string;
    notes?: string;
  }): Promise<void> {
    await this.send('/app/maintenance/schedule', maintenance);
  }

  // Role-based dashboard subscriptions
  async subscribeToStudentUpdates(userId: string, handler: MessageHandler): Promise<void> {
    await this.subscribe(`/user/${userId}/queue/assignments/updates`, handler);
    await this.subscribe(`/user/${userId}/queue/equipment/updates`, handler);
    await this.subscribe(`/user/${userId}/queue/dashboard/refresh`, handler);
  }

  async subscribeToDirectorUpdates(handler: MessageHandler): Promise<void> {
    await this.subscribe('/topic/director/assignments', handler);
    await this.subscribe('/topic/director/maintenance', handler);
    await this.subscribe('/topic/director/dashboard/refresh', handler);
  }

  async subscribeToEquipmentManagerUpdates(handler: MessageHandler): Promise<void> {
    await this.subscribe('/topic/equipment-manager/assignments', handler);
    await this.subscribe('/topic/equipment-manager/maintenance', handler);
    await this.subscribe('/topic/equipment-manager/updates', handler);
    await this.subscribe('/topic/equipment-manager/dashboard/refresh', handler);
  }

  async subscribeToSupervisorUpdates(handler: MessageHandler): Promise<void> {
    await this.subscribe('/topic/supervisor/approvals', handler);
    await this.subscribe('/topic/supervisor/dashboard/refresh', handler);
  }

  async subscribeToErrorMessages(userId: string, handler: MessageHandler<ErrorMessage>): Promise<void> {
    await this.subscribe(`/user/${userId}/queue/errors`, handler);
  }

  async refreshDashboard(role: string): Promise<void> {
    await this.send('/app/dashboard/refresh', { role });
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (this.connectionPromise && !this.isConnected) {
      return 'connecting';
    }
    return this.isConnected ? 'connected' : 'disconnected';
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();

// React hook for WebSocket functionality
import { useEffect, useState } from 'react';

export interface WebSocketState {
  isConnected: boolean;
  status: 'connected' | 'disconnected' | 'connecting';
  error: string | null;
}

export function useWebSocket(token?: string): WebSocketState & {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: <T = WebSocketMessage>(destination: string, handler: MessageHandler<T>) => Promise<void>;
  unsubscribe: (destination: string) => void;
  send: (destination: string, body: any) => Promise<void>;
} {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    status: 'disconnected',
    error: null,
  });

  const connect = async () => {
    try {
      setState(prev => ({ ...prev, status: 'connecting', error: null }));
      await webSocketService.connect(token);
      setState(prev => ({ ...prev, isConnected: true, status: 'connected' }));
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  };

  const disconnect = () => {
    webSocketService.disconnect();
    setState({ isConnected: false, status: 'disconnected', error: null });
  };

  useEffect(() => {
    // Update connection status periodically
    const interval = setInterval(() => {
      const isConnected = webSocketService.isWebSocketConnected();
      const status = webSocketService.getConnectionStatus();
      
      setState(prev => ({
        ...prev,
        isConnected,
        status,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    subscribe: webSocketService.subscribe.bind(webSocketService),
    unsubscribe: webSocketService.unsubscribe.bind(webSocketService),
    send: webSocketService.send.bind(webSocketService),
  };
}

// Equipment-specific hooks
export function useEquipmentWebSocket(token?: string) {
  const webSocket = useWebSocket(token);
  
  const subscribeToEquipmentUpdates = (handler: MessageHandler<EquipmentUpdateMessage>) => {
    return webSocketService.subscribeToEquipmentUpdates(handler);
  };

  const updateEquipmentStatus = (equipmentId: string, newStatus: string) => {
    return webSocketService.updateEquipmentStatus(equipmentId, newStatus);
  };

  const checkoutEquipment = (checkout: Parameters<typeof webSocketService.checkoutEquipment>[0]) => {
    return webSocketService.checkoutEquipment(checkout);
  };

  const returnEquipment = (returnData: Parameters<typeof webSocketService.returnEquipment>[0]) => {
    return webSocketService.returnEquipment(returnData);
  };

  const scheduleMaintenance = (maintenance: Parameters<typeof webSocketService.scheduleMaintenance>[0]) => {
    return webSocketService.scheduleMaintenance(maintenance);
  };

  return {
    ...webSocket,
    subscribeToEquipmentUpdates,
    updateEquipmentStatus,
    checkoutEquipment,
    returnEquipment,
    scheduleMaintenance,
  };
}

// Role-based dashboard hooks
export function useRoleBasedWebSocket(role: string, userId?: string, token?: string) {
  const webSocket = useWebSocket(token);
  
  const subscribeToRoleUpdates = async (handler: MessageHandler) => {
    switch (role.toUpperCase()) {
      case 'STUDENT':
        if (userId) {
          await webSocketService.subscribeToStudentUpdates(userId, handler);
        }
        break;
      case 'BAND_DIRECTOR':
        await webSocketService.subscribeToDirectorUpdates(handler);
        break;
      case 'EQUIPMENT_MANAGER':
        await webSocketService.subscribeToEquipmentManagerUpdates(handler);
        break;
      case 'SUPERVISOR':
        await webSocketService.subscribeToSupervisorUpdates(handler);
        break;
    }
  };

  const refreshDashboard = () => {
    return webSocketService.refreshDashboard(role);
  };

  const subscribeToErrorMessages = (handler: MessageHandler<ErrorMessage>) => {
    if (userId) {
      return webSocketService.subscribeToErrorMessages(userId, handler);
    }
  };

  return {
    ...webSocket,
    subscribeToRoleUpdates,
    refreshDashboard,
    subscribeToErrorMessages,
  };
}