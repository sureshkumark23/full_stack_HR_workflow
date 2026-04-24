import { useState, useEffect, useMemo } from 'react';
import { AutomatedNodeData } from '@/types/workflow.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowStore } from '@/store/workflowStore';
import { useAutomations } from '@/hooks/useAutomations';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AutomatedForm = ({ id, data }: { id: string; data: AutomatedNodeData }) => {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const { automations, loading } = useAutomations();
  const [title, setTitle] = useState(data.title);
  const [actionId, setActionId] = useState(data.actionId);
  const [params, setParams] = useState<Record<string, string>>(data.actionParams || {});

  useEffect(() => {
    setTitle(data.title); setActionId(data.actionId); setParams(data.actionParams || {});
  }, [id]);

  const action = useMemo(() => automations.find((a) => a.id === actionId), [automations, actionId]);

  const onActionChange = (v: string) => {
    setActionId(v);
    setParams({}); // clear old values
  };

  const apply = () => {
    update(id, { title, label: title, actionId, actionParams: params } as Partial<AutomatedNodeData>);
    toast.success('Automated step updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title <span className="text-destructive">*</span></Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className={!title ? 'border-destructive' : ''} />
      </div>
      <div>
        <Label>Action</Label>
        {loading ? (
          <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading actions...
          </div>
        ) : (
          <Select value={actionId} onValueChange={onActionChange}>
            <SelectTrigger><SelectValue placeholder="Select an action" /></SelectTrigger>
            <SelectContent>
              {automations.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {action && (
        <div className="space-y-3 animate-fade-in-up">
          <Label className="block">Parameters</Label>
          {action.params.map((p) => (
            <div key={p}>
              <Label className="text-xs capitalize text-muted-foreground">{p}</Label>
              <Input
                value={params[p] || ''}
                onChange={(e) => setParams({ ...params, [p]: e.target.value })}
                placeholder={`Enter ${p}`}
              />
            </div>
          ))}
        </div>
      )}
      <Button onClick={apply} className="w-full">Apply Changes</Button>
    </div>
  );
};
