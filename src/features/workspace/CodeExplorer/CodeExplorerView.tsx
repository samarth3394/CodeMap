import React, { useState } from 'react';
import { MOCK_FILE_TREE, MOCK_FILE_CONTENT } from '../../../data/mockData';
import { CodeSymbol } from '../../../types/explorer';
import { FileTree } from './FileTree';
import { SourceViewer } from './SourceViewer';
import { SymbolInspector } from './SymbolInspector';

export const CodeExplorerView: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('app/services/checkout_service.py');
  const [activeSymbol, setActiveSymbol] = useState<CodeSymbol | null>(
    MOCK_FILE_CONTENT['app/services/checkout_service.py'].symbols[0]
  );

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
      />
    </div>
  );
};
