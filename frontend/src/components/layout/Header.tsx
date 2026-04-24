import { useRef, useState } from 'react';
import { Workflow, ShieldCheck, Play, Download, Upload, Save } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

interface Props {
  onRun: () => void;
  onValidate: () => void;
}

export const Header = ({ onRun, onValidate }: Props) => {
  const name = useWorkflowStore((s) => s.workflowName);
  const setName = useWorkflowStore((s) => s.setWorkflowName);
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) throw new Error('Invalid');
        importWorkflow(data);
        toast.success('Workflow imported successfully');
      } catch {
        toast.error('Failed to import workflow');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    localStorage.setItem('hrflow:saved', JSON.stringify({ nodes, edges, name }));
    toast.success('Workflow saved locally');
  };

  return (
    <header className="h-14 shrink-0 bg-card border-b border-border flex items-center px-4 gap-3">
      <div className="flex items-center gap-2 w-[224px]">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
          <Workflow className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">HR Flow Studio</div>
          <div className="text-[10px] text-muted-foreground">Workflow Designer</div>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-3">
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              className="text-sm font-semibold bg-secondary border border-border rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-semibold text-foreground hover:bg-secondary px-3 py-1 rounded-md transition-colors"
              title="Click to rename"
            >
              {name}
            </button>
          )}
          <span className="text-xs text-muted-foreground">
            {nodes.length} nodes · {edges.length} connections
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconBtn icon={ShieldCheck} label="Validate" onClick={onValidate} />
        <IconBtn icon={Play} label="Run / Simulate" onClick={onRun} primary />
        <IconBtn icon={Download} label="Export JSON" onClick={exportWorkflow} />
        <IconBtn icon={Upload} label="Import JSON" onClick={() => fileRef.current?.click()} />
        <IconBtn icon={Save} label="Save (⌘S)" onClick={handleSave} />
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
      </div>
    </header>
  );
};

const IconBtn = ({ icon: Icon, label, onClick, primary }: any) => (
  <button
    onClick={onClick}
    title={label}
    className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all ${
      primary
        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);
