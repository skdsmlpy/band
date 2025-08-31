"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";

type TaskQueue = {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  assignedRole: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  color: string;
  icon: string;
  lastActivity: string;
};

// Mock task queues based on band workflows
const MOCK_QUEUES: TaskQueue[] = [
  {
    id: 'queue_equipment_checkout',
    name: 'Equipment Checkout',
    description: 'Student equipment checkout and assignment tasks',
    taskCount: 8,
    assignedRole: ['Equipment Manager', 'Band Director'],
    priority: 'HIGH',
    color: 'bg-blue-500',
    icon: 'material-symbols:qr-code-scanner',
    lastActivity: '2 minutes ago'
  },
  {
    id: 'queue_equipment_return',
    name: 'Equipment Returns',
    description: 'Process equipment returns and condition assessments',
    taskCount: 5,
    assignedRole: ['Equipment Manager'],
    priority: 'MEDIUM',
    color: 'bg-green-500',
    icon: 'material-symbols:assignment-return',
    lastActivity: '15 minutes ago'
  },
  {
    id: 'queue_maintenance',
    name: 'Maintenance Queue',
    description: 'Equipment maintenance and repair scheduling',
    taskCount: 3,
    assignedRole: ['Equipment Manager', 'Band Director'],
    priority: 'HIGH',
    color: 'bg-orange-500',
    icon: 'material-symbols:build',
    lastActivity: '1 hour ago'
  },
  {
    id: 'queue_practice_prep',
    name: 'Practice Preparation',
    description: 'Student practice session scheduling and preparation',
    taskCount: 12,
    assignedRole: ['Student', 'Band Director'],
    priority: 'MEDIUM',
    color: 'bg-purple-500',
    icon: 'material-symbols:timer',
    lastActivity: '30 minutes ago'
  },
  {
    id: 'queue_performance',
    name: 'Performance Readiness',
    description: 'Pre-performance assessments and preparations',
    taskCount: 6,
    assignedRole: ['Band Director', 'Student'],
    priority: 'HIGH',
    color: 'bg-yellow-500',
    icon: 'material-symbols:star',
    lastActivity: '45 minutes ago'
  },
  {
    id: 'queue_event_execution',
    name: 'Event Coordination',
    description: 'Concert and event execution coordination',
    taskCount: 2,
    assignedRole: ['Band Director', 'Supervisor'],
    priority: 'MEDIUM',
    color: 'bg-pink-500',
    icon: 'material-symbols:event',
    lastActivity: '2 hours ago'
  }
];

export default function QueuesPage() {
  const [filter, setFilter] = useState('all');
  
  const filteredQueues = MOCK_QUEUES.filter(queue => {
    return filter === 'all' || queue.priority.toLowerCase() === filter.toLowerCase();
  });
  
  const priorityCounts = {
    all: MOCK_QUEUES.length,
    high: MOCK_QUEUES.filter(q => q.priority === 'HIGH').length,
    medium: MOCK_QUEUES.filter(q => q.priority === 'MEDIUM').length,
    low: MOCK_QUEUES.filter(q => q.priority === 'LOW').length,
  };
  
  const totalTasks = MOCK_QUEUES.reduce((sum, queue) => sum + queue.taskCount, 0);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-700 bg-red-100 border-red-200';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Task Queues</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/workflows" className="btn-primary">
                <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                Start Workflow
              </Link>
              <button className="btn-secondary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Create Queue
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:tune" className="w-4 h-4 mr-2" />
                Configure
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:queue" className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{MOCK_QUEUES.length}</div>
                  <div className="text-sm text-blue-600">Active Queues</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:task" className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">{totalTasks}</div>
                  <div className="text-sm text-green-600">Total Tasks</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:priority-high" className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-900">{priorityCounts.high}</div>
                  <div className="text-sm text-red-600">High Priority</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:schedule" className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">
                    {Math.round(totalTasks / MOCK_QUEUES.length)}
                  </div>
                  <div className="text-sm text-purple-600">Avg per Queue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <button
                key={priority}
                onClick={() => setFilter(priority)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                  filter === priority
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority} ({count})
              </button>
            ))}
          </div>

          {/* Queues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueues.map(queue => (
              <div key={queue.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${queue.color} flex items-center justify-center`}>
                        <Icon icon={queue.icon} className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{queue.name}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(queue.priority)}`}>
                          {queue.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{queue.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasks in Queue:</span>
                      <span className="font-semibold text-lg text-blue-600">{queue.taskCount}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Assigned Roles:</span>
                      <div className="flex flex-wrap gap-1">
                        {queue.assignedRole.map(role => (
                          <span key={role} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="material-symbols:schedule" className="w-4 h-4" />
                      <span>Last activity: {queue.lastActivity}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex gap-2">
                  <button className="flex-1 btn-primary text-sm">
                    <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-1" />
                    View Queue
                  </button>
                  <button className="flex-1 btn-secondary text-sm">
                    <Icon icon="material-symbols:tune" className="w-4 h-4 mr-1" />
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredQueues.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:queue-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No queues found</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
