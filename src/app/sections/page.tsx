"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_STUDENTS, MOCK_EQUIPMENT } from "@/lib/mockBandData";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Section = {
  id: string;
  name: string;
  icon: string;
  color: string;
  leader: string;
  members: string[];
  equipment: string[];
  upcomingEvents: string[];
  practiceSchedule: string;
  notes: string;
};

const MOCK_SECTIONS: Section[] = [
  {
    id: 'section_brass',
    name: 'Brass Section',
    icon: 'material-symbols:music-note',
    color: 'bg-yellow-500',
    leader: 'student.brass1@band.app',
    members: ['student@band.app', 'student.brass1@band.app', 'student.brass2@band.app'],
    equipment: ['eq_trumpet_001', 'eq_trumpet_002', 'eq_trombone_001', 'eq_frenchhorn_001'],
    upcomingEvents: ['Fall Concert', 'Regional Competition'],
    practiceSchedule: 'Tuesdays & Thursdays, 4:00-5:30 PM',
    notes: 'Focus on blend and intonation for Fall Concert. New members need fundamentals review.'
  },
  {
    id: 'section_woodwind',
    name: 'Woodwind Section',
    icon: 'material-symbols:air',
    color: 'bg-green-500',
    leader: 'student.woodwind2@band.app',
    members: ['student.woodwind1@band.app', 'student.woodwind2@band.app', 'student.woodwind3@band.app'],
    equipment: ['eq_flute_001', 'eq_clarinet_001', 'eq_saxophone_001'],
    upcomingEvents: ['Sectional Rehearsal', 'Fall Concert'],
    practiceSchedule: 'Mondays & Wednesdays, 3:30-5:00 PM',
    notes: 'Working on Holst Suite No. 1. Need to improve articulation consistency.'
  },
  {
    id: 'section_percussion',
    name: 'Percussion Section',
    icon: 'material-symbols:sports-baseball',
    color: 'bg-red-500',
    leader: 'student.percussion1@band.app',
    members: ['student.percussion1@band.app'],
    equipment: ['eq_snare_001', 'eq_timpani_001', 'eq_marimba_001'],
    upcomingEvents: ['Masterclass', 'Fall Concert'],
    practiceSchedule: 'Daily, 3:00-4:00 PM',
    notes: 'Preparing for timpani feature in Fall Concert. Guest artist masterclass scheduled.'
  },
  {
    id: 'section_string',
    name: 'String Section',
    icon: 'material-symbols:piano',
    color: 'bg-purple-500',
    leader: 'student.string2@band.app',
    members: ['student.string1@band.app', 'student.string2@band.app'],
    equipment: ['eq_violin_001', 'eq_cello_001'],
    upcomingEvents: ['Joint Concert with Orchestra'],
    practiceSchedule: 'Fridays, 4:00-6:00 PM',
    notes: 'Preparing for joint concert with orchestra. Working on advanced string techniques.'
  }
];

export default function SectionsPage() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const getSectionMembers = (memberEmails: string[]) => {
    return MOCK_STUDENTS.filter(student => memberEmails.includes(student.email));
  };

  const getSectionEquipment = (equipmentIds: string[]) => {
    return MOCK_EQUIPMENT.filter(eq => equipmentIds.includes(eq.id));
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Band Sections</h1>
            <button className="btn-primary">
              <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
              Create Section
            </button>
          </div>

          {/* Mobile-First Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:groups" className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-blue-900">{MOCK_SECTIONS.length}</div>
                  <div className="text-xs md:text-sm text-blue-600">Sections</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:person" className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-green-900">
                    {MOCK_SECTIONS.reduce((sum, section) => sum + section.members.length, 0)}
                  </div>
                  <div className="text-xs md:text-sm text-green-600">Members</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:music-note" className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-purple-900">
                    {MOCK_SECTIONS.reduce((sum, section) => sum + section.equipment.length, 0)}
                  </div>
                  <div className="text-xs md:text-sm text-purple-600">Instruments</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 md:p-4 border border-orange-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:event" className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-orange-900">
                    {MOCK_SECTIONS.reduce((sum, section) => sum + section.upcomingEvents.length, 0)}
                  </div>
                  <div className="text-xs md:text-sm text-orange-600">Events</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {MOCK_SECTIONS.map(section => {
              const members = getSectionMembers(section.members);
              const equipment = getSectionEquipment(section.equipment);
              const leader = members.find(m => m.email === section.leader);
              
              return (
                <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 md:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon icon={section.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg md:text-xl">{section.name}</h3>
                        <p className="text-sm text-gray-600">
                          {members.length} members • {equipment.length} instruments
                        </p>
                      </div>
                    </div>

                    {/* Leader */}
                    {leader && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Section Leader</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:person" className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{leader.name}</div>
                            <div className="text-xs text-gray-500">Grade {leader.gradeLevel}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Practice Schedule */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Practice Schedule</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="material-symbols:schedule" className="w-4 h-4 text-gray-400" />
                        <span>{section.practiceSchedule}</span>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Upcoming Events</h4>
                      <div className="flex flex-wrap gap-2">
                        {section.upcomingEvents.slice(0, 2).map(event => (
                          <span key={event} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                            {event}
                          </span>
                        ))}
                        {section.upcomingEvents.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                            +{section.upcomingEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{section.notes}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSection(section)}
                        className="flex-1 btn-primary text-sm"
                      >
                        <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button className="btn-secondary text-sm">
                        <Icon icon="material-symbols:edit" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Modal for Section Details */}
        {selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${selectedSection.color} flex items-center justify-center`}>
                      <Icon icon={selectedSection.icon} className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold">{selectedSection.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Icon icon="material-symbols:close" className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Members */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Members ({getSectionMembers(selectedSection.members).length})</h3>
                    <div className="space-y-3">
                      {getSectionMembers(selectedSection.members).map(member => (
                        <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:person" className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-600">
                              Grade {member.gradeLevel} • {member.primaryInstrument}
                              {member.email === selectedSection.leader && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Leader</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.currentAssignments.length} instruments
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Section Equipment ({getSectionEquipment(selectedSection.equipment).length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getSectionEquipment(selectedSection.equipment).map(eq => (
                        <div key={eq.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm">{eq.make} {eq.model}</div>
                          <div className="text-xs text-gray-600">{eq.serialNumber}</div>
                          <div className="text-xs text-gray-500 mt-1">{eq.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule & Events */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Practice Schedule</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="material-symbols:schedule" className="w-4 h-4 text-gray-400" />
                        <span>{selectedSection.practiceSchedule}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Upcoming Events</h3>
                      <div className="space-y-2">
                        {selectedSection.upcomingEvents.map(event => (
                          <div key={event} className="flex items-center gap-2 text-sm">
                            <Icon icon="material-symbols:event" className="w-4 h-4 text-gray-400" />
                            <span>{event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedSection.notes}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button className="flex-1 btn-secondary">
                      <Icon icon="material-symbols:edit" className="w-4 h-4 mr-2" />
                      Edit Section
                    </button>
                    <button className="flex-1 btn-primary">
                      <Icon icon="material-symbols:message" className="w-4 h-4 mr-2" />
                      Message Section
                    </button>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="btn-secondary px-4"
                    >
                      Close
                    </button>
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