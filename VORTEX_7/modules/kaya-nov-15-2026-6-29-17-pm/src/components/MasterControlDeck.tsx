import React, { useState } from 'react';
import { Play, Download, Repeat, Repeat1, Loader2, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { PlateBezel, HardwareButton, LedStatusIndicator } from './HardwarePrimitives.js';
import type { LogEntry } from './VideoOutput.js';

interface MasterControlDeckProps {
  appState: 'IDLE' | 'GENERATING_VIDEO' | 'VIDEO_READY';
  renderProgress: number;
  currentTime: number;
  videoDuration: number;
  targetDuration: string;
  onSelectDuration: (val: string) => void;
  onSeek: (time: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  canSubmit: boolean;
  onLaunchRender: () => void;
  onSaveVideo: () => void;
  hasReadyVideo: boolean;
  downloading: boolean;
  logs: LogEntry[];
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00.0';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`;
}

export function MasterControlDeck({
  appState,
  renderProgress,
  currentTime,
  videoDuration,
  targetDuration,
  onSelectDuration,
  onSeek,
  isLooping,
  onToggleLoop,
  canSubmit,
  onLaunchRender,
  onSaveVideo,
  hasReadyVideo,
  downloading,
  logs,
}: MasterControlDeckProps) {
  const [monitorOpen, setMonitorOpen] = useState(false);

  const isGenerating = appState === 'GENERATING_VIDEO';
  const targetSeconds = parseInt(targetDuration, 10) || 10;
  const effectiveDuration = hasReadyVideo && videoDuration > 0 ? videoDuration : targetSeconds;
  const latestLog = logs[logs.length - 1];

  const statusTone = isGenerating ? 'red' : hasReadyVideo ? 'cyan' : 'emerald';
  const statusLabel = isGenerating ? 'Rendering' : hasReadyVideo ? 'Output Ready' : 'Standby';

  return (
    <PlateBezel accent={isGenerating ? 'red' : 'neutral'} className="p-5 sm:p-6 space-y-4">
      {/* Header Label Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <span
          className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6ECF5]/75"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Master Control
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <LedStatusIndicator label={statusLabel} tone={statusTone} pulse={isGenerating} />
          <LedStatusIndicator
            label={isLooping ? 'Loop On' : 'Single'}
            tone={isLooping ? 'magenta' : 'neutral'}
          />
        </div>
      </div>

      {/* Expandable Activity Monitor Log Drawer */}
      {monitorOpen && (
        <div className="cnc-recess rounded-[8px] p-3 max-h-40 overflow-y-auto space-y-1 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="text-[#E6ECF5]/45">
              No activity recorded yet. Configure modules and press Render Reel.
            </div>
          ) : (
            logs.slice(-12).map((entry) => (
              <div
                key={entry.id}
                className={
                  entry.type === 'error'
                    ? 'text-[#FF7088]'
                    : entry.type === 'warn'
                    ? 'text-amber-300'
                    : entry.type === 'success'
                    ? 'text-[#00E5FF]'
                    : 'text-[#E6ECF5]/75'
                }
              >
                <span className="text-[#E6ECF5]/35 mr-2">›</span>
                <span>{entry.message}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Capsule Groove Timeline Slider & Progress Control */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-3 items-center">
        {/* Machined Capsule Pill Groove Timeline */}
        <div className="capsule-track-housing rounded-full px-4 py-2.5 flex items-center gap-3 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#E6ECF5]/60 whitespace-nowrap shrink-0">
            {hasReadyVideo ? 'Timeline' : 'Duration'}
          </span>
          {hasReadyVideo ? (
            <input
              type="range"
              min={0}
              max={effectiveDuration}
              step={0.05}
              value={Math.min(currentTime, effectiveDuration)}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              aria-label="Video playback timeline"
              className="hw-capsule-slider flex-1 min-w-0"
            />
          ) : (
            <input
              type="range"
              min={5}
              max={15}
              step={5}
              disabled={isGenerating}
              value={targetSeconds}
              onChange={(e) => onSelectDuration(`${e.target.value}s`)}
              aria-label="Target reel duration"
              className="hw-capsule-slider flex-1 min-w-0"
            />
          )}
          <span className="font-mono text-xs font-semibold text-[#00E5FF] tabular-nums whitespace-nowrap shrink-0">
            {hasReadyVideo
              ? `${formatTime(currentTime)} / ${formatTime(effectiveDuration)}`
              : `${String(targetSeconds).padStart(2, '0')}s`}
          </span>
        </div>

        {/* Segmented Progress Bar Readout */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full capsule-track-housing">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#E6ECF5]/60 shrink-0">
            Progress
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-[#050609] border border-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FF1E42] via-[#E6399B] to-[#00E5FF] transition-all duration-200"
              style={{
                width: `${isGenerating ? Math.max(5, renderProgress) : hasReadyVideo ? 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#E6ECF5] tabular-nums w-9 text-right shrink-0">
            {isGenerating ? `${renderProgress}%` : hasReadyVideo ? '100%' : '0%'}
          </span>
        </div>
      </div>

      {/* Activity Monitor Bar + Launch Control Switches */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Activity Monitor Strip */}
        <button
          type="button"
          onClick={() => setMonitorOpen((o) => !o)}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[8px] cnc-recess hover:border-[#00E5FF]/40 text-left transition-colors cursor-pointer flex-1 min-w-0 focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
        >
          <span className="flex items-center gap-2 min-w-0 font-mono text-xs text-[#E6ECF5]/75">
            <Activity className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            <span className="truncate">
              {latestLog ? latestLog.message : 'Activity Monitor: Ready to render sequence'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#E6ECF5]/50 whitespace-nowrap shrink-0">
            <span>{logs.length} logs</span>
            {monitorOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Master Launch Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 shrink-0">
          <HardwareButton
            tone="magenta"
            active={isLooping}
            onClick={onToggleLoop}
            aria-label={isLooping ? 'Disable infinite loop' : 'Enable infinite loop'}
          >
            {isLooping ? <Repeat className="w-3.5 h-3.5 text-[#FF64B8]" /> : <Repeat1 className="w-3.5 h-3.5" />}
            <span>Loop: {isLooping ? 'ON' : 'OFF'}</span>
          </HardwareButton>

          {hasReadyVideo && (
            <HardwareButton
              tone="cyan"
              active={false}
              disabled={downloading}
              onClick={onSaveVideo}
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-[#00E5FF]" />}
              <span>Save Reel</span>
            </HardwareButton>
          )}

          <HardwareButton
            tone="red"
            size="lg"
            active={isGenerating || canSubmit}
            disabled={!canSubmit}
            onClick={onLaunchRender}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FF3B5C]" />
                <span>Rendering…</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-[#FF3B5C]" />
                <span>Render Reel</span>
              </>
            )}
          </HardwareButton>
        </div>
      </div>
    </PlateBezel>
  );
}
