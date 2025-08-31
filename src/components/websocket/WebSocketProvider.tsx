'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  webSocketService, 
  WebSocketState, 
  MessageHandler, 
  EquipmentUpdateMessage, 
  AssignmentUpdateMessage,
  ErrorMessage 
} from '@/lib/websocket';
import { toast } from 'react-hot-toast';

interface WebSocketContextType extends WebSocketState {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribeToEquipmentUpdates: (handler: MessageHandler<EquipmentUpdateMessage>) => Promise<void>;
  subscribeToRoleUpdates: (handler: MessageHandler) => Promise<void>;
  updateEquipmentStatus: (equipmentId: string, newStatus: string) => Promise<void>;
  checkoutEquipment: (checkout: any) => Promise<void>;
  returnEquipment: (returnData: any) => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    status: 'disconnected',
    error: null,
  });

  const [notifications, setNotifications] = useState<any[]>([]);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    // Only connect in production or if explicitly enabled in development
    if (user && token && state.status === 'disconnected' && process.env.NODE_ENV === 'production') {
      connect();
    }
  }, [user, token]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const connect = async () => {
    if (!token) {
      console.warn('No authentication token available for WebSocket connection');
      return;
    }

    try {
      setState(prev => ({ ...prev, status: 'connecting', error: null }));
      
      await webSocketService.connect(token);
      
      setState({
        isConnected: true,
        status: 'connected',
        error: null,
      });

      // Subscribe to error messages for the current user
      if (user?.email) {
        await webSocketService.subscribeToErrorMessages(user.email, handleErrorMessage);
      }

      // Auto-subscribe to role-based updates
      if (user?.role) {
        await subscribeToRoleBasedUpdates();
      }

      toast.success('Connected to real-time updates');
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setState({
        isConnected: false,
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Connection failed',
      });
      
      toast.error('Failed to connect to real-time updates');
    }
  };

  const disconnect = () => {
    webSocketService.disconnect();
    setState({
      isConnected: false,
      status: 'disconnected',
      error: null,
    });
    setNotifications([]);
  };

  const handleErrorMessage = (errorMessage: ErrorMessage) => {
    console.error('WebSocket error message:', errorMessage.error);
    toast.error(errorMessage.error);
  };

  const handleGeneralUpdate = (message: any) => {
    // Add to notifications queue
    setNotifications(prev => [
      ...prev.slice(-19), // Keep last 20 notifications
      {
        id: Date.now() + Math.random(),
        message: message.message || 'System update received',
        type: message.type || 'info',
        timestamp: new Date(message.timestamp),
        data: message,
      }
    ]);

    // Show toast notification based on message type
    switch (message.type) {
      case 'EQUIPMENT_CHECKED_OUT':
        toast.success(`Equipment checked out: ${message.assignment?.equipment?.qrCode}`);
        break;
      case 'EQUIPMENT_RETURNED':
        toast.success(`Equipment returned: ${message.assignment?.equipment?.qrCode}`);
        break;
      case 'STATUS_UPDATED':
        toast.success(`Equipment status updated: ${message.equipment?.qrCode}`);
        break;
      case 'MAINTENANCE_SCHEDULED':
        toast.success('Maintenance scheduled successfully');
        break;
      case 'DASHBOARD_REFRESH':
        // Don't show toast for dashboard refresh
        break;
      default:
        if (message.message) {
          toast.success(message.message);
        }
    }
  };

  const subscribeToRoleBasedUpdates = async () => {
    if (!user?.role) return;

    const role = user.role.toUpperCase();
    
    try {
      switch (role) {
        case 'STUDENT':
          await webSocketService.subscribeToStudentUpdates(user.email, handleGeneralUpdate);
          break;
        case 'BAND_DIRECTOR':
          await webSocketService.subscribeToDirectorUpdates(handleGeneralUpdate);
          break;
        case 'EQUIPMENT_MANAGER':
          await webSocketService.subscribeToEquipmentManagerUpdates(handleGeneralUpdate);
          break;
        case 'SUPERVISOR':
          await webSocketService.subscribeToSupervisorUpdates(handleGeneralUpdate);
          break;
      }
    } catch (error) {
      console.error('Failed to subscribe to role-based updates:', error);
    }
  };

  const subscribeToEquipmentUpdates = async (handler: MessageHandler<EquipmentUpdateMessage>) => {
    await webSocketService.subscribeToEquipmentUpdates(handler);
  };

  const subscribeToRoleUpdates = async (handler: MessageHandler) => {
    if (!user?.role) return;
    
    const role = user.role.toUpperCase();
    
    switch (role) {
      case 'STUDENT':
        if (user.email) {
          await webSocketService.subscribeToStudentUpdates(user.email, handler);
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

  const updateEquipmentStatus = async (equipmentId: string, newStatus: string) => {
    await webSocketService.updateEquipmentStatus(equipmentId, newStatus);
  };

  const checkoutEquipment = async (checkout: any) => {
    await webSocketService.checkoutEquipment(checkout);
  };

  const returnEquipment = async (returnData: any) => {
    await webSocketService.returnEquipment(returnData);
  };

  const refreshDashboard = async () => {
    if (user?.role) {
      await webSocketService.refreshDashboard(user.role);
    }
  };

  const contextValue: WebSocketContextType = {
    ...state,
    connect,
    disconnect,
    subscribeToEquipmentUpdates,
    subscribeToRoleUpdates,
    updateEquipmentStatus,
    checkoutEquipment,
    returnEquipment,
    refreshDashboard,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      <WebSocketConnectionIndicator 
        status={state.status} 
        error={state.error} 
        onReconnect={connect}
      />
      <NotificationCenter 
        notifications={notifications} 
        onClear={() => setNotifications([])}
      />
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}

// Connection status indicator component
interface WebSocketConnectionIndicatorProps {
  status: 'connected' | 'disconnected' | 'connecting';
  error: string | null;
  onReconnect: () => void;
}

function WebSocketConnectionIndicator({ status, error, onReconnect }: WebSocketConnectionIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show indicator when not connected
    setVisible(status !== 'connected');
    
    // Auto-hide after successful connection
    if (status === 'connected') {
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Real-time updates connected';
      case 'connecting': return 'Connecting to real-time updates...';
      case 'disconnected': return error ? `Connection failed: ${error}` : 'Real-time updates disconnected';
      default: return 'Unknown connection status';
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-in-right">
      <div className={`
        px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium
        backdrop-blur-sm bg-opacity-90 border border-white/20
        ${getStatusColor()}
      `}>
        <div className="flex items-center space-x-2">
          <div className={`
            w-2 h-2 rounded-full
            ${status === 'connecting' ? 'animate-pulse' : ''}
            ${status === 'connected' ? 'bg-white' : 'bg-white/70'}
          `} />
          <span>{getStatusText()}</span>
          {status === 'disconnected' && (
            <button
              onClick={onReconnect}
              className="ml-2 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Notification center component
interface NotificationCenterProps {
  notifications: any[];
  onClear: () => void;
}

function NotificationCenter({ notifications, onClear }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V7l5-5 5 5v10z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Updates</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{notifications.length} updates</span>
              <button
                onClick={onClear}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {notifications.slice().reverse().map((notification) => (
              <div key={notification.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="text-sm text-gray-900 dark:text-white font-medium">
                  {notification.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}