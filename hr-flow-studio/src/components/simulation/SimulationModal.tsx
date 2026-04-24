import { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, Loader2, Play, CheckSquare, ShieldCheck, Zap, Flag } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { validateWorkflow } from '@/utils/graphUtils';
import { NodeType, SimulationStep } from '@/types/workflow.types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const nodeIcon: Record<NodeType, any> = {
  start: Play, task: CheckSquare, approval: ShieldCheck, automated: Zap, end: Flag,
};

const statusStyles = {
  success: { dot: 'bg-success', badge: 'bg-success/10 text-success border-success/20' },
  pending: { dot: 'bg-warning', badge: 'bg-warning/10 text-warning border-warning/20' },
  failed: { dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export const SimulationModal = ({ open, onClose }: Props) => {
  const [tab, setTab] = useState<'log' | 'validation'>('validation');
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const result = useWorkflowStore((s) => s.simulationResult);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const runSimulation = useWorkflowStore((s) => s.runSimulation);
  const clearSimulation = useWorkflowStore((s) => s.clearSimulation);

  const [visibleSteps, setVisibleSteps] = useState<SimulationStep[]>([]);

  useEffect(() => {
    if (open) {
      setTab('validation');
      clearSimulation();
      setVisibleSteps([]);
      runSimulation();
    }
  }, [open]);

  useEffect(() => {
    if (!result) return;
    setVisibleSteps([]);
    if (result.errors.some((e) => e.type === 'error')) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleSteps(result.steps.slice(0, i));
      if (i >= result.steps.length) clearInterval(interval);
    }, 400);
    setTab('log');
    return () => clearInterval(interval);
  }, [result]);

  if (!open) return null;

  const liveErrors = result?.errors ?? validateWorkflow(nodes, edges);
  const hasBlockingErrors = liveErrors.some((e) => e.type === 'error');

  const checks = [
    { label: 'Has Start node', pass: nodes.some((n) => n.data.nodeType === 'start') },
    { label: 'Has End node', pass: nodes.some((n) => n.data.nodeType === 'end') },
    {
      label: 'All nodes connected',
      pass: nodes.every((n) => edges.some((e) => e.source === n.id || e.target === n.id)) && nodes.length > 0,
    },
    { label: 'No cycles detected', pass: !liveErrors.some((e) => e.message.includes('Cycle')) },
    { label: 'Start has no incoming edges', pass: !liveErrors.some((e) => e.message.includes('Start node should not')) },
    { label: 'End has no outgoing edges', pass: !liveErrors.some((e) => e.message.includes('End node should not')) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-card w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-base font-semibold">Workflow Simulation</div>
            <div className="text-xs text-muted-foreground">Validation and execution preview</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-secondary text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border px-6">
          {(['validation', 'log'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'validation' ? 'Validation' : 'Execution Log'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'validation' && (
            <div className="space-y-2">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  {c.pass ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  )}
                  <span className="text-sm">{c.label}</span>
                </div>
              ))}
              {liveErrors.filter((e) => e.type === 'warning').map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 text-warning text-sm">
                  ⚠️ {e.message}
                </div>
              ))}
            </div>
          )}

          {tab === 'log' && (
            <div>
              {isSimulating && !visibleSteps.length && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {!result ? 'Validating workflow...' : 'Simulating execution...'}
                </div>
              )}
              {hasBlockingErrors && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  Workflow has validation errors. Fix them before running execution.
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {liveErrors.filter((e) => e.type === 'error').map((e, i) => (
                      <li key={i}>{e.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!hasBlockingErrors && (
                <ol className="relative">
                  {visibleSteps.map((s, i) => {
                    const Icon = nodeIcon[s.type];
                    const styles = statusStyles[s.status];
                    return (
                      <li key={s.nodeId + i} className="relative pl-8 pb-4 animate-fade-in-up">
                        {i < visibleSteps.length - 1 && (
                          <span className="absolute left-[11px] top-6 w-0.5 h-full bg-border" />
                        )}
                        <span className={`absolute left-0 top-1 h-6 w-6 rounded-full ${styles.dot} flex items-center justify-center ring-4 ring-background`}>
                          <Icon className="h-3 w-3 text-white" />
                        </span>
                        <div className="bg-card border border-border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{s.label}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                              {s.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{s.message}</div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
