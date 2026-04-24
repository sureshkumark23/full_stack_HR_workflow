import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KV { key: string; value: string }

interface Props {
  items: KV[];
  onChange: (items: KV[]) => void;
  addLabel?: string;
}

export const KeyValueEditor = ({ items, onChange, addLabel = '+ Add Item' }: Props) => {
  const update = (i: number, patch: Partial<KV>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { key: '', value: '' }]);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            placeholder="Key"
            value={it.key}
            onChange={(e) => update(i, { key: e.target.value })}
            className="h-9"
          />
          <Input
            placeholder="Value"
            value={it.value}
            onChange={(e) => update(i, { value: e.target.value })}
            className="h-9"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="h-3.5 w-3.5 mr-1" /> {addLabel.replace(/^\+\s*/, '')}
      </Button>
    </div>
  );
};
