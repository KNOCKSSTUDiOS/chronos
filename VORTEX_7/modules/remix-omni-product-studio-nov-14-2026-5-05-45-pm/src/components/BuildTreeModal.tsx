import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Loader2,
  FolderTree,
  Search,
} from 'lucide-react';
import { PlateBezel, HardwareButton } from './HardwarePrimitives.js';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: TreeNode[];
}

interface BuildTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['tsx', 'ts', 'js', 'jsx'].includes(ext || '')) {
    return <FileCode className="w-4 h-4 text-[#00E5FF] shrink-0" />;
  }
  if (['json', 'config'].includes(ext || '')) {
    return <FileText className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  if (['css', 'html'].includes(ext || '')) {
    return <FileCode className="w-4 h-4 text-[#E6399B] shrink-0" />;
  }
  if (['png', 'svg', 'jpg', 'jpeg', 'webp', 'ico'].includes(ext || '')) {
    return <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />;
  }
  return <FileText className="w-4 h-4 text-[#E6ECF5]/60 shrink-0" />;
}

export function BuildTreeModal({ isOpen, onClose }: BuildTreeModalProps) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['src', 'src/components', 'public']));
  const [selectedFile, setSelectedFile] = useState<string | null>('package.json');
  const [fileContent, setFileContent] = useState<string>('');
  const [binaryDataUrl, setBinaryDataUrl] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [treeError, setTreeError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTree();
    }
  }, [isOpen]);

  const loadTree = async () => {
    setLoading(true);
    setTreeError(null);
    try {
      const res = await fetch('/api/build-tree');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Build server endpoint is unavailable. Run "bun run dev" or "npm run dev" to inspect local files.');
      }
      const data = await res.json();
      setTreeData(data);
      if (!selectedFile) {
        loadFile('package.json');
      } else {
        loadFile(selectedFile);
      }
    } catch (e: any) {
      console.error('Failed to load tree:', e);
      setTreeError(e?.message || 'Unable to fetch project build tree from local server.');
    } finally {
      setLoading(false);
    }
  };

  const loadFile = async (filePath: string) => {
    setSelectedFile(filePath);
    setLoadingFile(true);
    setBinaryDataUrl(null);
    try {
      const res = await fetch(`/api/file-content?path=${encodeURIComponent(filePath)}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.isBinary) {
        setBinaryDataUrl(data.dataUrl);
        setFileContent('');
      } else {
        setFileContent(data.content || '');
      }
    } catch {
      setFileContent('// Failed to load file content. Ensure local server (bun run dev) is running.');
    } finally {
      setLoadingFile(false);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const handleCopy = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const renderNode = (node: TreeNode, depth = 0) => {
    const isDir = node.type === 'dir';
    const isExpanded = expandedPaths.has(node.path);
    const isSelected = selectedFile === node.path;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        node.name.toLowerCase().includes(query) ||
        (isDir && node.children?.some((c) => c.name.toLowerCase().includes(query)));
      if (!matchesSearch) return null;
    }

    return (
      <div key={node.path || node.name}>
        <div
          onClick={() => {
            if (isDir) {
              toggleFolder(node.path);
            } else {
              loadFile(node.path);
            }
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-[5px] text-xs font-mono cursor-pointer select-none transition-colors ${
            isSelected
              ? 'bg-[#00E5FF]/15 text-white font-semibold border border-[#00E5FF]/35'
              : 'text-[#E6ECF5]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          {isDir ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#E6ECF5]/45 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#E6ECF5]/45 shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-400/90 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500/80 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </>
          ) : (
            <>
              <div className="w-3.5 shrink-0" />
              {getFileIcon(node.name)}
              <span className="truncate flex-1">{node.name}</span>
              {node.size !== undefined && (
                <span className="text-[10px] text-[#E6ECF5]/40 font-sans ml-1 shrink-0 tabular-nums">
                  {formatBytes(node.size)}
                </span>
              )}
            </>
          )}
        </div>

        {isDir && isExpanded && node.children && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm">
      <PlateBezel accent="cyan" className="relative w-full max-w-6xl h-[88vh] max-h-[850px] flex flex-col overflow-hidden p-1">
        <div className="flex-1 flex flex-col min-h-0 rounded-[8px] overflow-hidden bg-[#0B0B0F]">
          {/* HEADER BAR */}
          <div className="px-6 py-4 border-b border-white/10 cnc-module flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-[6px] cnc-recess text-[#00E5FF] shrink-0">
                <FolderTree className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2
                  className="text-sm font-bold uppercase tracking-wider text-white flex items-baseline gap-2 flex-wrap"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span>KAYA · Project Build Tree</span>
                  <span className="text-xs font-mono text-[#E6ECF5]/50 font-normal normal-case">
                    · Local Source
                  </span>
                </h2>
                <p className="text-[11px] font-mono text-[#E6ECF5]/55 truncate">
                  Inspect source modules and export complete archive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="/api/download-code"
                download="kaya-studio.zip"
                className="inline-flex rounded-[9px] p-[2px] bg-gradient-to-b from-[#00E5FF]/70 via-[#1A3544] to-[#0D161E] hover:shadow-[0_0_16px_rgba(0,229,255,0.3)] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
                title="Save entire project as a ZIP archive"
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[7px] bg-[#0C1D26] border border-[#00E5FF]/50 hw-glass-sheen font-mono text-xs font-semibold text-white">
                  <Download className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  <span>Save Full Archive (.zip)</span>
                </span>
              </a>
              <HardwareButton
                size="sm"
                tone="red"
                ledIndicator={false}
                onClick={onClose}
                aria-label="Close build tree"
              >
                <X className="w-4 h-4" />
              </HardwareButton>
            </div>
          </div>

          {/* WORKSPACE CONTENT */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* LEFT: DIRECTORY TREE */}
            <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#141822]/60 shrink-0">
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#E6ECF5]/45 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter project files..."
                    className="w-full cnc-recess rounded-[6px] pl-8 pr-3 py-1.5 text-xs font-mono text-[#E6ECF5] placeholder-[#E6ECF5]/35 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-8 gap-2 text-[#E6ECF5]/55 font-mono text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-[#00E5FF]" />
                    <span>Loading build structure...</span>
                  </div>
                ) : treeError ? (
                  <div className="p-4 m-2 rounded-[8px] border border-[#FF1E42]/40 bg-[#1B0D12] text-center space-y-3 font-mono text-xs">
                    <p className="text-[#FF8DA1] leading-relaxed">{treeError}</p>
                    <HardwareButton
                      size="sm"
                      tone="red"
                      ledIndicator={false}
                      onClick={loadTree}
                    >
                      Retry Fetch
                    </HardwareButton>
                  </div>
                ) : treeData?.children ? (
                  treeData.children.map((node) => renderNode(node))
                ) : (
                  <div className="p-4 text-center text-[#E6ECF5]/50 text-xs font-mono">
                    No files found
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: FILE PREVIEW & ACTIONS */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0B0B0F]">
              {selectedFile ? (
                <>
                  <div className="px-4 py-2.5 border-b border-white/10 bg-[#141822]/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-[#E6ECF5]/75">
                      <span className="text-[#E6ECF5]/45 font-normal">file:</span>
                      <span className="font-semibold text-white truncate">{selectedFile}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/api/download-file?path=${encodeURIComponent(selectedFile)}`}
                        download={selectedFile.split('/').pop()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1F2C] hover:bg-[#232A3B] text-[#E6ECF5] hover:text-white border border-white/15 rounded-[6px] text-xs font-mono transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
                        title="Download this specific file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download File</span>
                      </a>
                      {fileContent && (
                        <HardwareButton
                          size="sm"
                          tone="cyan"
                          active={copied}
                          ledIndicator={false}
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </HardwareButton>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-[#E6ECF5]/85">
                    {loadingFile ? (
                      <div className="flex items-center justify-center h-full gap-2 text-[#E6ECF5]/55">
                        <Loader2 className="w-5 h-5 animate-spin text-[#00E5FF]" />
                        <span>Loading file content...</span>
                      </div>
                    ) : binaryDataUrl ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                        <div className="max-w-md max-h-[400px] cnc-plate rounded-[10px] overflow-hidden p-4">
                          <img
                            src={binaryDataUrl}
                            alt={selectedFile}
                            referrerPolicy="no-referrer"
                            className="max-h-[320px] max-w-full object-contain mx-auto"
                          />
                        </div>
                        <span className="text-[#E6ECF5]/50 text-xs font-mono">
                          Asset Preview ({selectedFile})
                        </span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre font-mono text-xs text-[#E6ECF5]/85">
                        {fileContent.split('\n').map((line, idx) => (
                          <div key={idx} className="flex hover:bg-white/5">
                            <span className="w-10 shrink-0 text-[#E6ECF5]/30 select-none text-right pr-4 tabular-nums">
                              {idx + 1}
                            </span>
                            <span className="flex-1 break-all">{line}</span>
                          </div>
                        ))}
                      </pre>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#E6ECF5]/50 font-mono text-xs gap-2">
                  <FileCode className="w-8 h-8 text-[#E6ECF5]/35" />
                  <span>Select a file from the tree to preview or save</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </PlateBezel>
    </div>
  );
}
