import { Sidebar } from '@/components/canvas/Sidebar';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeConfigPanel } from '@/components/canvas/NodeConfigPanel';

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Left Sidebar (Palette) */}
      <Sidebar />
      
      {/* 2. Middle Canvas (React Flow) */}
      <main className="flex-1 h-full relative">
        <WorkflowCanvas />
      </main>
      
      {/* 3. Right Sidebar (Forms) */}
      <NodeConfigPanel />
    </div>
  );
};

export default Index;