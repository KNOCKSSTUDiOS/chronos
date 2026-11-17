import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, HardDrive, RefreshCw, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';
import { listDriveImages, downloadDriveImageAsBase64, DriveFileItem } from '../lib/driveApi.js';
import { showGooglePicker, PickedFileResult } from '../lib/googlePicker.js';
import { getAccessToken } from '../lib/driveAuth.js';

interface DrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'product' | 'atmosphere';
  onSelectImage: (dataUrl: string, name: string) => void;
}

export function DrivePickerModal({
  isOpen,
  onClose,
  targetType,
  onSelectImage,
}: DrivePickerModalProps) {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [launchingPicker, setLaunchingPicker] = useState(false);

  const fetchFiles = async (queryStr?: string) => {
    setLoading(true);
    setError(null);
    try {
      const items = await listDriveImages(queryStr);
      setFiles(items);
    } catch (err: any) {
      console.error('Error fetching drive images:', err);
      setError(err.message || 'Failed to list Google Drive files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles(searchQuery);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const handleLaunchGooglePicker = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError('Please connect your Google Drive account first.');
      return;
    }
    setLaunchingPicker(true);
    setError(null);
    try {
      await showGooglePicker({
        accessToken: token,
        onPick: async (picked: PickedFileResult) => {
          setDownloadingId(picked.id);
          try {
            const dataUrl = await downloadDriveImageAsBase64(picked.id, picked.mimeType);
            onSelectImage(dataUrl, picked.name);
            onClose();
          } catch (err: any) {
            setError(`Failed to download ${picked.name}: ${err.message}`);
          } finally {
            setDownloadingId(null);
          }
        },
        onError: (err) => {
          console.warn('Picker error or popup blocked, using integrated Drive explorer:', err);
          fetchFiles();
        },
      });
    } catch (err: any) {
      setError(err.message || 'Could not launch Google Picker');
    } finally {
      setLaunchingPicker(false);
    }
  };

  const handleFileClick = async (file: DriveFileItem) => {
    setDownloadingId(file.id);
    setError(null);
    try {
      const dataUrl = await downloadDriveImageAsBase64(file.id, file.mimeType);
      onSelectImage(dataUrl, file.name);
      onClose();
    } catch (err: any) {
      setError(`Failed to import file: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-850 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/70 border border-emerald-800/60 rounded-lg text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-white capitalize">
                Select {targetType} from Google Drive
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                Browse images or launch Google Picker widget
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-zinc-850 flex flex-col sm:flex-row gap-2.5 bg-zinc-900/30">
          <button
            onClick={handleLaunchGooglePicker}
            disabled={launchingPicker || downloadingId !== null}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0 disabled:opacity-50"
          >
            {launchingPicker ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            Launch Google Picker
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Drive images..."
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 pl-9 pr-3 py-2 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-white placeholder-zinc-600"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 font-mono text-xs rounded-lg transition-colors shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => fetchFiles(searchQuery)}
              title="Refresh"
              className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[280px]">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-red-300 font-mono text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500 font-mono text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              <span>Loading Google Drive files...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <ImageIcon className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="font-mono text-sm text-zinc-300">No image files found</p>
              <p className="font-mono text-xs text-zinc-500 mt-1 max-w-sm">
                Try clicking "Launch Google Picker" above or uploading image files to your Google Drive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file) => {
                const isSelected = downloadingId === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    disabled={downloadingId !== null}
                    className={`group relative text-left bg-zinc-900 border rounded-lg overflow-hidden transition-all p-2 flex flex-col gap-2 ${
                      isSelected
                        ? 'border-white ring-2 ring-white/30'
                        : 'border-zinc-850 hover:border-zinc-700 hover:bg-zinc-850/60'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] bg-zinc-950 rounded overflow-hidden relative flex items-center justify-center">
                      {file.thumbnailLink ? (
                        <img
                          src={file.thumbnailLink.replace('=s220', '=s400')}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-zinc-700" />
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-1.5 font-mono text-xs text-white">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Importing…</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-zinc-200 font-medium truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                        {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive File'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-850 bg-zinc-950 flex justify-between items-center text-[11px] font-mono text-zinc-500">
          <span>Google Drive API v3 & Picker</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
