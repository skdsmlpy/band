'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useWebSocketContext } from '@/components/websocket/WebSocketProvider';
import { EquipmentUpdateMessage, AssignmentUpdateMessage } from '@/lib/websocket';
import { toast } from 'react-hot-toast';

interface Equipment {
  id: string;
  qrCode: string;
  make: string;
  model: string;
  category: string;
  status: string;
  condition: string;
  assignedTo?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  location?: string;
  purchasePrice?: number;
}

interface Assignment {
  id: string;
  equipment: Equipment;
  student: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  checkoutDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  purpose?: string;
}

interface RealTimeEquipmentManagerProps {
  onEquipmentUpdate?: (equipment: Equipment) => void;
  onAssignmentUpdate?: (assignment: Assignment) => void;
  children: React.ReactNode;
}

export function RealTimeEquipmentManager({ 
  onEquipmentUpdate, 
  onAssignmentUpdate, 
  children 
}: RealTimeEquipmentManagerProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const webSocket = useWebSocketContext();
  
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Handle equipment updates
  const handleEquipmentUpdate = useCallback((message: EquipmentUpdateMessage) => {
    console.log('Equipment update received:', message);
    
    setRecentUpdates(prev => [
      ...prev.slice(-9), // Keep last 10 updates
      {
        id: Date.now() + Math.random(),
        type: 'equipment',
        message: message.message,
        timestamp: new Date(message.timestamp),
        data: message.equipment,
      }
    ]);

    if (message.equipment && onEquipmentUpdate) {
      onEquipmentUpdate(message.equipment);
    }

    // Show different notifications based on update type
    switch (message.type) {
      case 'STATUS_UPDATED':
        if (message.equipment) {
          showEquipmentStatusNotification(message.equipment, message.type);
        }
        break;
      case 'CONDITION_CHANGED':
        if (message.equipment) {
          showEquipmentConditionNotification(message.equipment);
        }
        break;
      default:
        if (message.message) {
          toast.success(message.message);
        }
    }
  }, [onEquipmentUpdate]);

  // Handle assignment updates
  const handleAssignmentUpdate = useCallback((message: AssignmentUpdateMessage) => {
    console.log('Assignment update received:', message);
    
    setRecentUpdates(prev => [
      ...prev.slice(-9), // Keep last 10 updates
      {
        id: Date.now() + Math.random(),
        type: 'assignment',
        message: message.message,
        timestamp: new Date(message.timestamp),
        data: message.assignment,
      }
    ]);

    if (message.assignment && onAssignmentUpdate) {
      onAssignmentUpdate(message.assignment);
    }

    // Show different notifications based on update type
    switch (message.type) {
      case 'EQUIPMENT_CHECKED_OUT':
        if (message.assignment) {
          showCheckoutNotification(message.assignment);
        }
        break;
      case 'EQUIPMENT_RETURNED':
        if (message.assignment) {
          showReturnNotification(message.assignment);
        }
        break;
      case 'ASSIGNMENT_OVERDUE':
        if (message.assignment) {
          showOverdueNotification(message.assignment);
        }
        break;
      default:
        if (message.message) {
          toast.success(message.message);
        }
    }
  }, [onAssignmentUpdate]);

  // Subscribe to real-time updates when connected
  useEffect(() => {
    if (webSocket.isConnected && user) {
      setIsConnected(true);
      
      // Subscribe to equipment updates
      webSocket.subscribeToEquipmentUpdates(handleEquipmentUpdate)
        .catch(error => {
          console.error('Failed to subscribe to equipment updates:', error);
        });

      // Subscribe to role-based updates
      webSocket.subscribeToRoleUpdates(handleAssignmentUpdate)
        .catch(error => {
          console.error('Failed to subscribe to role updates:', error);
        });
    } else {
      setIsConnected(false);
    }
  }, [webSocket.isConnected, user, handleEquipmentUpdate, handleAssignmentUpdate]);

  // Auto-connect if not connected
  useEffect(() => {
    if (!webSocket.isConnected && user && webSocket.status === 'disconnected') {
      webSocket.connect().catch(error => {
        console.error('Failed to connect to WebSocket:', error);
      });
    }
  }, [webSocket, user]);

  const showEquipmentStatusNotification = (equipment: Equipment, updateType: string) => {
    const statusColors: Record<string, string> = {
      'AVAILABLE': '🟢',
      'CHECKED_OUT': '🟡',
      'IN_MAINTENANCE': '🔧',
      'RETIRED': '🔴',
    };

    const statusIcon = statusColors[equipment.status] || '📦';
    
    toast.success(
      `${statusIcon} ${equipment.make} ${equipment.model} (${equipment.qrCode}) is now ${equipment.status.toLowerCase()}`,
      { duration: 5000 }
    );
  };

  const showEquipmentConditionNotification = (equipment: Equipment) => {
    const conditionColors: Record<string, string> = {
      'EXCELLENT': '✨',
      'GOOD': '👍',
      'FAIR': '⚠️',
      'POOR': '🔧',
      'BROKEN': '❌',
    };

    const conditionIcon = conditionColors[equipment.condition] || '📦';
    
    toast(
      `${conditionIcon} Equipment condition updated: ${equipment.qrCode} is now in ${equipment.condition.toLowerCase()} condition`,
      { duration: 6000 }
    );
  };

  const showCheckoutNotification = (assignment: Assignment) => {
    const sectionIcons: Record<string, string> = {
      'BRASS': '🎺',
      'WOODWIND': '🎷',
      'PERCUSSION': '🥁',
      'STRING': '🎻',
      'ELECTRONIC': '🔌',
      'ACCESSORY': '🎵',
    };

    const categoryIcon = sectionIcons[assignment.equipment.category] || '🎵';
    
    toast.success(
      `${categoryIcon} ${assignment.student.firstName} checked out ${assignment.equipment.qrCode}`,
      { 
        duration: 4000,
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#059669',
        }
      }
    );
  };

  const showReturnNotification = (assignment: Assignment) => {
    const needsApproval = assignment.status === 'PENDING_RETURN';
    
    toast.success(
      `📥 ${assignment.student.firstName} returned ${assignment.equipment.qrCode}${needsApproval ? ' (pending approval)' : ''}`,
      { 
        duration: needsApproval ? 6000 : 4000,
        style: needsApproval ? {
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#D97706',
        } : undefined
      }
    );
  };

  const showOverdueNotification = (assignment: Assignment) => {
    toast.error(
      `⏰ OVERDUE: ${assignment.equipment.qrCode} assigned to ${assignment.student.firstName} ${assignment.student.lastName}`,
      { 
        duration: 8000,
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#DC2626',
        }
      }
    );
  };

  return (
    <div className="relative">
      {children}
      
      {/* Connection Status Indicator (only show when disconnected) */}
      {!isConnected && user && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-r-lg shadow-lg">
            <div className="flex items-center">
              <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <p className="text-sm font-medium">
                Real-time updates unavailable
              </p>
              <button
                onClick={() => webSocket.connect()}
                className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
              >
                Reconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Updates Panel (Development/Testing) */}
      {process.env.NODE_ENV === 'development' && recentUpdates.length > 0 && (
        <div className="fixed top-20 right-4 z-40 w-80 max-h-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                Real-time Updates
              </h4>
              <button
                onClick={() => setRecentUpdates([])}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-48 p-2 space-y-2">
            {recentUpdates.slice().reverse().map((update) => (
              <div 
                key={update.id} 
                className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-2 border-teal-400"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {update.message}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {update.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using real-time equipment updates in components
export function useRealTimeEquipment() {
  const webSocket = useWebSocketContext();
  const [equipmentUpdates, setEquipmentUpdates] = useState<Equipment[]>([]);
  const [assignmentUpdates, setAssignmentUpdates] = useState<Assignment[]>([]);

  const updateEquipmentStatus = useCallback(async (equipmentId: string, newStatus: string) => {
    try {
      await webSocket.updateEquipmentStatus(equipmentId, newStatus);
    } catch (error) {
      console.error('Failed to update equipment status:', error);
      toast.error('Failed to update equipment status');
    }
  }, [webSocket]);

  const checkoutEquipment = useCallback(async (checkoutData: {
    qrCode: string;
    studentId: string;
    eventId?: string;
    expectedReturnDate: string;
    purpose: string;
  }) => {
    try {
      await webSocket.checkoutEquipment(checkoutData);
    } catch (error) {
      console.error('Failed to checkout equipment:', error);
      toast.error('Failed to checkout equipment');
    }
  }, [webSocket]);

  const returnEquipment = useCallback(async (returnData: {
    assignmentId: string;
    returnCondition: string;
    damageNotes?: string;
    returnedById: string;
  }) => {
    try {
      await webSocket.returnEquipment(returnData);
    } catch (error) {
      console.error('Failed to return equipment:', error);
      toast.error('Failed to return equipment');
    }
  }, [webSocket]);

  const refreshDashboard = useCallback(async () => {
    try {
      await webSocket.refreshDashboard();
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      toast.error('Failed to refresh dashboard');
    }
  }, [webSocket]);

  return {
    isConnected: webSocket.isConnected,
    equipmentUpdates,
    assignmentUpdates,
    updateEquipmentStatus,
    checkoutEquipment,
    returnEquipment,
    refreshDashboard,
  };
}