"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_STUDENTS, MOCK_EQUIPMENT } from "@/lib/mockBandData";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function StudentsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesFilter = filter === "all" || student.bandSection.toLowerCase() === filter.toLowerCase();
    const matchesSearch = search === "" || 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.primaryInstrument.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sectionCounts = {
    all: MOCK_STUDENTS.length,
    brass: MOCK_STUDENTS.filter(s => s.bandSection === 'brass').length,
    woodwind: MOCK_STUDENTS.filter(s => s.bandSection === 'woodwind').length,
    percussion: MOCK_STUDENTS.filter(s => s.bandSection === 'percussion').length,
    string: MOCK_STUDENTS.filter(s => s.bandSection === 'string').length,
  };

  const getStandingColor = (standing: string) => {
    switch (standing) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good_standing': return 'text-blue-700 bg-blue-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      case 'probation': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'brass': return 'material-symbols:music-note';
      case 'woodwind': return 'material-symbols:air';
      case 'percussion': return 'material-symbols:sports-baseball';
      case 'string': return 'material-symbols:piano';
      default: return 'material-symbols:music-note';
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Student Management</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary">
                <Icon icon="material-symbols:person-add" className="w-4 h-4 mr-2" />
                Add Student
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:download" className="w-4 h-4 mr-2" />
                Export Roster
              </button>
            </div>
          </div>

          {/* Section Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(sectionCounts).map(([section, count]) => (
              <div key={section} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <Icon icon={getSectionIcon(section)} className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{section === 'all' ? 'Total' : section}</div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search students..."
                className="input-field w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {Object.entries(sectionCounts).map(([section, count]) => (
                <button
                  key={section}
                  onClick={() => setFilter(section)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                    filter === section
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {section} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => {
              const currentEquipment = student.currentAssignments || [];
              return (
                <div key={student.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon icon="material-symbols:person" className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.gradeLevel}</p>
                      <p className="text-sm text-blue-600 capitalize">{student.bandSection} • {student.primaryInstrument}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStandingColor(student.academicStanding)}`}>
                      {student.academicStanding.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Contact Information</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon icon="material-symbols:email" className="w-4 h-4 text-gray-400" />
                          <span className="text-blue-600">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="material-symbols:contact-phone" className="w-4 h-4 text-gray-400" />
                          <span>{student.parentContact}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">
                        Equipment ({currentEquipment.length})
                      </h4>
                      {currentEquipment.length > 0 ? (
                        <div className="text-xs space-y-1">
                          {currentEquipment.slice(0, 2).map(eq => (
                            <div key={eq.id} className="flex justify-between">
                              <span>{eq.make} {eq.model}</span>
                              <span className="text-gray-500">Due: {eq.expectedReturn}</span>
                            </div>
                          ))}
                          {currentEquipment.length > 2 && (
                            <div className="text-gray-500">+{currentEquipment.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No equipment checked out</div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button className="flex-1 btn-secondary text-xs">
                        <Icon icon="material-symbols:visibility" className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button className="flex-1 btn-secondary text-xs">
                        <Icon icon="material-symbols:edit" className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 btn-secondary text-xs">
                        <Icon icon="material-symbols:email" className="w-3 h-3 mr-1" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:search-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found matching your criteria</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}