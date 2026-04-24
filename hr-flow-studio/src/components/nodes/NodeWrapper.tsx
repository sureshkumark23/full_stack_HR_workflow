import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { NodeType } from '@/types/workflow.types';

const typeMeta: Record<NodeType, { label: string; color: string }> = {
  start: { label: 'START', color: 'bg-node-start' },
  task: { label: 'TASK', color: 'bg-node-task' },
  approval: { label: 'APPROVAL', color: 'bg-node-approval' },
  automated: { label: 'AUTOMATED', color: 'bg-node-automated' },
  end: { label: 'END', color: 'bg-node-end' },
};

interface Props {
  type: NodeType;
  hasError?: boolean;
  children: ReactNode;
  variant?: 'card' | 'pill';
  className?: string;
}

export const NodeWrapper = ({ type, hasError, children, variant = 'card', className = '' }: Props) => {
  const meta = typeMeta[type];
  return (
    <div className={`relative ${variant === 'card' ? 'node-card' : 'node-pill'} ${className}`}>
      <span className={`absolute -top-2 -right-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-white ${meta.color} shadow-sm`}>
        {meta.label}
      </span>
      {hasError && (
        <span className="absolute -top-2 -left-2 z-10 h-5 w-5 rounded-full bg-destructive flex items-center justify-center shadow-sm" title="Validation error">
          <AlertTriangle className="h-3 w-3 text-white" />
        </span>
      )}
      {children}
    </div>
  );
};
