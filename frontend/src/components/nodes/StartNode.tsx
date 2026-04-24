import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { StartNodeData } from '@/types/workflow.types';
import { NodeWrapper } from './NodeWrapper';
import { useWorkflowStore } from '@/store/workflowStore';

export const StartNode = ({ id, data }: NodeProps<StartNodeData>) => {
  const edges = useWorkflowStore((s) => s.edges);
  const hasIncoming = edges.some((e) => e.target === id);
  return (
    <NodeWrapper type="start" hasError={hasIncoming} variant="pill">
      <div className="node-pill bg-node-start text-white rounded-full px-6 py-3 shadow-md min-w-[180px] flex items-center justify-center gap-2 font-semibold">
        <Play className="h-4 w-4 fill-white" />
        <span className="truncate">{data.title || data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </NodeWrapper>
  );
};
