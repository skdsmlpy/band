"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Message = {
  id: string;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  type: 'ANNOUNCEMENT' | 'DIRECT' | 'REMINDER' | 'ALERT';
  attachment?: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_001',
    subject: 'Fall Concert Rehearsal Schedule',
    content: 'Please note the updated rehearsal schedule for our Fall Concert. Dress rehearsal is scheduled for October 14th at 6:00 PM in the auditorium.',
    sender: 'director@band.app',
    recipient: 'all_students',
    timestamp: '2024-08-30T14:30:00Z',
    isRead: false,
    isImportant: true,
    type: 'ANNOUNCEMENT'
  },
  {
    id: 'msg_002',
    subject: 'Equipment Return Reminder',
    content: 'This is a friendly reminder that your trumpet (Serial: TR-2024-002) is due for return on September 29th. Please ensure the instrument is clean and in good condition.',
    sender: 'equipment@band.app',
    recipient: 'student@band.app',
    timestamp: '2024-08-29T09:15:00Z',
    isRead: true,
    isImportant: false,
    type: 'REMINDER'
  },
  {
    id: 'msg_003',
    subject: 'Sectional Practice - Woodwinds',
    content: 'Woodwind sectional practice is scheduled for this Thursday at 3:30 PM in the band room. Please bring your music for Holst Suite No. 1.',
    sender: 'director@band.app',
    recipient: 'woodwind_section',
    timestamp: '2024-08-28T16:45:00Z',
    isRead: true,
    isImportant: false,
    type: 'ANNOUNCEMENT'
  },
  {
    id: 'msg_004',
    subject: 'Uniform Fitting Appointment',
    content: 'Your uniform fitting appointment is confirmed for September 15th at 2:00 PM. Please arrive 10 minutes early.',
    sender: 'admin@band.app',
    recipient: 'student.brass1@band.app',
    timestamp: '2024-08-27T11:20:00Z',
    isRead: false,
    isImportant: true,
    type: 'DIRECT'
  },
  {
    id: 'msg_005',
    subject: 'Equipment Maintenance Alert',
    content: 'The trombone (TB-2024-002) you have checked out requires immediate maintenance. Please return it to the equipment room by end of day.',
    sender: 'equipment@band.app',
    recipient: 'student.brass3@band.app',
    timestamp: '2024-08-26T13:45:00Z',
    isRead: false,
    isImportant: true,
    type: 'ALERT'
  },
  {
    id: 'msg_006',
    subject: 'Practice Room Booking Confirmed',
    content: 'Your practice room booking for Practice Room 3 on September 1st from 4:00-5:00 PM has been confirmed.',
    sender: 'booking@band.app',
    recipient: 'student.string1@band.app',
    timestamp: '2024-08-25T10:30:00Z',
    isRead: true,
    isImportant: false,
    type: 'DIRECT'
  }
];

export default function MessagesPage() {
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = MOCK_MESSAGES.filter(message => {
    switch (filter) {
      case 'unread': return !message.isRead;
      case 'important': return message.isImportant;
      case 'announcements': return message.type === 'ANNOUNCEMENT';
      case 'alerts': return message.type === 'ALERT';
      default: return true;
    }
  });

  const unreadCount = MOCK_MESSAGES.filter(m => !m.isRead).length;
  const importantCount = MOCK_MESSAGES.filter(m => m.isImportant).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT': return 'material-symbols:campaign';
      case 'DIRECT': return 'material-symbols:mail';
      case 'REMINDER': return 'material-symbols:notification-important';
      case 'ALERT': return 'material-symbols:warning';
      default: return 'material-symbols:mail';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT': return 'text-blue-700 bg-blue-100';
      case 'DIRECT': return 'text-green-700 bg-green-100';
      case 'REMINDER': return 'text-yellow-700 bg-yellow-100';
      case 'ALERT': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="flex h-full">
          {/* Messages List */}
          <div className={`${selectedMessage ? 'hidden lg:block lg:w-1/3' : 'w-full'} border-r border-gray-200`}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-bold">Messages</h1>
                <button className="btn-primary w-full sm:w-auto">
                  <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                  New Message
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:mark-email-unread" className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">{unreadCount}</div>
                      <div className="text-xs text-blue-600">Unread</div>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:priority-high" className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-900">{importantCount}</div>
                      <div className="text-xs text-red-600">Important</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-1 flex-wrap">
                {[
                  { key: 'all', label: 'All', count: MOCK_MESSAGES.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'important', label: 'Important', count: importantCount },
                  { key: 'announcements', label: 'Announcements', count: MOCK_MESSAGES.filter(m => m.type === 'ANNOUNCEMENT').length },
                  { key: 'alerts', label: 'Alerts', count: MOCK_MESSAGES.filter(m => m.type === 'ALERT').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !message.isRead ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon icon={getTypeIcon(message.type)} className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.subject}
                        </h3>
                        {message.isImportant && (
                          <Icon icon="material-symbols:priority-high" className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">{message.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{message.sender}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(message.type)}`}>
                            {message.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Details */}
          {selectedMessage && (
            <div className="flex-1 lg:w-2/3">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden btn-secondary"
                  >
                    <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="btn-secondary text-sm">
                      <Icon icon="material-symbols:reply" className="w-4 h-4 mr-2" />
                      Reply
                    </button>
                    <button className="btn-secondary text-sm">
                      <Icon icon="material-symbols:forward" className="w-4 h-4 mr-2" />
                      Forward
                    </button>
                    <button className="btn-secondary text-sm">
                      <Icon icon="material-symbols:delete" className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Icon icon={getTypeIcon(selectedMessage.type)} className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">{selectedMessage.subject}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>From: {selectedMessage.sender}</span>
                      <span>To: {selectedMessage.recipient}</span>
                      <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  {selectedMessage.isImportant && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Icon icon="material-symbols:priority-high" className="w-5 h-5" />
                      <span className="text-sm font-medium">Important</span>
                    </div>
                  )}
                </div>

                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedMessage.type)}`}>
                  {selectedMessage.type}
                </span>
              </div>

              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed">{selectedMessage.content}</p>
                </div>

                {selectedMessage.attachment && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:attach-file" className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">Attachment</span>
                    </div>
                    <div className="mt-2">
                      <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                        {selectedMessage.attachment}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedMessage && (
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="text-center">
                <Icon icon="material-symbols:mail" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}