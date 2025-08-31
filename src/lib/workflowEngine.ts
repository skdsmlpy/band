// Workflow Engine for managing workflow state and progression
export type WorkflowStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export interface WorkflowInstance {
  id: string;
  workflowType: string;
  schemaPath: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  currentStage: string;
  currentSubStage?: string;
  assignedTo: string;
  initiatedBy: string;
  initiatedAt: string;
  lastUpdated: string;
  completedAt?: string;
  formData: any;
  stageHistory: WorkflowStageHistory[];
  metadata: {
    equipmentId?: string;
    eventId?: string;
    studentId?: string;
    dueDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
}

export interface WorkflowStageHistory {
  stage: string;
  subStage?: string;
  completedAt: string;
  completedBy: string;
  data: any;
  notes?: string;
}

export interface WorkflowSchema {
  $schema: string;
  type: string;
  title: string;
  description?: string;
  'x-workflow'?: string;
  'x-type'?: string;
  'x-stages'?: string[];
  'x-workflow-initiator-groups'?: string;
  'x-default-assignee-user'?: string;
  'x-default-assignee-group'?: string;
  'x-queue-mappings'?: Record<string, string>;
  properties: Record<string, any>;
  'ui:schema'?: any;
}

// Mock workflow instances - in real app this would come from backend
export const MOCK_WORKFLOW_INSTANCES: WorkflowInstance[] = [
  {
    id: 'wf_001',
    workflowType: 'equipmentCheckout',
    schemaPath: '/schemas/band/stages/equipmentCheckout.json',
    title: 'Equipment Checkout - Trumpet TR-2024-002',
    description: 'Student equipment checkout for Bach TR300H2 trumpet',
    status: 'IN_PROGRESS',
    currentStage: 'equipmentCheckout',
    currentSubStage: 'equipmentSelection',
    assignedTo: 'student@band.app',
    initiatedBy: 'student@band.app',
    initiatedAt: '2024-08-30T10:00:00Z',
    lastUpdated: '2024-08-30T15:30:00Z',
    formData: {
      studentVerification: {
        studentId: 'student@band.app',
        academicStanding: 'good_standing',
        verified: true
      },
      equipmentSelection: {
        equipmentId: 'eq_trumpet_002',
        serialNumber: 'TR-2024-002'
      }
    },
    stageHistory: [
      {
        stage: 'equipmentCheckout',
        subStage: 'studentVerification',
        completedAt: '2024-08-30T10:15:00Z',
        completedBy: 'student@band.app',
        data: { studentId: 'student@band.app', verified: true }
      }
    ],
    metadata: {
      equipmentId: 'eq_trumpet_002',
      dueDate: '2024-09-29',
      priority: 'MEDIUM'
    }
  },
  {
    id: 'wf_002',
    workflowType: 'practicePreparation',
    schemaPath: '/schemas/band/stages/practicePreparation.json',
    title: 'Practice Session Preparation - Woodwind Sectional',
    description: 'Prepare for upcoming woodwind sectional rehearsal',
    status: 'NOT_STARTED',
    currentStage: 'practicePreparation',
    assignedTo: 'student.woodwind1@band.app',
    initiatedBy: 'director@band.app',
    initiatedAt: '2024-08-31T09:00:00Z',
    lastUpdated: '2024-08-31T09:00:00Z',
    formData: {},
    stageHistory: [],
    metadata: {
      eventId: 'practice_001',
      dueDate: '2024-09-12',
      priority: 'HIGH'
    }
  },
  {
    id: 'wf_003',
    workflowType: 'performanceReadiness',
    schemaPath: '/schemas/band/stages/performanceReadiness.json',
    title: 'Performance Readiness - Fall Concert',
    description: 'Pre-performance assessment for Fall Concert',
    status: 'COMPLETED',
    currentStage: 'performanceReadiness',
    assignedTo: 'student.brass1@band.app',
    initiatedBy: 'director@band.app',
    initiatedAt: '2024-08-28T14:00:00Z',
    lastUpdated: '2024-08-29T16:45:00Z',
    completedAt: '2024-08-29T16:45:00Z',
    formData: {
      performanceAssessment: {
        technicalReadiness: 'ready',
        musicMemorization: 'complete',
        uniformFitting: 'completed'
      }
    },
    stageHistory: [
      {
        stage: 'performanceReadiness',
        subStage: 'performanceAssessment',
        completedAt: '2024-08-29T16:45:00Z',
        completedBy: 'student.brass1@band.app',
        data: { technicalReadiness: 'ready', musicMemorization: 'complete' }
      }
    ],
    metadata: {
      eventId: 'event_001',
      dueDate: '2024-10-15',
      priority: 'HIGH'
    }
  }
];

export class WorkflowEngine {
  static async loadSchema(schemaPath: string): Promise<WorkflowSchema> {
    try {
      const response = await fetch(schemaPath);
      if (!response.ok) {
        throw new Error(`Failed to load schema: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading schema:', error);
      throw error;
    }
  }

  static async createWorkflow(
    workflowType: string,
    schemaPath: string,
    initiatedBy: string,
    metadata: Partial<WorkflowInstance['metadata']> = {}
  ): Promise<WorkflowInstance> {
    const schema = await this.loadSchema(schemaPath);
    
    const newWorkflow: WorkflowInstance = {
      id: `wf_${Date.now()}`,
      workflowType,
      schemaPath,
      title: schema.title || 'Untitled Workflow',
      description: schema.description || '',
      status: 'NOT_STARTED',
      currentStage: schema['x-stages']?.[0] || 'start',
      assignedTo: initiatedBy,
      initiatedBy,
      initiatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      formData: {},
      stageHistory: [],
      metadata: {
        priority: 'MEDIUM',
        ...metadata
      }
    };

    // In real app, this would save to backend
    MOCK_WORKFLOW_INSTANCES.push(newWorkflow);
    return newWorkflow;
  }

  static getWorkflowById(id: string): WorkflowInstance | null {
    return MOCK_WORKFLOW_INSTANCES.find(wf => wf.id === id) || null;
  }

  static getWorkflowsByUser(userEmail: string): WorkflowInstance[] {
    return MOCK_WORKFLOW_INSTANCES.filter(wf => 
      wf.assignedTo === userEmail || wf.initiatedBy === userEmail
    );
  }

  static updateWorkflowData(id: string, stageData: any): WorkflowInstance | null {
    const workflow = this.getWorkflowById(id);
    if (!workflow) return null;

    workflow.formData = {
      ...workflow.formData,
      ...stageData
    };
    workflow.lastUpdated = new Date().toISOString();
    workflow.status = 'IN_PROGRESS';

    // In real app, this would update backend
    return workflow;
  }

  static completeStage(
    id: string, 
    stage: string, 
    subStage: string | undefined, 
    data: any, 
    completedBy: string
  ): WorkflowInstance | null {
    const workflow = this.getWorkflowById(id);
    if (!workflow) return null;

    // Add to stage history
    workflow.stageHistory.push({
      stage,
      subStage,
      completedAt: new Date().toISOString(),
      completedBy,
      data
    });

    // Update workflow data
    workflow.formData = {
      ...workflow.formData,
      [stage]: {
        ...workflow.formData[stage],
        ...data
      }
    };

    workflow.lastUpdated = new Date().toISOString();

    // In real app, this would update backend and potentially advance to next stage
    return workflow;
  }

  static pauseWorkflow(id: string): WorkflowInstance | null {
    const workflow = this.getWorkflowById(id);
    if (!workflow) return null;

    workflow.status = 'PAUSED';
    workflow.lastUpdated = new Date().toISOString();
    
    return workflow;
  }

  static resumeWorkflow(id: string): WorkflowInstance | null {
    const workflow = this.getWorkflowById(id);
    if (!workflow) return null;

    workflow.status = 'IN_PROGRESS';
    workflow.lastUpdated = new Date().toISOString();
    
    return workflow;
  }

  static completeWorkflow(id: string): WorkflowInstance | null {
    const workflow = this.getWorkflowById(id);
    if (!workflow) return null;

    workflow.status = 'COMPLETED';
    workflow.completedAt = new Date().toISOString();
    workflow.lastUpdated = new Date().toISOString();
    
    return workflow;
  }

  static getWorkflowProgress(workflow: WorkflowInstance): {
    completedStages: number;
    totalStages: number;
    percentComplete: number;
  } {
    const totalStages = workflow.stageHistory.length + 1; // Current + completed
    const completedStages = workflow.stageHistory.length;
    const percentComplete = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

    return {
      completedStages,
      totalStages,
      percentComplete: Math.round(percentComplete)
    };
  }
}