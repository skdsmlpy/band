"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { WorkflowEngine, MOCK_WORKFLOW_INSTANCES } from "@/lib/workflowEngine";
import { useAppSelector } from "@/store";
import Link from "next/link";

type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  schemaPath: string;
  icon: string;
  color: string;
  estimatedTime: string;
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
};

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'main_workflow',
    name: 'Main Band Workflow',
    description: 'Complete band management workflow covering all stages',
    category: 'Management',
    schemaPath: '/schemas/band/main.json',
    icon: 'material-symbols:account-tree',
    color: 'bg-blue-500',
    estimatedTime: '30-45 min',
    complexity: 'COMPLEX'
  },
  {
    id: 'equipment_checkout',
    name: 'Equipment Checkout',
    description: 'Student equipment checkout and assignment process',
    category: 'Equipment',
    schemaPath: '/schemas/band/stages/equipmentCheckout.json',
    icon: 'material-symbols:qr-code-scanner',
    color: 'bg-green-500',
    estimatedTime: '10-15 min',
    complexity: 'SIMPLE'
  },
  {
    id: 'practice_preparation',
    name: 'Practice Preparation',
    description: 'Schedule and prepare practice sessions',
    category: 'Practice',
    schemaPath: '/schemas/band/stages/practicePreparation.json',
    icon: 'material-symbols:timer',
    color: 'bg-purple-500',
    estimatedTime: '5-10 min',
    complexity: 'SIMPLE'
  },
  {
    id: 'performance_readiness',
    name: 'Performance Readiness',
    description: 'Pre-performance assessment and preparation',
    category: 'Performance',
    schemaPath: '/schemas/band/stages/performanceReadiness.json',
    icon: 'material-symbols:star',
    color: 'bg-yellow-500',
    estimatedTime: '15-20 min',
    complexity: 'MODERATE'
  },
  {
    id: 'equipment_return',
    name: 'Equipment Return',
    description: 'Process equipment returns and condition assessment',
    category: 'Equipment',
    schemaPath: '/schemas/band/stages/equipmentReturn.json',
    icon: 'material-symbols:assignment-return',
    color: 'bg-orange-500',
    estimatedTime: '10-15 min',
    complexity: 'MODERATE'
  },
  {
    id: 'event_execution',
    name: 'Event Execution',
    description: 'Coordinate and execute band events',
    category: 'Events',
    schemaPath: '/schemas/band/stages/eventExecution.json',
    icon: 'material-symbols:event',
    color: 'bg-red-500',
    estimatedTime: '20-30 min',
    complexity: 'COMPLEX'
  }
];

export default function WorkflowsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [schema, setSchema] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [view, setView] = useState<'templates' | 'builder' | 'my_workflows'>('my_workflows');
  const [category, setCategory] = useState('all');
  const user = useAppSelector((s) => s.auth.user);
  
  const myWorkflows = user ? WorkflowEngine.getWorkflowsByUser(user.email) : [];

  const categories = ['all', ...new Set(WORKFLOW_TEMPLATES.map(t => t.category))];
  const filteredTemplates = WORKFLOW_TEMPLATES.filter(t => 
    category === 'all' || t.category === category
  );

  const resolveSchema = async (schemaPath: string): Promise<any> => {
    const response = await fetch(schemaPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${schemaPath}: ${response.status}`);
    }
    const schema = await response.json();
    
    // Recursively resolve $ref references
    const resolveRefs = async (obj: any, basePath: string): Promise<any> => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return Promise.all(obj.map(item => resolveRefs(item, basePath)));
      }
      
      if (obj['$ref']) {
        const refPath = obj['$ref'];
        let resolvedPath: string;
        
        console.log(`Resolving $ref: "${refPath}" from basePath: "${basePath}"`);
        
        if (refPath.startsWith('../') || refPath.startsWith('./')) {
          // Handle relative paths
          const pathParts = basePath.split('/');
          pathParts.pop(); // remove filename
          const refParts = refPath.split('/');
          
          for (const part of refParts) {
            if (part === '..') {
              pathParts.pop();
            } else if (part !== '.' && part !== '') {
              pathParts.push(part);
            }
          }
          resolvedPath = pathParts.join('/');
        } else if (refPath.startsWith('/')) {
          // Absolute path - use as is
          resolvedPath = refPath;
        } else {
          // Relative path without ../ or ./ - resolve relative to current directory
          const pathParts = basePath.split('/');
          pathParts.pop(); // remove filename
          pathParts.push(refPath);
          resolvedPath = pathParts.join('/');
        }
        
        console.log(`Resolved path: "${resolvedPath}"`);
        return resolveSchema(resolvedPath);
      }
      
      // Recursively process object properties
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = await resolveRefs(value, basePath);
      }
      return resolved;
    };
    
    return resolveRefs(schema, schemaPath);
  };

  useEffect(() => {
    if (!selectedTemplate) return;
    let active = true;
    
    resolveSchema(selectedTemplate.schemaPath)
      .then((resolvedSchema) => {
        if (!active) return;
        console.log('Schema loaded and resolved successfully:', resolvedSchema);
        setSchema(resolvedSchema);
        setView('builder');
      })
      .catch((error) => {
        console.error('Failed to load schema:', error);
        if (!active) return;
        alert(`Failed to load workflow schema: ${error.message}`);
        setSelectedTemplate(null);
        setView('templates');
      });
      
    return () => {
      active = false;
    };
  }, [selectedTemplate]);

  const uiSchema = useMemo(() => (schema?.["ui:schema"] ?? {}), [schema]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'SIMPLE': return 'text-green-700 bg-green-100';
      case 'MODERATE': return 'text-yellow-700 bg-yellow-100';
      case 'COMPLEX': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const handleSubmit = (data: any) => {
    alert(`Workflow completed!\n\n${JSON.stringify(data.formData, null, 2)}`);
    // In real app, this would save the workflow data
  };

  if (view === 'builder' && schema && selectedTemplate) {
    return (
      <RequireAuth>
        <AppShell>
          <div className="space-y-4 md:space-y-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setView('templates');
                  setSelectedTemplate(null);
                  setSchema(null);
                  setFormData({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${selectedTemplate.color} flex items-center justify-center`}>
                  <Icon icon={selectedTemplate.icon} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">{selectedTemplate.name}</h1>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>
            </div>

            {/* Workflow Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 rjsf">
              <Form 
                schema={schema as any} 
                uiSchema={uiSchema} 
                formData={formData} 
                onChange={(e) => setFormData(e.formData)} 
                onSubmit={handleSubmit}
                validator={validator}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <button 
                    type="button"
                    onClick={() => {
                      setView('templates');
                      setSelectedTemplate(null);
                      setSchema(null);
                      setFormData({});
                    }}
                    className="flex-1 btn-secondary"
                  >
                    <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-2" />
                    Back to Templates
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({})}
                    className="flex-1 btn-secondary"
                  >
                    <Icon icon="material-symbols:refresh" className="w-4 h-4 mr-2" />
                    Reset Form
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    <Icon icon="material-symbols:check" className="w-4 h-4 mr-2" />
                    Submit Workflow
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Workflow Builder</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => setView('templates')}
                className="btn-primary"
              >
                <Icon icon="material-symbols:play-arrow" className="w-4 h-4 mr-2" />
                Start Workflow
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:account-tree" className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-blue-900">{WORKFLOW_TEMPLATES.length}</div>
                  <div className="text-xs md:text-sm text-blue-600">Templates</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:timer" className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-green-900">
                    {WORKFLOW_TEMPLATES.filter(t => t.complexity === 'SIMPLE').length}
                  </div>
                  <div className="text-xs md:text-sm text-green-600">Simple</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:trending-up" className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-yellow-900">
                    {WORKFLOW_TEMPLATES.filter(t => t.complexity === 'MODERATE').length}
                  </div>
                  <div className="text-xs md:text-sm text-yellow-600">Moderate</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 md:p-4 border border-red-200">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:psychology" className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                <div>
                  <div className="text-lg md:text-xl font-bold text-red-900">
                    {WORKFLOW_TEMPLATES.filter(t => t.complexity === 'COMPLEX').length}
                  </div>
                  <div className="text-xs md:text-sm text-red-600">Complex</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap capitalize ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Workflow Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon icon={template.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{template.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:schedule" className="w-4 h-4" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <span>Start</span>
                      <Icon icon="material-symbols:arrow-forward" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <Icon icon="material-symbols:search-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No workflow templates found for this category</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
