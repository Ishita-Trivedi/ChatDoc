import { useState } from 'react';
import { Check, Copy, FileSearch } from 'lucide-react';

const ChatBubble = ({ messages }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyAnswer = async (answer, index) => {
    await navigator.clipboard.writeText(answer);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  if (!messages.length) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400"><FileSearch size={30} /></div>
        <h3 className="mt-4 font-semibold">Ask questions, compare sources</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">ChatDoc retrieves the most relevant passages from every selected document and grounds each answer in page-level evidence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <article key={`${message.question}-${index}`} className="space-y-3">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-500 px-4 py-3 text-sm">{message.question}</div>
          <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-white/10 bg-slate-800 p-4">
            <div className="flex gap-3">
              <p className="flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-200">{message.answer}</p>
              <button aria-label="Copy answer" onClick={() => copyAnswer(message.answer, index)} className="h-fit text-slate-500 hover:text-white">
                {copiedIndex === index ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
              </button>
            </div>
            {message.citations?.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Verified sources</p>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((citation) => (
                    <details key={citation.sourceId} className="group rounded-lg bg-slate-950 px-3 py-2 text-xs">
                      <summary className="cursor-pointer list-none font-medium text-indigo-300">{citation.fileName} · p. {citation.page}</summary>
                      <p className="mt-2 max-w-md leading-5 text-slate-400">{citation.excerpt}</p>
                      {citation.vectorScore !== undefined && (
                        <p className="mt-2 font-mono text-[10px] text-slate-600">vector {citation.vectorScore} · keyword {citation.keywordScore} · fused {citation.relevance}</p>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default ChatBubble;
