import { X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { StartForm } from '@/components/forms/StartForm';
import { TaskForm } from '@/components/forms/TaskForm';
import { ApprovalForm } from '@/components/forms/ApprovalForm';
import { AutomatedForm } from '@/components/forms/AutomatedForm';
import { EndForm } from '@/components/forms/EndForm';

export const NodeConfigPanel = () => {
  const selectedId = useWorkflowStore((s) => s.selectedNodeId);
  const node = useWorkflowStore((s) => s.nodes.find((n) => n.id === selectedId));
  const setSelected = useWorkflowStore((s) => s.setSelectedNode);

  return (
    <aside className="w-[320px] shrink-0 bg-card border-l border-border h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Configuration</div>
          <div className="text-sm font-semibold text-foreground">
            {node ? node.data.label || 'Untitled' : 'No selection'}
          </div>
        </div>
        {node && (
          <button
            onClick={() => setSelected(null)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!node && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="text-sm font-medium text-foreground">Select a node to configure</div>
            <div className="text-xs text-muted-foreground mt-1">
              Click any node on the canvas to edit its properties.
            </div>
          </div>
        )}
        {node?.data.nodeType === 'start' && <StartForm id={node.id} data={node.data as any} />}
        {node?.data.nodeType === 'task' && <TaskForm id={node.id} data={node.data as any} />}
        {node?.data.nodeType === 'approval' && <ApprovalForm id={node.id} data={node.data as any} />}
        {node?.data.nodeType === 'automated' && <AutomatedForm id={node.id} data={node.data as any} />}
        {node?.data.nodeType === 'end' && <EndForm id={node.id} data={node.data as any} />}
      </div>
    </aside>
  );
};
