import { Handle, Position, NodeProps } from 'reactflow';
import { CheckSquare, User, Calendar } from 'lucide-react';
import { TaskNodeData } from '@/types/workflow.types';
import { NodeWrapper } from './NodeWrapper';
import { useWorkflowStore } from '@/store/workflowStore';

export const TaskNode = ({ id, data }: NodeProps<TaskNodeData>) => {
  const edges = useWorkflowStore((s) => s.edges);
  const connected = edges.some((e) => e.source === id || e.target === id);
  return (
    <NodeWrapper type="task" hasError={!connected}>
      <div className="node-card bg-card rounded-xl border border-border shadow-sm w-[240px] overflow-hidden">
        <div className="border-l-4 border-node-task pl-3 pr-3 py-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-4 w-4 text-node-task" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Task</span>
          </div>
          <div className="font-semibold text-sm text-foreground truncate">{data.title || 'Untitled Task'}</div>
          {data.assignee && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{data.assignee}</span>
            </div>
          )}
          {data.dueDate && (
            <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground">
              <Calendar className="h-3 w-3" />
              {data.dueDate}
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </NodeWrapper>
  );
};
