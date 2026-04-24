import { create } from 'zustand';
import { Edge, Node, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, addEdge as rfAddEdge, Connection } from 'reactflow';
import { WorkflowNodeData, NodeType, ValidationError, SimulationResult } from '@/types/workflow.types';
import { simulateWorkflow } from '@/api/simulate';
import { validateWorkflow } from '@/utils/graphUtils';

type WNode = Node<WorkflowNodeData>;

interface HistoryEntry {
  nodes: WNode[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: WNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  workflowName: string;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  validationErrors: ValidationError[];

  setNodes: (nodes: WNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;

  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  deleteEdge: (id: string) => void;

  setSelectedNode: (id: string | null) => void;
  setWorkflowName: (name: string) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  runSimulation: () => Promise<void>;
  clearSimulation: () => void;
  validate: () => ValidationError[];

  exportWorkflow: () => void;
  importWorkflow: (data: { nodes: WNode[]; edges: Edge[]; metadata?: { name?: string } }) => void;
  loadDefault: () => void;
}

const defaultDataFor = (type: NodeType, label: string): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return { nodeType: 'start', label, title: label, metadata: [] };
    case 'task':
      return {
        nodeType: 'task', label, title: label, description: '', assignee: '', dueDate: '', customFields: [],
      };
    case 'approval':
      return { nodeType: 'approval', label, title: label, approverRole: 'Manager', autoApproveThreshold: 3 };
    case 'automated':
      return { nodeType: 'automated', label, title: label, actionId: '', actionParams: {} };
    case 'end':
      return { nodeType: 'end', label, endMessage: label, generateSummary: false };
  }
};

const labelFor = (type: NodeType) => ({
  start: 'Start', task: 'New Task', approval: 'New Approval', automated: 'Automated Step', end: 'End',
}[type]);

const buildDefault = (): { nodes: WNode[]; edges: Edge[] } => {
  const nodes: WNode[] = [
    { id: 's1', type: 'start', position: { x: 360, y: 40 }, data: defaultDataFor('start', 'Onboarding Start') },
    { id: 't1', type: 'task', position: { x: 320, y: 180 }, data: { ...defaultDataFor('task', 'Collect Documents'), title: 'Collect Documents', assignee: 'HR Team', dueDate: '' } as any },
    { id: 'a1', type: 'approval', position: { x: 320, y: 340 }, data: { ...defaultDataFor('approval', 'Manager Approval'), title: 'Manager Approval' } as any },
    { id: 'au1', type: 'automated', position: { x: 320, y: 500 }, data: { ...defaultDataFor('automated', 'Send Welcome Email'), title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new.hire@company.com', subject: 'Welcome aboard!' } } as any },
    { id: 'e1', type: 'end', position: { x: 360, y: 660 }, data: defaultDataFor('end', 'Onboarding Complete') },
  ];
  const edges: Edge[] = [
    { id: 'e-s1-t1', source: 's1', target: 't1', animated: true },
    { id: 'e-t1-a1', source: 't1', target: 'a1', animated: true },
    { id: 'e-a1-au1', source: 'a1', target: 'au1', animated: true },
    { id: 'e-au1-e1', source: 'au1', target: 'e1', animated: true },
  ];
  return { nodes, edges };
};

let nodeCounter = 100;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowName: localStorage.getItem('hrflow:name') || 'Employee Onboarding',
  simulationResult: null,
  isSimulating: false,
  history: [],
  historyIndex: -1,
  validationErrors: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as WNode[] }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (conn) => {
    const { nodes } = get();
    const src = nodes.find((n) => n.id === conn.source);
    const tgt = nodes.find((n) => n.id === conn.target);
    if (src?.data.nodeType === 'end') return;
    if (tgt?.data.nodeType === 'start') return;
    get().pushHistory();
    set({ edges: rfAddEdge({ ...conn, animated: true }, get().edges) });
  },

  addNode: (type, position) => {
    get().pushHistory();
    const id = `n${++nodeCounter}`;
    const label = labelFor(type);
    const node: WNode = { id, type, position, data: defaultDataFor(type, label) };
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    });
  },

  deleteNode: (id) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  duplicateNode: (id) => {
    const n = get().nodes.find((x) => x.id === id);
    if (!n) return;
    get().pushHistory();
    const newId = `n${++nodeCounter}`;
    set({
      nodes: [...get().nodes, { ...n, id: newId, position: { x: n.position.x + 40, y: n.position.y + 40 }, selected: false }],
    });
  },

  deleteEdge: (id) => {
    get().pushHistory();
    set({ edges: get().edges.filter((e) => e.id !== id) });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setWorkflowName: (name) => {
    localStorage.setItem('hrflow:name', name);
    set({ workflowName: name });
  },

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    set({ history: newHistory.slice(-50), historyIndex: Math.min(newHistory.length - 1, 49) });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const entry = history[historyIndex - 1];
    set({ nodes: entry.nodes, edges: entry.edges, historyIndex: historyIndex - 1 });
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const entry = history[historyIndex + 1];
    set({ nodes: entry.nodes, edges: entry.edges, historyIndex: historyIndex + 1 });
  },

  runSimulation: async () => {
    set({ isSimulating: true, simulationResult: null });
    const { nodes, edges } = get();
    const result = await simulateWorkflow({ nodes, edges });
    set({ simulationResult: result, validationErrors: result.errors, isSimulating: false });
  },
  clearSimulation: () => set({ simulationResult: null }),
  validate: () => {
    const errs = validateWorkflow(get().nodes, get().edges);
    set({ validationErrors: errs });
    return errs;
  },

  exportWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    const data = { nodes, edges, metadata: { name: workflowName, createdAt: new Date().toISOString(), version: '1.0' } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importWorkflow: (data) => {
    get().pushHistory();
    set({
      nodes: data.nodes || [],
      edges: data.edges || [],
      workflowName: data.metadata?.name || get().workflowName,
      selectedNodeId: null,
    });
  },

  loadDefault: () => {
    const d = buildDefault();
    set({ nodes: d.nodes, edges: d.edges, history: [{ nodes: d.nodes, edges: d.edges }], historyIndex: 0 });
  },
}));
