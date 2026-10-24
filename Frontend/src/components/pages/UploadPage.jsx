import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FileText, GitCompareArrows, LoaderCircle, LogOut, Send, Trash2, UploadCloud } from 'lucide-react';
import { SignedIn, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBubble from '../ui/ChatBubble';
import ChatDocLogo from '../ui/ChatDocLogo';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [mode, setMode] = useState('ask');
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();
  const clerk = useClerk();
  const { getToken } = useAuth();
  const canAsk = question.trim() && selectedIds.length >= (mode === 'compare' ? 2 : 1) && !answering;

  const history = useMemo(() => messages.flatMap((message) => [
    { role: 'user', content: message.question },
    { role: 'assistant', content: message.answer },
  ]).slice(-16), [messages]);

  const authorizationHeaders = useCallback(async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  useEffect(() => {
    let active = true;
    const loadDocuments = async () => {
      try {
        const response = await axios.get(`${API_URL}/file`, { headers: await authorizationHeaders() });
        if (active) {
          setDocuments(response.data.documents);
          setSelectedIds(response.data.documents.map((document) => document.id));
        }
      } catch (error) {
        if (error.response?.status !== 401) toast.error('Could not load your document library.');
      }
    };
    loadDocuments();
    return () => { active = false; };
  }, [authorizationHeaders]);

  const handleUpload = async () => {
    if (!files.length) return toast.error('Choose at least one PDF or text file.');
    setUploading(true);
    const data = new FormData();
    files.forEach((file) => data.append('files', file));
    try {
      const response = await axios.post(`${API_URL}/file/upload`, data, { headers: await authorizationHeaders() });
      const added = response.data.documents;
      setDocuments((current) => [...current, ...added]);
      setSelectedIds((current) => [...current, ...added.map((document) => document.id)]);
      setFiles([]);
      toast.success(`${added.length} document${added.length === 1 ? '' : 's'} indexed.`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Document indexing failed.');
    } finally { setUploading(false); }
  };

  const toggleDocument = (id) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const removeDocument = async (id) => {
    try {
      await axios.delete(`${API_URL}/file/${id}`, { headers: await authorizationHeaders() });
      setDocuments((current) => current.filter((document) => document.id !== id));
      setSelectedIds((current) => current.filter((documentId) => documentId !== id));
      toast.success('Document and embeddings deleted.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not delete document.');
    }
  };

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!canAsk) return;
    const currentQuestion = question.trim();
    setQuestion('');
    setAnswering(true);
    try {
      if (mode === 'compare') {
        const response = await axios.post(`${API_URL}/question/compare`, {
          question: currentQuestion, documentIds: selectedIds, history,
        }, { headers: await authorizationHeaders() });
        setMessages((current) => [...current, { question: currentQuestion, ...response.data }]);
      } else {
        const response = await fetch(`${API_URL}/question/ask/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...await authorizationHeaders() },
          body: JSON.stringify({ question: currentQuestion, documentIds: selectedIds, history }),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Could not answer that question.');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalAnswer;
        while (true) {
          const { value, done } = await reader.read();
          buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';
          events.forEach((block) => {
            const event = block.match(/^event: (.+)$/m)?.[1];
            const rawData = block.match(/^data: (.+)$/m)?.[1];
            if (!event || !rawData) return;
            const data = JSON.parse(rawData);
            if (event === 'progress') setProgress(data.message);
            if (event === 'answer') finalAnswer = data;
            if (event === 'error') throw new Error(data.error);
          });
          if (done) break;
        }
        if (!finalAnswer) throw new Error('The answer stream ended unexpectedly.');
        setMessages((current) => [...current, { question: currentQuestion, ...finalAnswer }]);
      }
    } catch (error) {
      setQuestion(currentQuestion);
      toast.error(error.response?.data?.error || 'Could not answer that question.');
    } finally { setAnswering(false); setProgress(''); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ToastContainer theme="dark" />
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <ChatDocLogo />
          <div className="flex items-center gap-3">
            <SignedIn><UserButton /></SignedIn>
            <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white" onClick={() => clerk.signOut().then(() => navigate('/'))}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">Knowledge base</p>
          <h1 className="mt-2 text-xl font-semibold">Your documents</h1>
          <p className="mt-1 text-sm text-slate-400">Upload up to 10 PDFs or text files, then choose which ones to search.</p>
          <label className="mt-5 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-slate-600 p-5 text-center hover:border-indigo-400 hover:bg-indigo-500/5">
            <UploadCloud className="mb-2 text-indigo-400" />
            <span className="text-sm font-medium">Choose documents</span>
            <span className="mt-1 text-xs text-slate-500">PDF or TXT · 10 MB each</span>
            <input className="hidden" type="file" multiple accept=".pdf,.txt" onChange={(event) => setFiles([...event.target.files])} />
          </label>
          {files.length > 0 && <p className="mt-3 text-sm text-slate-300">{files.length} file{files.length === 1 ? '' : 's'} ready</p>}
          <button onClick={handleUpload} disabled={uploading || !files.length} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40">
            {uploading ? <LoaderCircle className="animate-spin" size={18} /> : <UploadCloud size={18} />}
            {uploading ? 'Embedding documents…' : 'Upload and index'}
          </button>
          <div className="mt-6 space-y-2">
            {documents.map((document) => (
              <label key={document.id} className="flex cursor-pointer gap-3 rounded-lg border border-white/10 p-3 hover:bg-white/5">
                <input type="checkbox" checked={selectedIds.includes(document.id)} onChange={() => toggleDocument(document.id)} className="mt-1 accent-indigo-500" />
                <FileText className="mt-0.5 shrink-0 text-indigo-400" size={18} />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{document.name}</span><span className="text-xs text-slate-500">{document.pageCount} pages · {document.chunkCount} chunks</span></span>
                <button type="button" aria-label={`Delete ${document.name}`} onClick={(event) => { event.preventDefault(); removeDocument(document.id); }} className="text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
              </label>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[72vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold">Grounded conversation</h2>
              <div className="flex rounded-lg bg-slate-950 p-1 text-xs">
                <button onClick={() => setMode('ask')} className={`rounded-md px-3 py-1.5 ${mode === 'ask' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>Ask</button>
                <button onClick={() => setMode('compare')} className={`flex items-center gap-1 rounded-md px-3 py-1.5 ${mode === 'compare' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}><GitCompareArrows size={14} /> Compare</button>
              </div>
            </div>
            <p className="text-sm text-slate-400">Answers use only the {selectedIds.length} selected document{selectedIds.length === 1 ? '' : 's'} and include verified page sources.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6"><ChatBubble messages={messages} /></div>
          {answering && <div className="flex items-center gap-2 px-6 pb-3 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={16} /> {progress || (mode === 'compare' ? 'Comparing selected documents…' : 'Starting grounded search…')}</div>}
          <form onSubmit={handleAsk} className="border-t border-white/10 p-4">
            <div className="flex items-end gap-3 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-indigo-500">
              <textarea rows="2" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleAsk(event); } }} placeholder={documents.length ? (mode === 'compare' ? 'What would you like to compare?' : 'Ask across your selected documents…') : 'Upload documents to start'} className="min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-600" />
              <button type="submit" disabled={!canAsk} aria-label="Send question" className="rounded-lg bg-indigo-500 p-3 hover:bg-indigo-400 disabled:opacity-30"><Send size={18} /></button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UploadPage;
