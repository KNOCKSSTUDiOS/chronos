import React, { useRef, useEffect } from 'react';
import { Loader2, AlertTriangle, Repeat, Repeat1, Download, Sliders } from 'lucide-react';
import { PlateBezel, HardwareButton, LedStatusIndicator } from './HardwarePrimitives.js';

type AppState = 'IDLE' | 'GENERATING_ATMOSPHERE' | 'GENERATING_PROMPT' | 'GENERATING_VIDEO' | 'VIDEO_READY';
type LogType = 'info' | 'success' | 'warn' | 'error';
export interface LogEntry { id: string; message: string; type: LogType; image?: string }

interface VideoOutputProps {
  appState: AppState;
  videoUrl: string | null;
  logs: LogEntry[];
  isLooping?: boolean;
  onToggleLoop?: () => void;
  onDownload?: () => void;
  onToggleEdit?: () => void;
  editOpen?: boolean;
  downloading?: boolean;
  versionLabel?: string;
  targetDuration?: string;
  formatSpecLabel?: string;
  renderProgress?: number;
  onVideoTimeUpdate?: (current: number, total: number) => void;
  seekToTime?: number | null;
  emptyHint?: string;
}

const logColor = (type: LogType) =>
  type === 'error' ? 'text-[#FF7088]' :
  type === 'warn' ? 'text-amber-300' :
  type === 'success' ? 'text-[#00E5FF]' :
  'text-[#E6ECF5]/75';

const readableError = (raw: string): string => {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      const message = parsed?.error?.message ?? parsed?.message;
      if (typeof message === 'string' && message.trim()) return message;
    } catch {
      // fall through
    }
  }
  return raw.replace(/^Error:\s*/, '').trim();
};

export function VideoOutput({
  appState,
  videoUrl,
  logs,
  isLooping = true,
  onToggleLoop,
  onDownload,
  onToggleEdit,
  editOpen = false,
  downloading = false,
  versionLabel,
  targetDuration = '10s',
  formatSpecLabel = '4096×1716 · Ultra Cinema HDR',
  renderProgress = 0,
  onVideoTimeUpdate,
  seekToTime,
  emptyHint = 'Configure Subject & Environment modules, then press Render Reel',
}: VideoOutputProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const generating = appState === 'GENERATING_ATMOSPHERE' || appState === 'GENERATING_PROMPT' || appState === 'GENERATING_VIDEO';
  const lastLog = logs[logs.length - 1];
  const recentLogs = logs.slice(-6);
  const hasError = lastLog?.type === 'error';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    if (seekToTime !== null && seekToTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekToTime;
    }
  }, [seekToTime]);

  const panelAccent =
    generating ? 'red' : appState === 'VIDEO_READY' ? 'cyan' : 'neutral';

  return (
    <PlateBezel accent={panelAccent} className="p-5 sm:p-6 flex flex-col gap-4">
      {/* Monitor Top Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-3 min-w-0">
          <h2
            className="text-sm sm:text-base font-bold tracking-wider uppercase text-[#E6ECF5] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Realtime Preview
          </h2>
          {versionLabel ? (
            <span className="font-mono text-xs text-[#00E5FF] tabular-nums whitespace-nowrap">
              {versionLabel} · {targetDuration} · {formatSpecLabel}
            </span>
          ) : (
            <span className="font-mono text-xs text-[#E6ECF5]/60 tabular-nums whitespace-nowrap">
              {formatSpecLabel} · {targetDuration}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {appState === 'VIDEO_READY' && videoUrl && onDownload && (
            <HardwareButton
              size="sm"
              tone="cyan"
              active={false}
              disabled={downloading}
              onClick={onDownload}
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Save Reel</span>
            </HardwareButton>
          )}
          {appState === 'VIDEO_READY' && videoUrl && onToggleEdit && (
            <HardwareButton
              size="sm"
              tone="magenta"
              active={editOpen}
              onClick={onToggleEdit}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{editOpen ? 'Close Cut' : 'Edit Cut'}</span>
            </HardwareButton>
          )}
          {onToggleLoop && (
            <HardwareButton
              size="sm"
              tone="magenta"
              active={isLooping}
              onClick={onToggleLoop}
              aria-label={isLooping ? 'Disable infinite loop' : 'Enable infinite loop'}
            >
              {isLooping ? <Repeat className="w-3.5 h-3.5 text-[#E6399B]" /> : <Repeat1 className="w-3.5 h-3.5" />}
              <span>Loop: {isLooping ? 'ON' : 'OFF'}</span>
            </HardwareButton>
          )}
        </div>
      </div>

      {/* Recessed Glass Monitor Frame */}
      <div className="cnc-recess rounded-[10px] p-2 flex flex-col">
        <div
          className={`relative w-full rounded-[7px] overflow-hidden border border-white/10 optical-glass flex items-center justify-center ${
            hasError && appState !== 'VIDEO_READY' ? 'min-h-[260px] py-6' : 'aspect-video max-h-[460px]'
          }`}
        >
          {/* Specular optical glass corner reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/30 z-10"
          />

          {appState === 'VIDEO_READY' && videoUrl ? (
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.muted = true;
                  el.loop = isLooping;
                }
              }}
              src={videoUrl}
              controls
              controlsList="nodownload"
              autoPlay
              loop={isLooping}
              playsInline
              muted
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                onVideoTimeUpdate?.(v.currentTime, Number.isFinite(v.duration) ? v.duration : 0);
              }}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                onVideoTimeUpdate?.(v.currentTime, Number.isFinite(v.duration) ? v.duration : 0);
              }}
              className="relative z-0 w-full h-full object-contain bg-black"
            />
          ) : generating ? (
            <div className="relative z-20 flex flex-col items-center justify-center gap-4 px-6 py-6 w-full max-w-md text-center">
              <div className="w-12 h-12 rounded-[9px] cnc-module flex items-center justify-center border border-[#FF1E42]/50 shadow-[0_0_20px_rgba(255,30,66,0.25)]">
                <Loader2 className="w-6 h-6 text-[#FF1E42] animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-white font-semibold">
                  Rendering Sequence · {renderProgress}%
                </div>
                <div className="w-56 h-1.5 mx-auto rounded bg-[#07080C] border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF1E42] via-[#E6399B] to-[#00E5FF] transition-all duration-150"
                    style={{ width: `${Math.max(4, renderProgress)}%` }}
                  />
                </div>
              </div>
              <div className="w-full space-y-1.5 font-mono text-[11px] text-left bg-[#07080C]/85 border border-white/10 rounded-[6px] p-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className={logColor(log.type)}>
                    <div className="truncate"><span className="text-white/25">›</span> {log.message}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-md space-y-3">
              <LedStatusIndicator label="Viewport Ready" tone="cyan" />
              <p className="text-sm text-[#E6ECF5]/65 leading-relaxed">
                {emptyHint}
              </p>
              {lastLog?.type === 'error' && (
                <div className="mt-2 w-full flex items-start gap-3 rounded-[6px] border border-[#FF1E42]/45 bg-[#FF1E42]/10 px-4 py-3 text-left">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#FF1E42]" />
                  <p className="font-mono text-xs leading-relaxed text-[#FF9BAE] break-words">
                    {readableError(lastLog.message)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PlateBezel>
  );
}