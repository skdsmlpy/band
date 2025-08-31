"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";

type PracticeSession = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
  maxStudents: number;
  enrolledStudents: string[];
  requiredInstruments: string[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  type: 'SECTIONAL' | 'FULL_BAND' | 'INDIVIDUAL' | 'MASTERCLASS';
};

const MOCK_PRACTICE_SESSIONS: PracticeSession[] = [
  {
    id: 'practice_001',
    title: 'Woodwind Sectional - Holst Suite',
    description: 'Focused practice on Holst Suite No. 1, working on intonation and blend in the woodwind section.',
    date: '2024-09-12',
    startTime: '15:30',
    endTime: '17:00',
    location: 'Band Room',
    instructor: 'Ms. Johnson - Woodwind Specialist',
    maxStudents: 15,
    enrolledStudents: ['student.woodwind1@band.app', 'student.woodwind2@band.app', 'student.woodwind3@band.app'],
    requiredInstruments: ['flute', 'clarinet', 'saxophone', 'oboe'],
    status: 'SCHEDULED',
    type: 'SECTIONAL'
  },
  {
    id: 'practice_002',
    title: 'Brass Fundamentals',
    description: 'Working on breathing techniques, embouchure, and basic tone production for all brass instruments.',
    date: '2024-09-14',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Practice Room 1',
    instructor: 'Mr. Davis - Brass Instructor',
    maxStudents: 12,
    enrolledStudents: ['student.brass1@band.app', 'student.brass2@band.app'],
    requiredInstruments: ['trumpet', 'trombone', 'french_horn', 'tuba'],
    status: 'SCHEDULED',
    type: 'SECTIONAL'
  },
  {
    id: 'practice_003',
    title: 'Full Band Rehearsal - Fall Concert',
    description: 'Complete run-through of Fall Concert repertoire with focus on transitions and dynamics.',
    date: '2024-09-15',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Auditorium',
    instructor: 'Director Thompson',
    maxStudents: 60,
    enrolledStudents: ['student@band.app', 'student.brass1@band.app', 'student.woodwind1@band.app', 'student.percussion1@band.app'],
    requiredInstruments: [],
    status: 'SCHEDULED',
    type: 'FULL_BAND'
  },
  {
    id: 'practice_004',
    title: 'Percussion Masterclass',
    description: 'Advanced techniques for timpani and mallet percussion with guest artist.',
    date: '2024-09-18',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Band Room',
    instructor: 'Guest Artist - John Smith',
    maxStudents: 8,
    enrolledStudents: ['student.percussion1@band.app'],
    requiredInstruments: ['timpani', 'marimba', 'vibraphone'],
    status: 'SCHEDULED',
    type: 'MASTERCLASS'
  },
  {
    id: 'practice_005',
    title: 'Individual Practice Time',
    description: 'Self-directed practice time with optional instructor feedback.',
    date: '2024-09-10',
    startTime: '15:00',
    endTime: '18:00',
    location: 'Practice Rooms 1-5',
    instructor: 'Self-Directed',
    maxStudents: 25,
    enrolledStudents: ['student.string1@band.app', 'student@band.app'],
    requiredInstruments: [],
    status: 'COMPLETED',
    type: 'INDIVIDUAL'
  }
];

export default function PracticePage() {
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);

  const filteredSessions = MOCK_PRACTICE_SESSIONS.filter(session => {
    switch (filter) {
      case 'my_sessions': 
        return session.enrolledStudents.includes('student@band.app'); // Current user
      case 'available':
        return session.status === 'SCHEDULED' && session.enrolledStudents.length < session.maxStudents;
      case 'sectional':
        return session.type === 'SECTIONAL';
      case 'full_band':
        return session.type === 'FULL_BAND';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-green-600 bg-green-50 border-green-200';
      case 'COMPLETED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SECTIONAL': return 'text-purple-700 bg-purple-100';
      case 'FULL_BAND': return 'text-blue-700 bg-blue-100';
      case 'INDIVIDUAL': return 'text-green-700 bg-green-100';
      case 'MASTERCLASS': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const enrollInSession = (sessionId: string) => {
    // Mock enrollment - in real app would call API
    alert('Enrolled in practice session!');
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Practice Sessions</h1>
            <button className="btn-primary">
              <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
              Book Practice Time
            </button>
          </div>

          {/* Mobile-First Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:schedule" className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-blue-900">
                    {MOCK_PRACTICE_SESSIONS.filter(s => s.status === 'SCHEDULED').length}
                  </div>
                  <div className="text-xs md:text-sm text-blue-600">Scheduled</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:person-check" className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-green-900">
                    {MOCK_PRACTICE_SESSIONS.filter(s => s.enrolledStudents.includes('student@band.app')).length}
                  </div>
                  <div className="text-xs md:text-sm text-green-600">My Sessions</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:groups" className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-purple-900">
                    {MOCK_PRACTICE_SESSIONS.filter(s => s.type === 'SECTIONAL').length}
                  </div>
                  <div className="text-xs md:text-sm text-purple-600">Sectionals</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 md:p-4 border border-orange-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:star" className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-orange-900">
                    {MOCK_PRACTICE_SESSIONS.filter(s => s.type === 'MASTERCLASS').length}
                  </div>
                  <div className="text-xs md:text-sm text-orange-600">Masterclass</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-First Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'my_sessions', label: 'My Sessions' },
              { key: 'available', label: 'Available' },
              { key: 'sectional', label: 'Sectionals' },
              { key: 'full_band', label: 'Full Band' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sessions List - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            {filteredSessions.map(session => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base md:text-lg truncate">{session.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                          {session.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details - Mobile Stacked */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:calendar-today" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{formatDate(session.date)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:location-on" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{session.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:group" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{session.enrolledStudents.length}/{session.maxStudents} enrolled</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{session.description}</p>

                  {/* Actions - Mobile Full Width */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    {session.status === 'SCHEDULED' && session.enrolledStudents.length < session.maxStudents && (
                      <button
                        onClick={() => enrollInSession(session.id)}
                        className="flex-1 btn-primary text-sm"
                      >
                        <Icon icon="material-symbols:person-add" className="w-4 h-4 mr-2" />
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <Icon icon="material-symbols:event-busy" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No practice sessions found</p>
            </div>
          )}
        </div>

        {/* Mobile Modal for Session Details */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{selectedSession.title}</h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Icon icon="material-symbols:close" className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedSession.type)}`}>
                      {selectedSession.type.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                      {selectedSession.status}
                    </span>
                  </div>

                  <p className="text-gray-700">{selectedSession.description}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Icon icon="material-symbols:calendar-today" className="w-5 h-5 text-gray-400" />
                      <span>{formatDate(selectedSession.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="material-symbols:schedule" className="w-5 h-5 text-gray-400" />
                      <span>{formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="material-symbols:location-on" className="w-5 h-5 text-gray-400" />
                      <span>{selectedSession.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="material-symbols:person" className="w-5 h-5 text-gray-400" />
                      <span>{selectedSession.instructor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="material-symbols:group" className="w-5 h-5 text-gray-400" />
                      <span>{selectedSession.enrolledStudents.length}/{selectedSession.maxStudents} enrolled</span>
                    </div>
                  </div>

                  {selectedSession.requiredInstruments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Required Instruments:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.requiredInstruments.map(instrument => (
                          <span key={instrument} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs capitalize">
                            {instrument.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="flex-1 btn-secondary"
                    >
                      Close
                    </button>
                    {selectedSession.status === 'SCHEDULED' && selectedSession.enrolledStudents.length < selectedSession.maxStudents && (
                      <button
                        onClick={() => {
                          enrollInSession(selectedSession.id);
                          setSelectedSession(null);
                        }}
                        className="flex-1 btn-primary"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </RequireAuth>
  );
}