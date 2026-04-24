import { useState, useEffect } from 'react';
import { TaskNodeData } from '@/types/workflow.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { KeyValueEditor } from './KeyValueEditor';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

export const TaskForm = ({ id, data }: { id: string; data: TaskNodeData }) => {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [assignee, setAssignee] = useState(data.assignee);
  const [dueDate, setDueDate] = useState(data.dueDate);
  const [customFields, setCustomFields] = useState(data.customFields || []);

  useEffect(() => {
    setTitle(data.title); setDescription(data.description); setAssignee(data.assignee);
    setDueDate(data.dueDate); setCustomFields(data.customFields || []);
  }, [id]);

  const apply = () => {
    update(id, { title, label: title, description, assignee, dueDate, customFields } as Partial<TaskNodeData>);
    toast.success('Task node updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title <span className="text-destructive">*</span></Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className={!title ? 'border-destructive' : ''} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label>Assignee</Label>
        <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="e.g. Jane Doe" />
      </div>
      <div>
        <Label>Due Date</Label>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <Label className="mb-2 block">Custom Fields</Label>
        <KeyValueEditor items={customFields} onChange={setCustomFields} addLabel="+ Add Custom Field" />
      </div>
      <Button onClick={apply} className="w-full">Apply Changes</Button>
    </div>
  );
};
