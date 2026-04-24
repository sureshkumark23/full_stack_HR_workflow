import { Handle, Position, NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { AutomatedNodeData } from '@/types/workflow.types';
import { NodeWrapper } from './NodeWrapper';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';

export const AutomatedNode = ({ id, data }: NodeProps<AutomatedNodeData>) => {
  const edges = useWorkflowStore((s) => s.edges);
  const { automations } = useAutomations();
  const connected = edges.some((e) => e.source === id || e.target === id);
  const action = automations.find((a) => a.id === data.actionId);
  return (
    <NodeWrapper type="automated" hasError={!connected}>
      <div className="node-card bg-card rounded-xl border border-border shadow-sm w-[240px] overflow-hidden">
        <div className="border-l-4 border-node-automated pl-3 pr-3 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-node-automated" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Automated</span>
          </div>
          <div className="font-semibold text-sm text-foreground truncate">{data.title || 'Untitled Step'}</div>
          {action && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-node-automated/10 text-node-automated text-xs font-medium">
                {action.label}
              </span>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </NodeWrapper>
  );
};
