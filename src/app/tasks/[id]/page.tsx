"use client";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";

// Mock tasks from the main tasks page
const MOCK_TASKS = [
  {
    id: 'task_001',
    title: 'Equipment Checkout - Trumpet TR-2024-002',
    description: 'Complete equipment checkout workflow for student Bach TR300H2 trumpet',
    status: 'IN_PROGRESS' as 'IN_PROGRESS' | 'ASSIGNED' | 'COMPLETED',
    priority: 'MEDIUM' as const,
    assignedTo: 'student@band.app',
    dueDate: '2024-09-29',
    workflowStage: 'equipmentCheckout',
    equipmentId: 'eq_trumpet_002',
    steps: [
      { id: 'step1', title: 'Student Verification', completed: true, description: 'Verify student eligibility and standing' },
      { id: 'step2', title: 'Equipment Selection', completed: true, description: 'Select and inspect equipment' },
      { id: 'step3', title: 'Condition Assessment', completed: false, description: 'Document current condition' },
      { id: 'step4', title: 'Digital Signature', completed: false, description: 'Student signature and agreement' }
    ]
  },
  {
    id: 'task_002',
    title: 'Practice Session Preparation',
    description: 'Schedule and prepare for upcoming sectional rehearsal',
    status: 'ASSIGNED' as 'IN_PROGRESS' | 'ASSIGNED' | 'COMPLETED',
    priority: 'HIGH' as const,
    assignedTo: 'student.woodwind1@band.app',
    dueDate: '2024-09-12',
    workflowStage: 'practicePreparation',
    steps: [
      { id: 'step1', title: 'Schedule Review', completed: false, description: 'Review practice schedule and conflicts' },
      { id: 'step2', title: 'Room Booking', completed: false, description: 'Reserve practice room' },
      { id: 'step3', title: 'Equipment Check', completed: false, description: 'Ensure required equipment is available' }
    ]
  }
];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const task = MOCK_TASKS.find(t => t.id === id);
  const [currentStep, setCurrentStep] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-700 bg-red-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'LOW': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const completeStep = (stepIndex: number) => {
    // Mock step completion
    alert(`Step ${stepIndex + 1} completed!`);
  };

  const startTask = () => {
    alert('Task started! In a real app, this would update the task status.');
  };

  if (!task) {
    return (
      <RequireAuth>
        <AppShell>
          <div className="text-center py-8">
            <Icon icon="material-symbols:error" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Link className="btn-primary" href="/tasks">
              <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
              Back to Tasks
            </Link>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  const completedSteps = task.steps.filter(step => step.completed).length;
  const progressPercent = (completedSteps / task.steps.length) * 100;

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link href="/tasks" className="p-2 hover:bg-gray-100 rounded-lg">
                  <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
                </Link>
                <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            {task.status !== 'COMPLETED' && (
              <button onClick={startTask} className="btn-primary">
                <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                {task.status === 'ASSIGNED' ? 'Start Task' : 'Continue'}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Progress</h2>
              <span className="text-sm text-gray-600">{completedSteps}/{task.steps.length} steps</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 mt-2">{Math.round(progressPercent)}% complete</div>
          </div>

          {/* Task Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold mb-3">Task Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:description" className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{task.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:person" className="w-5 h-5 text-gray-400" />
                <span>Assigned to: {task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:account-tree" className="w-5 h-5 text-gray-400" />
                <span className="capitalize">Workflow: {task.workflowStage.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
              {task.equipmentId && (
                <div className="flex items-center gap-3">
                  <Icon icon="material-symbols:music-note" className="w-5 h-5 text-gray-400" />
                  <span>Equipment ID: {task.equipmentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold mb-4">Workflow Steps</h2>
            <div className="space-y-4">
              {task.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                    step.completed 
                      ? 'bg-green-50 border-green-200' 
                      : index === currentStep 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed
                      ? 'bg-green-600 text-white'
                      : index === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <Icon icon="material-symbols:check" className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    {!step.completed && index === currentStep && (
                      <button 
                        onClick={() => completeStep(index)}
                        className="mt-3 btn-primary text-sm"
                      >
                        <Icon icon="material-symbols:check" className="w-4 h-4 mr-2" />
                        Complete Step
                      </button>
                    )}
                  </div>
                  {step.completed && (
                    <div className="text-green-600">
                      <Icon icon="material-symbols:check-circle" className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/tasks" className="flex-1 btn-secondary">
              <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
              Back to Tasks
            </Link>
            <Link href="/workflows" className="flex-1 btn-secondary">
              <Icon icon="material-symbols:account-tree" className="w-4 h-4 mr-2" />
              Open Workflow Builder
            </Link>
            {task.status !== 'COMPLETED' && (
              <button className="flex-1 btn-primary">
                <Icon icon="material-symbols:save" className="w-4 h-4 mr-2" />
                Save Progress
              </button>
            )}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
