import React, { useState } from 'react';
import { HardDrive, X, Loader2, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import { uploadVideoToDrive } from '../lib/driveApi.js';
import { saveVideoProject } from '../lib/firebase.js';

interface DriveSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  versionLabel: string;
  duration?: string;
  promptText: string;
}

export function DriveSaveModal({
  isOpen,
  onClose,
  videoUrl,
  versionLabel,
  duration = '10s',
  promptText,
}: DriveSaveModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState<{ id: string; name: string; webViewLink?: string } | null>(null);

  if (!isOpen) return null;

  const defaultFileName = `omni-${versionLabel.toLowerCase()}-${duration}.mp4`;

  const handleConfirmSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // 1. Fetch video blob from local stream URL
      const videoRes = await fetch(videoUrl, { credentials: 'include' });
      if (!videoRes.ok) throw new Error(`Failed to load video stream (${videoRes.status})`);
      const blob = await videoRes.blob();

      // 2. Upload to Google Drive using multipart upload
      const driveFile = await uploadVideoToDrive(
        blob,
        defaultFileName,
        `Omni Product Studio generated ${duration} reel (${versionLabel}): ${promptText.slice(0, 150)}...`
      );

      // 3. Save reference in Firebase Firestore
      await saveVideoProject({
        id: `proj-${Date.now()}`,
        label: versionLabel,
        duration,
        prompt: promptText,
        videoUrl,
        driveFileId: driveFile.id,
        driveWebViewLink: driveFile.webViewLink,
      });

      setSavedResult(driveFile);
    } catch (err: any) {
      console.error('Error saving to Google Drive:', err);
      setError(err.message || 'Failed to save video to Google Drive');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-950/70 border border-emerald-800/60 rounded-xl text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-white">
              Save to Google Drive
            </h3>
            <p className="font-mono text-xs text-zinc-400">
              Workspace export confirmation
            </p>
          </div>
        </div>

        {savedResult ? (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs font-mono">
                <p className="font-bold text-white mb-1">Saved successfully to Google Drive!</p>
                <p className="text-zinc-300">File: {savedResult.name}</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Project metadata synced to Firebase Firestore.</p>
              </div>
            </div>

            <div className="flex gap-2">
              {savedResult.webViewLink && (
                <a
                  href={savedResult.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Drive
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-mono text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Version:</span>
                <span className="text-white font-semibold">{versionLabel} ({duration})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>File Name:</span>
                <span className="text-zinc-200">{defaultFileName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Destination:</span>
                <span className="text-emerald-400 font-medium">My Google Drive root</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-zinc-900 border border-zinc-800/80 rounded-lg text-zinc-400 text-[11px] font-mono leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                This will upload the MP4 video directly into your connected Google Drive account and store the project record in your database.
              </span>
            </div>

            {error && (
              <p className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs font-mono text-red-300">
                {error}
              </p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading to Drive…
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5" />
                    Confirm & Save to Drive
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
