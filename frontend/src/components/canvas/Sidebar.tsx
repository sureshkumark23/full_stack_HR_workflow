import { LayoutDashboard, Workflow, Settings } from 'lucide-react';
import { NodePaletteCard } from './NodePaletteCard';

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Workflow, label: 'Workflows', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = () => {
  return (
    <aside className="w-[240px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full overflow-hidden">
      <nav className="px-3 py-4 border-b border-sidebar-border space-y-1">
        {nav.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Node Palette
        </div>
        <div className="space-y-2">
          <NodePaletteCard type="start" title="Start Node" description="Workflow entry point" />
          <NodePaletteCard type="task" title="Task Node" description="Manual work item" />
          <NodePaletteCard type="approval" title="Approval Node" description="Requires sign-off" />
          <NodePaletteCard type="automated" title="Automated Step" description="System action" />
          <NodePaletteCard type="end" title="End Node" description="Workflow completion" />
        </div>
        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="text-[11px] font-semibold text-primary mb-1">Tip</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Drag nodes onto the canvas. Use <kbd className="px-1 py-0.5 rounded bg-background border text-[10px]">⌘Z</kbd> to undo.
          </div>
        </div>
      </div>
    </aside>
  );
};
