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
        <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-600 dark:text-blue-400"><FileSearch size={30} /></div>
        <h3 className="theme-heading mt-4 font-semibold">Ask questions, compare sources</h3>
        <p className="theme-body mt-2 max-w-md text-sm leading-6">ChatDoc retrieves the most relevant passages from every selected document and grounds each answer in page-level evidence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <article key={`${message.question}-${index}`} className="space-y-3">
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm text-white shadow-sm sm:max-w-[85%]">{message.question}</div>
          <div className="theme-card max-w-[96%] rounded-2xl rounded-bl-sm border p-4 sm:max-w-[92%]">
            <div className="flex gap-3">
              <p className="theme-heading flex-1 whitespace-pre-wrap text-sm leading-6">{message.answer}</p>
              <button aria-label="Copy answer" onClick={() => copyAnswer(message.answer, index)} className="theme-body h-fit hover:!text-blue-500">
                {copiedIndex === index ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
              </button>
            </div>
            {message.citations?.length > 0 && (
              <div className="theme-border mt-4 border-t pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified sources</p>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((citation) => (
                    <details key={citation.sourceId} className="theme-subtle group rounded-lg border px-3 py-2 text-xs">
                      <summary className="cursor-pointer list-none font-medium text-blue-700 dark:text-blue-300">{citation.fileName} · p. {citation.page}</summary>
                      <p className="theme-body mt-2 max-w-md leading-5">{citation.excerpt}</p>
                      {citation.vectorScore !== undefined && (
                        <p className="theme-body mt-2 font-mono text-[10px]">vector {citation.vectorScore} · keyword {citation.keywordScore} · fused {citation.relevance}</p>
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
