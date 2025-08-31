"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";

type BTask = {
  id: string;
  title: string;
  description: string;
  status: 'NOT_ASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;
  dueDate: string;
  workflowStage: string;
  equipmentId?: string;
};

// Mock tasks based on your workflow stages
const MOCK_TASKS: BTask[] = [
  {
    id: 'task_001',
    title: 'Equipment Checkout - Trumpet TR-2024-002',
    description: 'Complete equipment checkout workflow for student Bach TR300H2 trumpet',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignedTo: 'student@band.app',
    dueDate: '2024-09-29',
    workflowStage: 'equipmentCheckout',
    equipmentId: 'eq_trumpet_002'
  },
  {
    id: 'task_002',
    title: 'Practice Session Preparation',
    description: 'Schedule and prepare for upcoming sectional rehearsal',
    status: 'ASSIGNED',
    priority: 'HIGH',
    assignedTo: 'student.woodwind1@band.app',
    dueDate: '2024-09-12',
    workflowStage: 'practicePreparation'
  },
  {
    id: 'task_003',
    title: 'Performance Readiness Assessment',
    description: 'Complete readiness assessment for Fall Concert',
    status: 'NOT_ASSIGNED',
    priority: 'HIGH',
    assignedTo: '',
    dueDate: '2024-10-10',
    workflowStage: 'performanceReadiness'
  },
  {
    id: 'task_004',
    title: 'Equipment Return - Cello VC-2024-002',
    description: 'Process return and condition assessment for Yamaha VC5S cello',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    assignedTo: 'student.string2@band.app',
    dueDate: '2024-09-21',
    workflowStage: 'equipmentReturn',
    equipmentId: 'eq_cello_002'
  },
  {
    id: 'task_005',
    title: 'Event Execution - Marching Band Practice',
    description: 'Coordinate equipment and attendance for weekly marching practice',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    assignedTo: 'director@band.app',
    dueDate: '2024-09-05',
    workflowStage: 'eventExecution'
  }
];

export default function TasksPage() {
  const userEmail = useAppSelector((s) => s.auth.user?.email);
  const [filter, setFilter] = useState('all');
  
  // Filter tasks based on user and status
  const filteredTasks = MOCK_TASKS.filter(task => {
    const belongsToUser = !userEmail || task.assignedTo === userEmail || task.assignedTo === '' || filter === 'all';
    const matchesFilter = filter === 'all' || task.status.toLowerCase() === filter.toLowerCase();
    return belongsToUser && matchesFilter;
  });
  
  const statusCounts = {
    all: MOCK_TASKS.length,
    not_assigned: MOCK_TASKS.filter(t => t.status === 'NOT_ASSIGNED').length,
    assigned: MOCK_TASKS.filter(t => t.status === 'ASSIGNED').length,
    in_progress: MOCK_TASKS.filter(t => t.status === 'IN_PROGRESS').length,
    completed: MOCK_TASKS.filter(t => t.status === 'COMPLETED').length,
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_ASSIGNED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'ASSIGNED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-700 bg-red-100';
      case 'HIGH': return 'text-orange-700 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'LOW': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };
  
  const getWorkflowIcon = (stage: string) => {
    switch (stage) {
      case 'equipmentCheckout': return 'material-symbols:qr-code-scanner';
      case 'practicePreparation': return 'material-symbols:timer';
      case 'performanceReadiness': return 'material-symbols:star';
      case 'equipmentReturn': return 'material-symbols:assignment-return';
      case 'eventExecution': return 'material-symbols:event';
      default: return 'material-symbols:task';
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">My Tasks</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/workflows" className="btn-primary">
                <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                Start Workflow
              </Link>
              <button className="btn-secondary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                New Task
              </button>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
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
                {status.replace('_', ' ')} ({count})
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon icon={getWorkflowIcon(task.workflowStage)} className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:calendar-today" className="w-4 h-4 text-gray-400" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          {task.assignedTo && (
                            <div className="flex items-center gap-2">
                              <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-400" />
                              <span>Assigned to: {task.assignedTo}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:account-tree" className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{task.workflowStage.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {task.status !== 'COMPLETED' && (
                      <button className="btn-primary">
                        <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                        {task.status === 'NOT_ASSIGNED' ? 'Start' : 'Continue'}
                      </button>
                    )}
                    <a className="btn-secondary" href={`/tasks/${task.id}`}>
                      <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-2" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:task-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
