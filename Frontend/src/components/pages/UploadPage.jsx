import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FileText, GitCompareArrows, LoaderCircle, LogOut, Send, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import { SignedIn, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBubble from '../ui/ChatBubble';
import ChatDocLogo from '../ui/ChatDocLogo';
import AISystemPanel from '../ui/AISystemPanel';
import ThemeToggle from '../ui/ThemeToggle';
import useTheme from '../../hooks/useTheme';

const API_URL = import.meta.env.VITE_BACKEND_URL
  || (import.meta.env.PROD ? 'https://chat-doc-backend.vercel.app' : 'http://localhost:3000');

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
  const [systemRefresh, setSystemRefresh] = useState(0);
  const navigate = useNavigate();
  const clerk = useClerk();
  const { getToken } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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
      setDocuments((current) => {
        const knownIds = new Set(current.map((document) => document.id));
        return [...current, ...added.filter((document) => !knownIds.has(document.id))];
      });
      setSelectedIds((current) => [...new Set([...current, ...added.map((document) => document.id)])]);
      setFiles([]);
      const duplicateCount = added.filter((document) => document.duplicate).length;
      const indexedCount = added.length - duplicateCount;
      if (indexedCount) toast.success(`${indexedCount} document${indexedCount === 1 ? '' : 's'} indexed and ready.`);
      if (duplicateCount) toast.info(`${duplicateCount} duplicate${duplicateCount === 1 ? '' : 's'} reused without re-embedding.`);
      setSystemRefresh((value) => value + 1);
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
    } finally { setAnswering(false); setProgress(''); setSystemRefresh((value) => value + 1); }
  };

  return (
    <div className="workspace-page min-h-screen transition-colors duration-300">
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
      <header className="theme-nav sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <ChatDocLogo />
            <span className="hidden items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300 sm:flex">
              <Sparkles size={13} /> AI workspace
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
            <SignedIn><UserButton /></SignedIn>
            <button className="theme-body flex items-center gap-2 text-sm font-medium transition-colors hover:!text-red-500" onClick={() => clerk.signOut().then(() => navigate('/'))}>
              <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:py-8">
        <aside className="workspace-panel h-fit rounded-3xl border p-5 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Knowledge base</p>
          <h1 className="theme-heading mt-2 text-xl font-bold">Your documents</h1>
          <p className="theme-body mt-1 text-sm leading-6">Upload PDFs or text files, then select the sources ChatDoc should search.</p>
          <label className="theme-subtle mt-5 flex cursor-pointer flex-col items-center rounded-2xl border border-dashed p-5 text-center transition-all hover:!border-blue-400 hover:shadow-sm">
            <span className="mb-3 rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-500/20"><UploadCloud size={21} /></span>
            <span className="text-sm font-medium">Choose documents</span>
            <span className="theme-body mt-1 text-xs">PDF or TXT · up to 10 MB each</span>
            <input className="hidden" type="file" multiple accept=".pdf,.txt" onChange={(event) => setFiles([...event.target.files])} />
          </label>
          {files.length > 0 && <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">{files.length} file{files.length === 1 ? '' : 's'} ready to index</p>}
          <button onClick={handleUpload} disabled={uploading || !files.length} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
            {uploading ? <LoaderCircle className="animate-spin" size={18} /> : <UploadCloud size={18} />}
            {uploading ? 'Embedding documents…' : 'Upload and index'}
          </button>
          <div className="mt-7 flex items-center justify-between">
            <p className="theme-heading text-sm font-semibold">Document library</p>
            <span className="theme-subtle rounded-full border px-2.5 py-1 text-xs font-medium">{documents.length}</span>
          </div>
          <div className="mt-3 space-y-2">
            {!documents.length && <p className="theme-body rounded-xl border border-dashed p-4 text-center text-xs">Your indexed documents will appear here.</p>}
            {documents.map((document) => (
              <label key={document.id} className="theme-subtle flex cursor-pointer gap-3 rounded-xl border p-3 transition-all hover:!border-blue-300">
                <input type="checkbox" checked={selectedIds.includes(document.id)} onChange={() => toggleDocument(document.id)} className="mt-1 accent-blue-600" />
                <FileText className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" size={18} />
                <span className="min-w-0 flex-1"><span className="theme-heading block truncate text-sm font-medium">{document.name}</span><span className="theme-body text-xs">{document.pageCount} pages · {document.chunkCount} chunks</span></span>
                <button type="button" aria-label={`Delete ${document.name}`} onClick={(event) => { event.preventDefault(); removeDocument(document.id); }} className="theme-body hover:!text-red-500"><Trash2 size={16} /></button>
              </label>
            ))}
          </div>
          <AISystemPanel refreshKey={systemRefresh} />
        </aside>

        <section className="workspace-panel flex min-h-[76vh] min-w-0 flex-col overflow-hidden rounded-3xl border">
          <div className="theme-border border-b px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="theme-heading font-bold">Grounded conversation</h2><p className="theme-body mt-1 text-xs">Answers include verified page-level evidence.</p></div>
              <div className="theme-subtle flex rounded-xl border p-1 text-xs">
                <button onClick={() => setMode('ask')} className={`rounded-lg px-3 py-2 font-medium transition-all ${mode === 'ask' ? 'bg-blue-600 text-white shadow-sm' : 'theme-body'}`}>Ask</button>
                <button onClick={() => setMode('compare')} className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-all ${mode === 'compare' ? 'bg-blue-600 text-white shadow-sm' : 'theme-body'}`}><GitCompareArrows size={14} /> Compare</button>
              </div>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{selectedIds.length} source{selectedIds.length === 1 ? '' : 's'} selected</div>
          </div>
          <div className="flex-1 overflow-y-auto p-6"><ChatBubble messages={messages} /></div>
          {answering && <div className="theme-body flex items-center gap-2 px-6 pb-3 text-sm"><LoaderCircle className="animate-spin text-blue-500" size={16} /> {progress || (mode === 'compare' ? 'Comparing selected documents…' : 'Starting grounded search…')}</div>}
          <form onSubmit={handleAsk} className="theme-border sticky bottom-0 border-t p-4 backdrop-blur">
            <div className="theme-input flex items-end gap-3 rounded-2xl border p-2 shadow-sm transition-all focus-within:!border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <textarea rows="2" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleAsk(event); } }} placeholder={documents.length ? (mode === 'compare' ? 'What would you like to compare?' : 'Ask across your selected documents…') : 'Upload documents to start'} className="theme-heading min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!canAsk} aria-label="Send question" className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"><Send size={18} /></button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UploadPage;
