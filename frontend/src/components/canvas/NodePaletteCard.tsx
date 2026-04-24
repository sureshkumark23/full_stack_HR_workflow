import { NodeType } from '@/types/workflow.types';
import { Play, CheckSquare, ShieldCheck, Zap, Flag, LucideIcon } from 'lucide-react';

interface Props {
  type: NodeType;
  title: string;
  description: string;
}

const meta: Record<NodeType, { icon: LucideIcon; color: string; border: string }> = {
  start: { icon: Play, color: 'text-node-start', border: 'border-l-node-start' },
  task: { icon: CheckSquare, color: 'text-node-task', border: 'border-l-node-task' },
  approval: { icon: ShieldCheck, color: 'text-node-approval', border: 'border-l-node-approval' },
  automated: { icon: Zap, color: 'text-node-automated', border: 'border-l-node-automated' },
  end: { icon: Flag, color: 'text-node-end', border: 'border-l-node-end' },
};

export const NodePaletteCard = ({ type, title, description }: Props) => {
  const { icon: Icon, color, border } = meta[type];
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`group cursor-grab active:cursor-grabbing bg-card border border-border ${border} border-l-4 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground leading-tight mt-0.5">{description}</div>
        </div>
      </div>
    </div>
  );
};
