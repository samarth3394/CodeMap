import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../../../types/assistant';
import { Badge } from '../../../components/common/Badge';
import {
  Bot,
  User,
  Send,
  FileCode,
  Loader2,
} from 'lucide-react';

interface ChatThreadProps {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  projectId: string;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  onSendMessage,
  isGenerating,
  projectId,
}) => {
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{conversation.title}</h2>
            <p className="text-[11px] text-slate-500">
              Querying verified AST symbols & dependencies in {conversation.projectId}
            </p>
          </div>
        </div>
        <Badge variant="purple" size="sm">
          Strict Citations Enabled
        </Badge>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-purple-600 text-white shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-700">
                  {msg.sender === 'user' ? 'You' : 'CodeMap AI'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-xl text-xs leading-relaxed text-left ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Citations / References */}
                {msg.references && msg.references.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Codebase Citations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.references.map((ref, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigate(`/projects/${projectId}/explorer`)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono text-blue-700 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                        >
                          <FileCode className="w-3 h-3 text-blue-600" />
                          <span>
                            {ref.path}
                            {ref.lines ? `:${ref.lines}` : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up suggestions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(prompt)}
                      className="text-[11px] text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-full transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Analyzing AST call graph and extracting references...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="relative">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about architectural boundaries, concurrency, or simulate changes (Shift+Enter for new line)..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-3 pr-14 text-xs text-slate-900 placeholder:text-slate-400 focus-ring hover:border-slate-400 focus:bg-white resize-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="absolute right-2.5 bottom-3 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>* Demo Mode: Simulated responses demonstrate verified citation linking.</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
