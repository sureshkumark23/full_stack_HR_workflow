import { Edge, Node } from 'reactflow';
import { WorkflowNodeData, ValidationError } from '@/types/workflow.types';

export function detectCycle(nodes: Node<WorkflowNodeData>[], edges: Edge[]): boolean {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => adj.get(e.source)?.push(e.target));

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  nodes.forEach((n) => color.set(n.id, WHITE));

  const dfs = (u: string): boolean => {
    color.set(u, GRAY);
    for (const v of adj.get(u) || []) {
      const c = color.get(v);
      if (c === GRAY) return true;
      if (c === WHITE && dfs(v)) return true;
    }
    color.set(u, BLACK);
    return false;
  };

  for (const n of nodes) {
    if (color.get(n.id) === WHITE && dfs(n.id)) return true;
  }
  return false;
}

export function bfsFromStart(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  startId: string
): Node<WorkflowNodeData>[] {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => adj.get(e.source)?.push(e.target));
  const visited = new Set<string>();
  const order: Node<WorkflowNodeData>[] = [];
  const queue = [startId];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = nodeMap.get(id);
    if (node) order.push(node);
    for (const v of adj.get(id) || []) if (!visited.has(v)) queue.push(v);
  }
  return order;
}

export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const startNodes = nodes.filter((n) => n.data.nodeType === 'start');
  const endNodes = nodes.filter((n) => n.data.nodeType === 'end');

  if (startNodes.length === 0) errors.push({ type: 'error', message: 'No Start node found' });
  if (endNodes.length === 0) errors.push({ type: 'error', message: 'No End node found' });

  if (startNodes.length > 0) {
    const s = startNodes[0];
    const out = edges.filter((e) => e.source === s.id);
    const inc = edges.filter((e) => e.target === s.id);
    if (out.length === 0) errors.push({ type: 'error', message: 'Start node has no outgoing edges', nodeId: s.id });
    if (inc.length > 0) errors.push({ type: 'error', message: 'Start node should not have incoming edges', nodeId: s.id });
  }
  if (endNodes.length > 0) {
    const e = endNodes[0];
    const inc = edges.filter((ed) => ed.target === e.id);
    const out = edges.filter((ed) => ed.source === e.id);
    if (inc.length === 0) errors.push({ type: 'error', message: 'End node has no incoming edges', nodeId: e.id });
    if (out.length > 0) errors.push({ type: 'error', message: 'End node should not have outgoing edges', nodeId: e.id });
  }

  // disconnected
  nodes.forEach((n) => {
    const has = edges.some((e) => e.source === n.id || e.target === n.id);
    if (!has) errors.push({ type: 'warning', message: `Node "${n.data.label}" is disconnected`, nodeId: n.id });
  });

  if (detectCycle(nodes, edges)) errors.push({ type: 'error', message: 'Cycle detected in workflow' });

  return errors;
}
