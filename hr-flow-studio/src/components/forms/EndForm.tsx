import { useState, useEffect } from 'react';
import { EndNodeData } from '@/types/workflow.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

export const EndForm = ({ id, data }: { id: string; data: EndNodeData }) => {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const [endMessage, setEndMessage] = useState(data.endMessage);
  const [generateSummary, setGenerateSummary] = useState(data.generateSummary);

  useEffect(() => {
    setEndMessage(data.endMessage); setGenerateSummary(data.generateSummary);
  }, [id]);

  const apply = () => {
    update(id, { endMessage, label: endMessage, generateSummary } as Partial<EndNodeData>);
    toast.success('End node updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>End Message</Label>
        <Input value={endMessage} onChange={(e) => setEndMessage(e.target.value)} />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <div className="text-sm font-medium">Generate Summary Report</div>
          <div className="text-xs text-muted-foreground">Send a recap when the workflow completes</div>
        </div>
        <ToggleSwitch checked={generateSummary} onChange={setGenerateSummary} label="Generate summary" />
      </div>
      <Button onClick={apply} className="w-full">Apply Changes</Button>
    </div>
  );
};
