import { SimulationResult, WorkflowNodeData } from '@/types/workflow.types';
import { Node, Edge } from 'reactflow';

export const simulateWorkflow = async (data: { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }): Promise<SimulationResult> => {
  try {
    const response = await fetch('http://127.0.0.1:8080/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    return {
      success: result.status === 'success',
      errors: result.status === 'error' ? [{ nodeId: 'sys', message: result.logs[0] }] : [],
      logs: result.logs || [],
    };
  } catch (error) {
    console.error('Simulation error:', error);
    return {
      success: false,
      errors: [{ nodeId: 'sys', message: 'Could not connect to Python backend.' }],
      logs: [],
    };
  }
};