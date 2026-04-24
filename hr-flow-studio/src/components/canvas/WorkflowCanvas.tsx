import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Node,
} from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { StartNode } from '@/components/nodes/StartNode';
import { TaskNode } from '@/components/nodes/TaskNode';
import { ApprovalNode } from '@/components/nodes/ApprovalNode';
import { AutomatedNode } from '@/components/nodes/AutomatedNode';
import { EndNode } from '@/components/nodes/EndNode';
import { NodeType } from '@/types/workflow.types';
import { toast } from 'sonner';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

interface ContextMenu {
  x: number; y: number; nodeId: string;
}

const Inner = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelected = useWorkflowStore((s) => s.setSelectedNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const selectedId = useWorkflowStore((s) => s.selectedNodeId);

  const [menu, setMenu] = useState<ContextMenu | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(type, position);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} node added`);
    },
    [addNode, screenToFlowPosition]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => setSelected(node.id);
  const onPaneClick = () => { setSelected(null); setMenu(null); };
  const onNodeContextMenu = (e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    const rect = wrapperRef.current?.getBoundingClientRect();
    setMenu({ x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0), nodeId: node.id });
    setSelected(node.id);
  };
  const onEdgeClick = (_: React.MouseEvent, edge: any) => {
    if (window.confirm('Delete this connection?')) {
      deleteEdge(edge.id);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault(); undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault(); redo();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault(); deleteNode(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedId, deleteNode]);

  const isEmpty = nodes.length === 0;

  return (
    <div ref={wrapperRef} className="relative flex-1 h-full dot-grid bg-background" onClick={() => setMenu(null)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeClick={onEdgeClick}
        defaultEdgeOptions={{ animated: true }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="transparent" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          style={{ marginBottom: 80 }}
          nodeColor={(n) => {
            const t = (n.data as any)?.nodeType;
            return ({
              start: '#22c55e', task: '#3b82f6', approval: '#f97316', automated: '#a855f7', end: '#ef4444',
            } as any)[t] || '#94a3b8';
          }}
        />
      </ReactFlow>
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground/70">Drag nodes from the sidebar to get started</div>
            <div className="text-sm text-muted-foreground mt-1">Build your HR workflow visually</div>
          </div>
        </div>
      )}
      {menu && (
        <div
          className="absolute z-50 min-w-[140px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in-up"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary"
            onClick={() => { setSelected(menu.nodeId); setMenu(null); }}
          >Edit</button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary"
            onClick={() => { duplicateNode(menu.nodeId); setMenu(null); toast.success('Node duplicated'); }}
          >Duplicate</button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            onClick={() => { deleteNode(menu.nodeId); setMenu(null); toast.success('Node deleted'); }}
          >Delete</button>
        </div>
      )}
    </div>
  );
};

export const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <Inner />
  </ReactFlowProvider>
);
