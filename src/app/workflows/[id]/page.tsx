"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { WorkflowEngine, WorkflowInstance, WorkflowSchema } from "@/lib/workflowEngine";
import { useAppSelector } from "@/store";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Link from "next/link";

export default function WorkflowExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params?.id as string;
  const user = useAppSelector((s) => s.auth.user);

  const [workflow, setWorkflow] = useState<WorkflowInstance | null>(null);
  const [schema, setSchema] = useState<WorkflowSchema | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load workflow instance and schema
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        setLoading(true);
        const workflowInstance = WorkflowEngine.getWorkflowById(workflowId);
        
        if (!workflowInstance) {
          setError('Workflow not found');
          return;
        }

        setWorkflow(workflowInstance);
        setFormData(workflowInstance.formData);

        // Load the schema
        const workflowSchema = await WorkflowEngine.loadSchema(workflowInstance.schemaPath);
        setSchema(workflowSchema);
      } catch (err) {
        console.error('Error loading workflow:', err);
        setError('Failed to load workflow');
      } finally {
        setLoading(false);
      }
    };

    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId]);

  const uiSchema = useMemo(() => (schema?.['ui:schema'] ?? {}), [schema]);
  
  const progress = workflow ? WorkflowEngine.getWorkflowProgress(workflow) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'PAUSED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
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

  const handleStartWorkflow = () => {
    if (!workflow) return;
    
    const updated = WorkflowEngine.resumeWorkflow(workflow.id);
    if (updated) {
      setWorkflow(updated);
    }
  };

  const handlePauseWorkflow = () => {
    if (!workflow) return;
    
    const updated = WorkflowEngine.pauseWorkflow(workflow.id);
    if (updated) {
      setWorkflow(updated);
    }
  };

  const handleSaveProgress = async () => {
    if (!workflow || !user) return;
    
    setSaving(true);
    try {
      const updated = WorkflowEngine.updateWorkflowData(workflow.id, formData);
      if (updated) {
        setWorkflow(updated);
        alert('Progress saved successfully!');
      }
    } catch (err) {
      console.error('Error saving workflow:', err);
      alert('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteWorkflow = async (submittedData: any) => {
    if (!workflow || !user) return;
    
    setSaving(true);
    try {
      // Save final form data
      const updated = WorkflowEngine.updateWorkflowData(workflow.id, submittedData.formData);
      
      if (updated) {
        // Complete the workflow
        const completed = WorkflowEngine.completeWorkflow(updated.id);
        if (completed) {
          setWorkflow(completed);
          alert(`Workflow "${workflow.title}" completed successfully!`);
          
          // Optionally redirect back to workflows or tasks
          setTimeout(() => {
            router.push('/workflows');
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error completing workflow:', err);
      alert('Failed to complete workflow');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RequireAuth>
        <AppShell>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading workflow...</p>
            </div>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  if (error || !workflow || !schema) {
    return (
      <RequireAuth>
        <AppShell>
          <div className="text-center py-8">
            <Icon icon="material-symbols:error" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{error || 'Workflow Not Found'}</h2>
            <p className="text-gray-600 mb-4">The workflow you're looking for doesn't exist or couldn't be loaded.</p>
            <Link href="/workflows" className="btn-primary">
              <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
              Back to Workflows
            </Link>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  const canEdit = workflow.assignedTo === user?.email && workflow.status !== 'COMPLETED';

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link href="/workflows" className="p-2 hover:bg-gray-100 rounded-lg">
                  <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
                </Link>
                <h1 className="text-xl md:text-2xl font-bold">{workflow.title}</h1>
              </div>
              <p className="text-gray-600 mb-3">{workflow.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPriorityColor(workflow.metadata.priority)}`}>
                  {workflow.metadata.priority}
                </span>
                <span className="text-sm text-gray-600">
                  {workflow.metadata.dueDate && `Due: ${new Date(workflow.metadata.dueDate).toLocaleDateString()}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {workflow.status === 'NOT_STARTED' && canEdit && (
                <button onClick={handleStartWorkflow} className="btn-primary">
                  <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                  Start Workflow
                </button>
              )}
              {workflow.status === 'IN_PROGRESS' && canEdit && (
                <button onClick={handlePauseWorkflow} className="btn-secondary">
                  <Icon icon="material-symbols:pause" className="w-4 h-4 mr-2" />
                  Pause
                </button>
              )}
              {workflow.status === 'PAUSED' && canEdit && (
                <button onClick={handleStartWorkflow} className="btn-primary">
                  <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                  Resume
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Workflow Progress</h2>
                <span className="text-sm text-gray-600">
                  {progress.completedStages}/{progress.totalStages} stages
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentComplete}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">{progress.percentComplete}% complete</div>
            </div>
          )}

          {/* Workflow Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold mb-4">Workflow Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:person" className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-600">Assigned to</div>
                  <div className="font-medium">{workflow.assignedTo}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:person-add" className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-600">Initiated by</div>
                  <div className="font-medium">{workflow.initiatedBy}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:schedule" className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-600">Started</div>
                  <div className="font-medium">{new Date(workflow.initiatedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:update" className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-600">Last updated</div>
                  <div className="font-medium">{new Date(workflow.lastUpdated).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:account-tree" className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-600">Current stage</div>
                  <div className="font-medium capitalize">{workflow.currentStage.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              </div>
              {workflow.completedAt && (
                <div className="flex items-center gap-3">
                  <Icon icon="material-symbols:check-circle" className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Completed</div>
                    <div className="font-medium">{new Date(workflow.completedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stage History */}
          {workflow.stageHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="font-semibold mb-4">Completed Stages</h2>
              <div className="space-y-3">
                {workflow.stageHistory.map((stage, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon icon="material-symbols:check" className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium capitalize">
                        {stage.stage.replace(/([A-Z])/g, ' $1')}
                        {stage.subStage && ` - ${stage.subStage.replace(/([A-Z])/g, ' $1')}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed by {stage.completedBy} on {new Date(stage.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Form */}
          {canEdit && (workflow.status === 'IN_PROGRESS' || workflow.status === 'NOT_STARTED') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Workflow Form</h2>
                <div className="text-sm text-gray-600">
                  Based on: <span className="font-mono text-xs">{workflow.schemaPath}</span>
                </div>
              </div>
              
              <Form 
                schema={schema as any} 
                uiSchema={uiSchema}
                formData={formData}
                onChange={(e) => setFormData(e.formData)}
                onSubmit={handleCompleteWorkflow}
                validator={validator}
                disabled={saving}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <button 
                    type="button"
                    onClick={handleSaveProgress}
                    disabled={saving}
                    className="flex-1 btn-secondary"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Icon icon="material-symbols:save" className="w-4 h-4 mr-2" />
                        Save Progress
                      </>
                    )}
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 btn-primary"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <Icon icon="material-symbols:check" className="w-4 h-4 mr-2" />
                        Complete Workflow
                      </>
                    )}
                  </button>
                </div>
              </Form>
            </div>
          )}

          {/* Read-only view for completed workflows */}
          {workflow.status === 'COMPLETED' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="font-semibold mb-4">Workflow Data (Read-Only)</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(workflow.formData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}