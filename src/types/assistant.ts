export interface CodebaseReference {
  path: string;
  lines?: string;
  snippet?: string;
  symbolName?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  references?: CodebaseReference[];
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  lastMessageSnippet: string;
  messages: AIMessage[];
  projectId: string;
}

export interface SuggestedPrompt {
  id: string;
  category: 'architecture' | 'impact' | 'refactor' | 'security' | 'onboarding';
  prompt: string;
  description: string;
}
