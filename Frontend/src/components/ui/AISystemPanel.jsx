import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Activity, BrainCircuit, Database, Gauge, ShieldCheck, TriangleAlert } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL
  || (import.meta.env.PROD ? 'https://chat-doc-backend.vercel.app' : 'http://localhost:3000');

const StatusDot = ({ ready }) => (
  <span className={`inline-block h-2 w-2 rounded-full ${ready ? 'bg-emerald-400' : 'bg-amber-400'}`} />
);

const AISystemPanel = ({ refreshKey = 0 }) => {
  const { getToken } = useAuth();
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const healthResponse = await fetch(`${API_URL}/health`);
      if (healthResponse.ok) setHealth(await healthResponse.json());
      const token = await getToken();
      const metricsResponse = await fetch(`${API_URL}/metrics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (metricsResponse.ok) setMetrics(await metricsResponse.json());
    } catch {
      setHealth(null);
    }
  }, [getToken]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15_000);
    return () => clearInterval(interval);
  }, [refresh, refreshKey]);

  return (
    <div className="theme-border mt-6 space-y-3 border-t pt-5">
      <div className="flex items-center justify-between">
        <p className="theme-body text-xs font-semibold uppercase tracking-[0.16em]">AI system</p>
        <span className="theme-body flex items-center gap-1.5 text-[11px]"><StatusDot ready={Boolean(health)} />{health ? 'Online' : 'Offline'}</span>
      </div>

      {!health?.aiConfigured && (
        <div className="flex gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-700 dark:text-amber-200">
          <TriangleAlert className="mt-0.5 shrink-0" size={15} />
          Add an API key for the selected AI provider to enable indexing and answers.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="theme-subtle rounded-xl border p-3">
          <BrainCircuit size={15} className="mb-2 text-indigo-400" />
          <p className="theme-body capitalize">{health?.aiProvider ? `${health.aiProvider} model` : 'Model'}</p>
          <p className="theme-heading mt-1 truncate">{health?.chatModel || 'Unavailable'}</p>
        </div>
        <div className="theme-subtle rounded-xl border p-3">
          <Database size={15} className="mb-2 text-indigo-400" />
          <p className="theme-body">Storage</p>
          <p className="theme-heading mt-1 capitalize">{health?.storageMode || 'Unavailable'}</p>
        </div>
        <div className="theme-subtle rounded-xl border p-3">
          <Activity size={15} className="mb-2 text-indigo-400" />
          <p className="theme-body">Questions</p>
          <p className="theme-heading mt-1">{metrics?.requests ?? 0}</p>
        </div>
        <div className="theme-subtle rounded-xl border p-3">
          <Gauge size={15} className="mb-2 text-indigo-400" />
          <p className="theme-body">p95 latency</p>
          <p className="theme-heading mt-1">{metrics?.latencyMs?.p95 ? `${metrics.latencyMs.p95} ms` : '—'}</p>
        </div>
      </div>

      <div className="theme-subtle theme-body space-y-2 rounded-xl border p-3 text-[11px] leading-4">
        <p className="theme-heading flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Grounding safeguards active</p>
        <p>Hybrid semantic + keyword retrieval</p>
        <p>Validated page citations and user-isolated documents</p>
        <p>{health?.limits?.questionsPerMinute || 30} questions/min · {health?.limits?.fileSizeMb || 10} MB/file</p>
        <p className="text-amber-600/90 dark:text-amber-300/80">Text PDFs and TXT only · scanned PDFs require OCR</p>
      </div>
    </div>
  );
};

export default AISystemPanel;
