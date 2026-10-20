export type FileNodeType = 'directory' | 'file';

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: FileNodeType;
  extension?: string;
  sizeBytes?: number;
  children?: FileTreeNode[];
  linesCount?: number;
  symbolsCount?: number;
}

export type SymbolKind = 'function' | 'class' | 'method' | 'variable' | 'interface' | 'import' | 'endpoint';

export interface CodeSymbol {
  id: string;
  name: string;
  kind: SymbolKind;
  line: number;
  endLine: number;
  signature: string;
  docstring?: string;
  visibility: 'public' | 'protected' | 'private';
  referencesCount: number;
  complexityScore: number;
  calls?: string[];
}

export interface FileContentDetails {
  path: string;
  language: string;
  content: string;
  symbols: CodeSymbol[];
  linesCount: number;
  sizeFormatted: string;
  lastModified: string;
}
