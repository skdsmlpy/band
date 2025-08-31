"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    title: 'Equipment Due Soon',
    message: 'Your trumpet (TR-2024-002) is due for return in 3 days. Please prepare for return.',
    type: 'WARNING',
    timestamp: '2024-08-30T15:30:00Z',
    isRead: false,
    actionUrl: '/equipment/my',
    actionLabel: 'View Equipment'
  },
  {
    id: 'notif_002',
    title: 'Practice Session Confirmed',
    message: 'Your practice room booking for September 1st at 4:00 PM has been confirmed.',
    type: 'SUCCESS',
    timestamp: '2024-08-30T10:15:00Z',
    isRead: false,
    actionUrl: '/practice',
    actionLabel: 'View Schedule'
  },
  {
    id: 'notif_003',
    title: 'New Assignment Available',
    message: 'A new task has been assigned to you: Performance Readiness Assessment for Fall Concert.',
    type: 'INFO',
    timestamp: '2024-08-29T14:45:00Z',
    isRead: true,
    actionUrl: '/tasks',
    actionLabel: 'View Tasks'
  },
  {
    id: 'notif_004',
    title: 'Maintenance Required',
    message: 'The saxophone you checked out requires immediate maintenance. Please return it today.',
    type: 'ERROR',
    timestamp: '2024-08-29T09:30:00Z',
    isRead: false,
    actionUrl: '/equipment/my',
    actionLabel: 'Return Equipment'
  },
  {
    id: 'notif_005',
    title: 'Fall Concert Announcement',
    message: 'The Fall Concert date has been confirmed for October 15th. Rehearsal schedule updated.',
    type: 'INFO',
    timestamp: '2024-08-28T16:20:00Z',
    isRead: true,
    actionUrl: '/performances',
    actionLabel: 'View Events'
  },
  {
    id: 'notif_006',
    title: 'Payment Reminder',
    message: 'Your band fee payment is due by September 15th. Please submit payment to avoid late fees.',
    type: 'WARNING',
    timestamp: '2024-08-28T11:00:00Z',
    isRead: false,
    actionUrl: '/profile',
    actionLabel: 'Make Payment'
  },
  {
    id: 'notif_007',
    title: 'Uniform Fitting Scheduled',
    message: 'Your uniform fitting appointment has been scheduled for September 10th at 2:00 PM.',
    type: 'SUCCESS',
    timestamp: '2024-08-27T13:45:00Z',
    isRead: true
  },
  {
    id: 'notif_008',
    title: 'Sheet Music Available',
    message: 'New sheet music for Holst Suite No. 1 is now available for download.',
    type: 'INFO',
    timestamp: '2024-08-26T12:30:00Z',
    isRead: true,
    actionUrl: '/resources',
    actionLabel: 'Download Music'
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'info': return notification.type === 'INFO';
      case 'warning': return notification.type === 'WARNING';
      case 'error': return notification.type === 'ERROR';
      case 'success': return notification.type === 'SUCCESS';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const typeCounts = {
    info: notifications.filter(n => n.type === 'INFO').length,
    success: notifications.filter(n => n.type === 'SUCCESS').length,
    warning: notifications.filter(n => n.type === 'WARNING').length,
    error: notifications.filter(n => n.type === 'ERROR').length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INFO': return 'material-symbols:info';
      case 'SUCCESS': return 'material-symbols:check-circle';
      case 'WARNING': return 'material-symbols:warning';
      case 'ERROR': return 'material-symbols:error';
      default: return 'material-symbols:notifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'SUCCESS': return 'text-green-600 bg-green-50 border-green-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ERROR': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Notifications</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={markAllAsRead}
                className="btn-secondary"
                disabled={unreadCount === 0}
              >
                <Icon icon="material-symbols:mark-email-read" className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:settings" className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:mark-email-unread" className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-xl font-bold text-blue-900">{unreadCount}</div>
                  <div className="text-sm text-blue-600">Unread</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:check-circle" className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-xl font-bold text-green-900">{typeCounts.success}</div>
                  <div className="text-sm text-green-600">Success</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:warning" className="w-6 h-6 text-yellow-600" />
                <div>
                  <div className="text-xl font-bold text-yellow-900">{typeCounts.warning}</div>
                  <div className="text-sm text-yellow-600">Warnings</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:error" className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-xl font-bold text-red-900">{typeCounts.error}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:notifications" className="w-6 h-6 text-gray-600" />
                <div>
                  <div className="text-xl font-bold text-gray-900">{notifications.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'info', label: 'Info', count: typeCounts.info },
              { key: 'success', label: 'Success', count: typeCounts.success },
              { key: 'warning', label: 'Warning', count: typeCounts.warning },
              { key: 'error', label: 'Error', count: typeCounts.error }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                    <Icon icon={getTypeIcon(notification.type)} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium text-lg ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {notification.actionUrl && (
                          <a href={notification.actionUrl} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {notification.actionLabel}
                          </a>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-600 hover:text-blue-600"
                            title="Mark as read"
                          >
                            <Icon icon="material-symbols:mark-email-read" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <Icon icon="material-symbols:delete" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:notifications-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}