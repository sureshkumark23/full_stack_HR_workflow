export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  label: string;
  nodeType: NodeType;
  validationError?: string;
}

export interface StartNodeData extends BaseNodeData {
  nodeType: 'start';
  title: string;
  metadata: Array<{ key: string; value: string }>;
}

export interface TaskNodeData extends BaseNodeData {
  nodeType: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Array<{ key: string; value: string }>;
}

export interface ApprovalNodeData extends BaseNodeData {
  nodeType: 'approval';
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'VP';
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  nodeType: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  nodeType: 'end';
  endMessage: string;
  generateSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface SimulationStep {
  nodeId: string;
  label: string;
  type: NodeType;
  status: 'success' | 'pending' | 'failed';
  message: string;
}

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  errors: ValidationError[];
}

export interface AutomationOption {
  id: string;
  label: string;
  params: string[];
}
