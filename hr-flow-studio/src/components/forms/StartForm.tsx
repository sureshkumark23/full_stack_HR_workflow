import { useState, useEffect } from 'react';
import { StartNodeData } from '@/types/workflow.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeyValueEditor } from './KeyValueEditor';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

export const StartForm = ({ id, data }: { id: string; data: StartNodeData }) => {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const [title, setTitle] = useState(data.title);
  const [metadata, setMetadata] = useState(data.metadata || []);

  useEffect(() => {
    setTitle(data.title);
    setMetadata(data.metadata || []);
  }, [id]);

  const apply = () => {
    update(id, { title, label: title, metadata } as Partial<StartNodeData>);
    toast.success('Start node updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Start Title <span className="text-destructive">*</span></Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={!title ? 'border-destructive' : ''}
        />
      </div>
      <div>
        <Label className="mb-2 block">Metadata</Label>
        <KeyValueEditor items={metadata} onChange={setMetadata} addLabel="+ Add Metadata" />
      </div>
      <Button onClick={apply} className="w-full">Apply Changes</Button>
    </div>
  );
};
