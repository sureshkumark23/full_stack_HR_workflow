import { useState, useEffect } from 'react';
import { ApprovalNodeData } from '@/types/workflow.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

export const ApprovalForm = ({ id, data }: { id: string; data: ApprovalNodeData }) => {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const [title, setTitle] = useState(data.title);
  const [role, setRole] = useState<ApprovalNodeData['approverRole']>(data.approverRole);
  const [threshold, setThreshold] = useState<number>(data.autoApproveThreshold ?? 3);

  useEffect(() => {
    setTitle(data.title); setRole(data.approverRole); setThreshold(data.autoApproveThreshold ?? 3);
  }, [id]);

  const apply = () => {
    update(id, { title, label: title, approverRole: role, autoApproveThreshold: threshold } as Partial<ApprovalNodeData>);
    toast.success('Approval node updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title <span className="text-destructive">*</span></Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className={!title ? 'border-destructive' : ''} />
      </div>
      <div>
        <Label>Approver Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="HRBP">HRBP</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="VP">VP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Auto-approve Threshold (days)</Label>
        <Input type="number" min={0} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        <p className="text-xs text-muted-foreground mt-1">Auto-approve if no response within {threshold} days</p>
      </div>
      <Button onClick={apply} className="w-full">Apply Changes</Button>
    </div>
  );
};
