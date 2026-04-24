import { Handle, Position, NodeProps } from 'reactflow';
import { Flag } from 'lucide-react';
import { EndNodeData } from '@/types/workflow.types';
import { NodeWrapper } from './NodeWrapper';
import { useWorkflowStore } from '@/store/workflowStore';

export const EndNode = ({ id, data }: NodeProps<EndNodeData>) => {
  const edges = useWorkflowStore((s) => s.edges);
  const hasOutgoing = edges.some((e) => e.source === id);
  return (
    <NodeWrapper type="end" hasError={hasOutgoing} variant="pill">
      <Handle type="target" position={Position.Top} />
      <div className="node-pill bg-node-end text-white rounded-full px-6 py-3 shadow-md min-w-[180px] flex items-center justify-center gap-2 font-semibold">
        <Flag className="h-4 w-4 fill-white" />
        <span className="truncate">{data.endMessage || data.label || 'End'}</span>
      </div>
    </NodeWrapper>
  );
};
