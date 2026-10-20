import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { MOCK_FILE_TREE, MOCK_FILE_CONTENT } from '../../../data/mockData';
import { CodeSymbol } from '../../../types/explorer';
import { FileTree } from './FileTree';
import { SourceViewer } from './SourceViewer';
import { SymbolInspector } from './SymbolInspector';

export const CodeExplorerView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { projectId } = useParams<{ projectId: string }>();
  const queryFile = searchParams.get('file');

  const defaultFile =
    queryFile && MOCK_FILE_CONTENT[queryFile]
      ? queryFile
      : 'app/services/checkout_service.py';

  const [selectedFilePath, setSelectedFilePath] = useState(defaultFile);
  const [activeSymbol, setActiveSymbol] = useState<CodeSymbol | null>(
    MOCK_FILE_CONTENT[defaultFile]?.symbols[0] || null
  );

  useEffect(() => {
    if (queryFile) {
      // Find exact or partial match
      const matched = Object.keys(MOCK_FILE_CONTENT).find(
        (k) => k === queryFile || k.endsWith(queryFile) || queryFile.endsWith(k)
      );
      if (matched) {
        setSelectedFilePath(matched);
        const content = MOCK_FILE_CONTENT[matched];
        if (content && content.symbols.length > 0) {
          setActiveSymbol(content.symbols[0]);
        }
      }
    }
  }, [queryFile]);

  const fileDetails =
    MOCK_FILE_CONTENT[selectedFilePath] ||
    MOCK_FILE_CONTENT['app/services/checkout_service.py'];

  const handleSelectFile = (path: string) => {
    setSelectedFilePath(path);
    const content = MOCK_FILE_CONTENT[path];
    if (content && content.symbols.length > 0) {
      setActiveSymbol(content.symbols[0]);
    } else {
      setActiveSymbol(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white">
      {/* Left Column: File Tree */}
      <FileTree
        tree={MOCK_FILE_TREE}
        selectedFilePath={selectedFilePath}
        onSelectFile={handleSelectFile}
      />

      {/* Center Column: Source Code Viewer */}
      <SourceViewer fileDetails={fileDetails} activeSymbol={activeSymbol} />

      {/* Right Column: Symbol Inspector */}
      <SymbolInspector
        symbols={fileDetails.symbols}
        activeSymbolId={activeSymbol?.id || null}
        onSelectSymbol={setActiveSymbol}
        fileName={selectedFilePath.split('/').pop() || selectedFilePath}
        projectId={projectId || 'proj-fastapi-commerce'}
      />
    </div>
  );
};
