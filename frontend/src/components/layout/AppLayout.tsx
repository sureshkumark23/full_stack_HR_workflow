import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from '@/components/canvas/Sidebar';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeConfigPanel } from '@/components/canvas/NodeConfigPanel';
import { SimulationModal } from '@/components/simulation/SimulationModal';
import { useWorkflowStore } from '@/store/workflowStore';
import { toast } from 'sonner';

export const AppLayout = () => {
  const loadDefault = useWorkflowStore((s) => s.loadDefault);
  const validate = useWorkflowStore((s) => s.validate);
  const nodes = useWorkflowStore((s) => s.nodes);
  const [simOpen, setSimOpen] = useState(false);

  useEffect(() => {
    if (nodes.length === 0) loadDefault();
  }, []);

  const onValidate = () => {
    const errs = validate();
    if (errs.length === 0) toast.success('Workflow is valid ✓');
    else toast.error(`${errs.length} validation issue${errs.length > 1 ? 's' : ''} found`);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header onRun={() => setSimOpen(true)} onValidate={onValidate} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <WorkflowCanvas />
        <NodeConfigPanel />
      </div>
      <SimulationModal open={simOpen} onClose={() => setSimOpen(false)} />
    </div>
  );
};
