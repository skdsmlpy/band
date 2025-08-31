"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_BAND_EVENTS } from "@/lib/mockBandData";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function PerformancesPage() {
  const [filter, setFilter] = useState("all");

  const filteredEvents = MOCK_BAND_EVENTS.filter(event => {
    return filter === "all" || event.status.toLowerCase() === filter.toLowerCase();
  });

  const statusCounts = {
    all: MOCK_BAND_EVENTS.length,
    scheduled: MOCK_BAND_EVENTS.filter(e => e.status === 'SCHEDULED').length,
    active: MOCK_BAND_EVENTS.filter(e => e.status === 'ACTIVE').length,
    completed: MOCK_BAND_EVENTS.filter(e => e.status === 'COMPLETED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'COMPLETED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONCERT': return 'material-symbols:theater-comedy';
      case 'REHEARSAL': return 'material-symbols:music-note';
      case 'COMPETITION': return 'material-symbols:emoji-events';
      case 'PARADE': return 'material-symbols:celebration';
      case 'CLINIC': return 'material-symbols:school';
      case 'FUNDRAISER': return 'material-symbols:volunteer-activism';
      default: return 'material-symbols:event';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONCERT': return 'text-purple-700 bg-purple-100';
      case 'REHEARSAL': return 'text-blue-700 bg-blue-100';
      case 'COMPETITION': return 'text-yellow-700 bg-yellow-100';
      case 'PARADE': return 'text-green-700 bg-green-100';
      case 'CLINIC': return 'text-indigo-700 bg-indigo-100';
      case 'FUNDRAISER': return 'text-pink-700 bg-pink-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Performances & Events</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Add Event
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:calendar-month" className="w-4 h-4 mr-2" />
                Calendar View
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:schedule" className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{statusCounts.scheduled}</div>
                  <div className="text-sm text-blue-600">Scheduled</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:play-circle" className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">{statusCounts.active}</div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:check-circle" className="w-8 h-8 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{statusCounts.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:event" className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">{statusCounts.all}</div>
                  <div className="text-sm text-purple-600">Total Events</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <Icon icon={getTypeIcon(event.type)} className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-lg md:text-xl font-semibold mb-2">{event.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:calendar-today" className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:schedule" className="w-4 h-4 text-gray-400" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:location-on" className="w-4 h-4 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:people" className="w-4 h-4 text-gray-400" />
                            <span>{event.expectedAttendance} expected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-400" />
                            <span>{event.contactPerson}</span>
                          </div>
                          {event.specialRequirements && (
                            <div className="flex items-center gap-2">
                              <Icon icon="material-symbols:info" className="w-4 h-4 text-gray-400" />
                              <span className="text-orange-600">{event.specialRequirements}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Required Sections:</h4>
                        <div className="flex flex-wrap gap-1">
                          {event.requiredSections.map(section => (
                            <span key={section} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs capitalize">
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                      {event.equipmentNeeded.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Equipment Needed:</h4>
                          <div className="text-xs text-gray-600">
                            {event.equipmentNeeded.length} items required
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    <button className="btn-primary">
                      <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="btn-secondary">
                      <Icon icon="material-symbols:edit" className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    {event.status === 'SCHEDULED' && (
                      <button className="btn-secondary">
                        <Icon icon="material-symbols:check-in" className="w-4 h-4 mr-2" />
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:event-busy" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}