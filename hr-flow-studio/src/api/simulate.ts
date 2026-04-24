import { Edge, Node } from 'reactflow';
import { WorkflowNodeData, SimulationResult, SimulationStep } from '@/types/workflow.types';
import { validateWorkflow, bfsFromStart } from '@/utils/graphUtils';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface SimulatePayload {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export async function simulateWorkflow(payload: SimulatePayload): Promise<SimulationResult> {
  const { nodes, edges } = payload;
  const errors = validateWorkflow(nodes, edges);
  if (errors.some((e) => e.type === 'error')) {
    return { steps: [], errors };
  }
  const start = nodes.find((n) => n.data.nodeType === 'start');
  if (!start) return { steps: [], errors };

  const order = bfsFromStart(nodes, edges, start.id);
  const steps: SimulationStep[] = [];
  for (const n of order) {
    await delay(200);
    const r = Math.random();
    const status: SimulationStep['status'] = r < 0.7 ? 'success' : r < 0.9 ? 'pending' : 'failed';
    steps.push({
      nodeId: n.id,
      label: n.data.label,
      type: n.data.nodeType,
      status,
      message:
        status === 'success'
          ? 'Step completed successfully'
          : status === 'pending'
          ? 'Awaiting response'
          : 'Step execution failed',
    });
  }
  return { steps, errors };
}
