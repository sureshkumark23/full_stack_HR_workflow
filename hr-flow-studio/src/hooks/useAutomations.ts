import { useEffect, useState } from 'react';
import { getAutomations } from '@/api/automations';
import { AutomationOption } from '@/types/workflow.types';

let cache: AutomationOption[] | null = null;

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationOption[]>(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    getAutomations()
      .then((d) => {
        if (!alive) return;
        cache = d;
        setAutomations(d);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(String(e));
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { automations, loading, error };
}
