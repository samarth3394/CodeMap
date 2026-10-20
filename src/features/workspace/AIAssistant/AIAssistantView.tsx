import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import {
  MOCK_CONVERSATIONS,
  MOCK_SUGGESTED_PROMPTS,
} from '../../../data/mockData';
import { Conversation, AIMessage } from '../../../types/assistant';
import { ChatThread } from './ChatThread';
import { PromptSuggestions } from './PromptSuggestions';
import { Button } from '../../../components/common/Button';
import { Bot, Plus } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const incomingQuery = searchParams.get('query');
  const processedQueryRef = useRef<string | null>(null);

  const { selectedProject } = useProject();

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleCreateNewConversation = () => {
    const newId = `conv-${Date.now().toString(36)}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Architectural Inquiry',
      createdAt: 'Just now',
      lastMessageSnippet: 'Start a new inquiry...',
      projectId: selectedProject.name,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `Hello! I have indexed **${selectedProject.stats.symbolsCount} symbols** and **${selectedProject.stats.modulesCount} modules** in \`${selectedProject.name}\`. Ask me anything about module dependency boundaries, concurrency, or simulate code refactoring.`,
          suggestedFollowUps: [
            'Explain order processing pipeline',
            'Where are database transactions handled?',
            'What would break if we change OrderStatus enum?',
          ],
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  const handleSendMessage = (userText: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: userText,
    };

    // Update state with user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessageSnippet: userText,
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    setIsGenerating(true);

    // Simulate realistic AI generation with verified citations
    setTimeout(() => {
      const aiReply: AIMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Analysis of \`${userText}\`:

Based on the parsed AST hierarchy in [\`app/services/checkout_service.py\`](file:///app/services/checkout_service.py#L38) and [\`app/models/order.py\`](file:///app/models/order.py):

- **Architectural Boundary**: The operation touches the **Service Orchestration layer** and requires coordination between the Redis lock manager and PostgreSQL async session.
- **Transactional Invariant**: Idempotency keys must be validated prior to invoking external network gateways to prevent double-charging.
- **Safety**: Test coverage for this path is currently **88.5%** in [\`tests/test_checkout.py\`](file:///tests/test_checkout.py).`,
        references: [
          {
            path: 'app/services/checkout_service.py',
            lines: '38-74',
            symbolName: 'execute_checkout',
          },
          {
            path: 'app/models/order.py',
            lines: '15-40',
            symbolName: 'OrderEntity',
          },
        ],
        suggestedFollowUps: [
          'Show caller graph for execute_checkout',
          'Simulate deprecation impact across all routes',
        ],
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, aiReply],
            };
          }
          return c;
        })
      );
      setIsGenerating(false);
    }, 1200);
  };

  useEffect(() => {
    if (incomingQuery && incomingQuery !== processedQueryRef.current) {
      processedQueryRef.current = incomingQuery;
      handleSendMessage(incomingQuery);
    }
  }, [incomingQuery]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white">
      {/* Left Column: Conversation List & Suggestions */}
      <div className="w-80 border-r border-slate-200 bg-white h-full flex flex-col justify-between">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Conversations
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCreateNewConversation}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New
          </Button>
        </div>

        {/* Conversation list items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-2.5 rounded-lg text-left transition-all group ${
                  isActive
                    ? 'bg-purple-50/70 border border-purple-200 text-purple-900 shadow-sm'
                    : 'bg-white border border-transparent hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs truncate max-w-[190px]">
                    {conv.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{conv.createdAt}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{conv.lastMessageSnippet}</p>
              </button>
            );
          })}
        </div>

        {/* Suggested Prompts footer in sidebar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60 max-h-56 overflow-y-auto">
          <PromptSuggestions
            prompts={MOCK_SUGGESTED_PROMPTS.slice(0, 2)}
            onSelectPrompt={handleSendMessage}
          />
        </div>
      </div>

      {/* Right Column: Chat Thread */}
      <ChatThread
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        projectId={projectId || selectedProject.id}
      />
    </div>
  );
};
