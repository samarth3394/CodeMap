import React from 'react';
import { SuggestedPrompt } from '../../../types/assistant';
import { Sparkles } from 'lucide-react';

interface PromptSuggestionsProps {
  prompts: SuggestedPrompt[];
  onSelectPrompt: (promptText: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  prompts,
  onSelectPrompt,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
        <span>Suggested Architectural Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPrompt(p.prompt)}
            className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 transition-all group"
          >
            <div className="text-xs font-medium text-slate-900 group-hover:text-purple-700 transition-colors">
              {p.prompt}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
