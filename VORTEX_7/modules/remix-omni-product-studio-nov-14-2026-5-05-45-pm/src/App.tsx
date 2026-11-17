import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid,
  Box,
  Layers,
  Sliders,
  FolderTree,
  FileCode,
  Loader2,
  Clock,
  MonitorPlay,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { PRODUCTS, ATMOSPHERES, MediaSelection } from './data.js';
import { ImageUploader } from './components/ImageUploader.js';
import { VideoOutput, LogEntry } from './components/VideoOutput.js';
import { ScrollRow } from './components/ScrollRow.js';
import { PWAInstallButton } from './components/PWAInstallButton.js';
import { BuildTreeModal } from './components/BuildTreeModal.js';
import { MasterControlDeck } from './components/MasterControlDeck.js';
import {
  HexScrew,
  GeometricMark,
  PlateBezel,
  HardwareButton,
  LedStatusIndicator,
} from './components/HardwarePrimitives.js';
import {
  renderCinematicReel,
  RESOLUTION_PRESETS,
  HDR_GRADE_PRESETS,
  ResolutionKey,
  HDRGradeKey,
} from './lib/studioRenderer.js';

type LogType = 'info' | 'success' | 'warn' | 'error';
type AppState = 'IDLE' | 'GENERATING_VIDEO' | 'VIDEO_READY';
type ActiveModule = 'all' | 'subject' | 'environment' | 'optics';

interface VideoVersion {
  label: string;
  interactionId: string;
  videoUrl: string;
  mimeType: string;
  specLabel: string;
  prompt: string;
  duration?: string;
}

const DURATION_PRESETS = [
  { value: '5s', time: '05s', desc: 'Short Cut' },
  { value: '10s', time: '10s', desc: 'Standard' },
  { value: '15s', time: '15s', desc: 'Extended' },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('all');
  const [product, setProduct] = useState<MediaSelection | null>({
    id: `preset-${PRODUCTS[0].id}`,
    source: 'suggestion',
    images: [PRODUCTS[0].image],
    description: PRODUCTS[0].description,
  });
  const [atmosphere, setAtmosphere] = useState<MediaSelection | null>({
    id: `preset-${ATMOSPHERES[0].id}`,
    source: 'suggestion',
    images: [ATMOSPHERES[0].image],
    description: ATMOSPHERES[0].description,
  });
  const [duration, setDuration] = useState<string>('10s');
  const [resolution, setResolution] = useState<ResolutionKey>('cinemax_4k');
  const [hdrGrade, setHdrGrade] = useState<HDRGradeKey>('ultra_cinemax');
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [seekToTime, setSeekToTime] = useState<number | null>(null);
  const [buildTreeOpen, setBuildTreeOpen] = useState(false);

  const [versions, setVersions] = useState<VideoVersion[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const versionCount = useRef(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [downloading, setDownloading] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogType = 'info', image?: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        message,
        type,
        image,
      },
    ]);
  };

  const describe = (sel: MediaSelection) =>
    sel.description || `${sel.images.length} uploaded image${sel.images.length > 1 ? 's' : ''}`;

  const activeResSpec =
    RESOLUTION_PRESETS.find((r) => r.key === resolution) ?? RESOLUTION_PRESETS[3];
  const activeHdrSpec =
    HDR_GRADE_PRESETS.find((g) => g.key === hdrGrade) ?? HDR_GRADE_PRESETS[2];
  const currentFormatLabel = `${activeResSpec.tag} · ${activeResSpec.label} · ${activeHdrSpec.label}`;

  const isGenerating = appState === 'GENERATING_VIDEO';
  const canSubmit = !!product && !!atmosphere && !isGenerating;

  const selected = versions.find((v) => v.label === selectedLabel) ?? null;
  const otherVersions = versions.filter((v) => v.label !== selectedLabel);

  const addVersion = (
    interactionId: string,
    videoUrl: string,
    mimeType: string,
    specLabel: string,
    promptText: string,
    videoDurationStr?: string
  ) => {
    const label = `Cut ${++versionCount.current}`;
    setVersions((prev) => [
      ...prev,
      {
        label,
        interactionId,
        videoUrl,
        mimeType,
        specLabel,
        prompt: promptText,
        duration: videoDurationStr || duration,
      },
    ]);
    setSelectedLabel(label);
  };

  const handleSubmit = async () => {
    if (!product || !atmosphere) {
      addLog('Select both a Subject and an Environment before rendering.', 'error');
      return;
    }

    versionCount.current = 0;
    setVersions([]);
    setSelectedLabel(null);
    setEditOpen(false);
    setVideoTime(0);
    setVideoDuration(0);
    setRenderProgress(0);
    setAppState('GENERATING_VIDEO');

    addLog(`Initializing ${activeResSpec.label} (${activeHdrSpec.label}) · ${duration}…`, 'info');
    addLog(`Subject: ${describe(product)}`, 'info');
    addLog(`Environment: ${describe(atmosphere)}`, 'info');

    try {
      const durSec = parseInt(duration, 10) || 10;
      const result = await renderCinematicReel({
        productUrl: product.images[0],
        atmosphereUrl: atmosphere.images[0],
        durationSec: durSec,
        resolution,
        hdrGrade,
        watermarkEnabled,
        onProgress: (percent, msg) => {
          setRenderProgress(percent);
          addLog(msg, percent >= 90 ? 'success' : 'warn');
        },
      });

      const promptText = `${activeResSpec.label} · ${duration} · ${describe(product)}`;
      addVersion(
        `local-${Date.now()}`,
        result.videoUrl,
        result.mimeType,
        currentFormatLabel,
        promptText,
        duration
      );
      setRenderProgress(100);
      setAppState('VIDEO_READY');
      addLog(`${activeResSpec.label} master complete (${result.width}×${result.height}).`, 'success');
    } catch (e: any) {
      setAppState('IDLE');
      setRenderProgress(0);
      addLog(`Render error: ${e.message}`, 'error');
    }
  };

  const handleEdit = async () => {
    if (!selected || !editText.trim() || isGenerating || !product || !atmosphere) return;
    const instructions = editText.trim();
    const fromLabel = selected.label;
    const editDuration = selected.duration || duration;

    setEditOpen(false);
    setEditText('');
    setRenderProgress(0);
    setAppState('GENERATING_VIDEO');
    addLog(`Applying adjustment to ${fromLabel} (${activeResSpec.label} · ${editDuration}): "${instructions}"`, 'warn');

    try {
      const durSec = parseInt(editDuration, 10) || 10;
      const result = await renderCinematicReel({
        productUrl: product.images[0],
        atmosphereUrl: atmosphere.images[0],
        durationSec: durSec,
        resolution,
        hdrGrade,
        watermarkEnabled,
        instructions,
        onProgress: (percent, msg) => {
          setRenderProgress(percent);
          addLog(msg, percent >= 90 ? 'success' : 'warn');
        },
      });

      addVersion(
        `edit-${Date.now()}`,
        result.videoUrl,
        result.mimeType,
        currentFormatLabel,
        instructions,
        editDuration
      );
      setRenderProgress(100);
      setAppState('VIDEO_READY');
      addLog('Adjusted master cut rendered successfully.', 'success');
    } catch (e: any) {
      setAppState('VIDEO_READY');
      addLog(`Adjustment failed: ${e.message}`, 'error');
    }
  };

  const selectVersion = (label: string) => {
    setSelectedLabel(label);
    setEditOpen(false);
    setVideoTime(0);
  };

  const downloadVideo = (version: VideoVersion) => {
    try {
      setDownloading(true);
      const ext = version.mimeType.includes('mp4') ? 'mp4' : 'webm';
      const a = document.createElement('a');
      a.href = version.videoUrl;
      a.download = `kaya-cinemax-4k-${version.label.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      addLog(`Saved ${version.label} (.${ext}) media file.`, 'success');
    } catch (e: any) {
      addLog(`Download failed: ${e.message}`, 'error');
    } finally {
      setDownloading(false);
    }
  };

  const showSubject = activeModule === 'all' || activeModule === 'subject';
  const showEnvironment = activeModule === 'all' || activeModule === 'environment';
  const showOptics = activeModule === 'all' || activeModule === 'optics';

  return (
    <div className="min-h-screen w-full bg-[#07080B] text-[#E6ECF5] p-2.5 sm:p-4 lg:p-6">
      {/* OUTER CNC-MACHINED WORKSTATION CHASSIS WITH NEON RED PERIMETER LED STRIP */}
      <div className="relative w-full max-w-[1360px] mx-auto cnc-chassis rounded-[16px] p-3.5 sm:p-5 flex flex-col gap-4">
        <HexScrew className="absolute top-2.5 left-2.5 z-20" />
        <HexScrew className="absolute top-2.5 right-2.5 z-20" />
        <HexScrew className="absolute bottom-2.5 left-2.5 z-20" />
        <HexScrew className="absolute bottom-2.5 right-2.5 z-20" />

        {/* TOP HARDWARE BAR */}
        <header className="cnc-plate rounded-[11px] px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <GeometricMark />
            <div className="flex items-baseline gap-2.5 min-w-0">
              <h1
                className="text-base sm:text-lg font-bold uppercase tracking-[0.18em] text-white whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                KAYA
              </h1>
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-[#E6ECF5]/50 whitespace-nowrap">
                4K HDR Console
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <PWAInstallButton />
            <HardwareButton
              size="sm"
              tone="cyan"
              active={buildTreeOpen}
              onClick={() => setBuildTreeOpen(true)}
              title="Inspect project build tree and export files"
            >
              <FolderTree className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Build Tree</span>
            </HardwareButton>
            <a
              href="/api/download-code"
              download="kaya-studio.zip"
              className="inline-flex rounded-[10px] p-[3px] machined-ring hover:shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
              title="Download complete source archive"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 min-h-[36px] rounded-[7px] bg-gradient-to-b from-[#1E2433] via-[#141822] to-[#0D1018] hover:text-white border border-white/15 hw-glass-sheen font-mono text-xs font-medium text-[#E6ECF5]">
                <FileCode className="w-3.5 h-3.5 text-[#E6399B] shrink-0" />
                <span>Download Code</span>
              </span>
            </a>
          </div>
        </header>

        {/* HORIZONTAL MODULE NAVIGATION STRIP */}
        <PlateBezel screws={false} className="px-4 py-3">
          <nav aria-label="Module selector" className="flex flex-wrap items-center gap-2.5">
            <HardwareButton
              size="sm"
              tone="cyan"
              active={activeModule === 'all'}
              onClick={() => setActiveModule('all')}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>All Modules</span>
            </HardwareButton>

            <HardwareButton
              size="sm"
              tone="cyan"
              active={activeModule === 'subject'}
              onClick={() => setActiveModule('subject')}
            >
              <Box className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Subject Input</span>
            </HardwareButton>

            <HardwareButton
              size="sm"
              tone="magenta"
              active={activeModule === 'environment'}
              onClick={() => setActiveModule('environment')}
            >
              <Layers className="w-3.5 h-3.5 text-[#FF64B8]" />
              <span>Environment</span>
            </HardwareButton>

            <HardwareButton
              size="sm"
              tone="red"
              active={activeModule === 'optics'}
              onClick={() => setActiveModule('optics')}
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF3B5C]" />
              <span>Optics &amp; 4K HDR</span>
            </HardwareButton>
          </nav>
        </PlateBezel>

        {/* REALTIME OPTICAL PREVIEW MONITOR */}
        <VideoOutput
          appState={appState}
          videoUrl={selected?.videoUrl ?? null}
          logs={logs}
          isLooping={isLooping}
          onToggleLoop={() => setIsLooping((l) => !l)}
          onDownload={selected ? () => downloadVideo(selected) : undefined}
          onToggleEdit={() => setEditOpen((o) => !o)}
          editOpen={editOpen}
          downloading={downloading}
          versionLabel={selected?.label}
          targetDuration={selected?.duration || duration}
          formatSpecLabel={selected?.specLabel || currentFormatLabel}
          renderProgress={renderProgress}
          onVideoTimeUpdate={(cur, dur) => {
            setVideoTime(cur);
            setVideoDuration(dur);
          }}
          seekToTime={seekToTime}
        />

        {/* UNIFIED WORKSPACE MODULES */}
        {showSubject && (
          <ImageUploader
            indexLabel="01."
            title="Subject Input"
            type="product"
            suggestions={PRODUCTS}
            selection={product}
            onSelect={setProduct}
            disabled={isGenerating}
          />
        )}

        {showEnvironment && (
          <ImageUploader
            indexLabel="02."
            title="Environment Module"
            type="atmosphere"
            suggestions={ATMOSPHERES}
            selection={atmosphere}
            onSelect={setAtmosphere}
            disabled={isGenerating}
          />
        )}

        {showOptics && (
          <PlateBezel
            accent={editOpen ? 'magenta' : 'cyan'}
            className="p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-[#FF1E42] tabular-nums">
                  03.
                </span>
                <h3
                  className="text-sm sm:text-base font-bold tracking-wide text-[#E6ECF5] uppercase"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Optics, HDR &amp; 4K Format
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <HardwareButton
                  size="sm"
                  tone="magenta"
                  active={watermarkEnabled}
                  disabled={isGenerating}
                  onClick={() => setWatermarkEnabled((w) => !w)}
                  title="Overlay your KNOCKSSTUDiOS watermark onto rendered cuts"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${watermarkEnabled ? 'text-[#FF64B8]' : 'text-[#E6ECF5]/50'}`} />
                  <span>Watermark: {watermarkEnabled ? 'ON' : 'OFF'}</span>
                </HardwareButton>
                <LedStatusIndicator
                  label={`${activeResSpec.label} · ${activeHdrSpec.label}`}
                  tone="cyan"
                />
              </div>
            </div>

            {/* Resolution & Format Matrix */}
            <div className="cnc-recess rounded-[8px] p-3.5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#E6ECF5]/60">
                <MonitorPlay className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Master Output Resolution</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {RESOLUTION_PRESETS.map((r) => {
                  const isActive = resolution === r.key;
                  return (
                    <HardwareButton
                      key={r.key}
                      fullWidth
                      tone={r.key === 'cinemax_4k' ? 'red' : 'cyan'}
                      active={isActive}
                      disabled={isGenerating}
                      onClick={() => setResolution(r.key)}
                    >
                      <span className="font-bold">{r.label}</span>
                      <span className="text-[11px] text-[#E6ECF5]/65 tabular-nums hidden sm:inline">
                        {r.tag}
                      </span>
                    </HardwareButton>
                  );
                })}
              </div>
            </div>

            {/* HDR & Duration Control Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* High HDR / Ultra Cinema Grade */}
              <div className="cnc-recess rounded-[8px] p-3.5 space-y-3">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#E6ECF5]/60">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6399B]" />
                  <span>HDR Dynamic Range Grade</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {HDR_GRADE_PRESETS.map((g) => {
                    const isActive = hdrGrade === g.key;
                    return (
                      <HardwareButton
                        key={g.key}
                        fullWidth
                        tone="magenta"
                        active={isActive}
                        disabled={isGenerating}
                        onClick={() => setHdrGrade(g.key)}
                      >
                        <span className="font-semibold truncate">{g.label}</span>
                      </HardwareButton>
                    );
                  })}
                </div>
              </div>

              {/* Duration Array */}
              <div className="cnc-recess rounded-[8px] p-3.5 space-y-3">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#E6ECF5]/60">
                  <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Sequence Duration</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_PRESETS.map((p) => {
                    const isActive = duration === p.value;
                    return (
                      <HardwareButton
                        key={p.value}
                        fullWidth
                        tone="cyan"
                        active={isActive}
                        disabled={isGenerating}
                        onClick={() => setDuration(p.value)}
                      >
                        <span className="font-bold tabular-nums">{p.time}</span>
                        <span className="text-[11px] text-[#E6ECF5]/65 hidden sm:inline">
                          {p.desc}
                        </span>
                      </HardwareButton>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lighting & Camera Cut Adjustment Console */}
            <AnimatePresence initial={false}>
              {(editOpen || activeModule === 'optics') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="cnc-recess rounded-[8px] p-4 space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <label className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                        Lighting &amp; Camera Adjustments
                      </label>
                      <span className="text-[11px] font-mono text-[#E6ECF5]/50">
                        e.g. warm golden light, dramatic contrast, faster orbit
                      </span>
                    </div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder={
                        selected
                          ? `Describe lighting or motion adjustments for ${selected.label}…`
                          : 'Render an initial reel first, or enter optical adjustment notes…'
                      }
                      className="w-full bg-[#06070A] border border-white/15 text-[#E6ECF5] p-3 font-mono text-xs leading-relaxed focus:outline-none focus:border-[#E6399B] rounded-[6px] resize-y min-h-[76px]"
                    />
                    <div className="flex items-center justify-end gap-2.5">
                      {editOpen && (
                        <HardwareButton
                          size="sm"
                          tone="neutral"
                          ledIndicator={false}
                          onClick={() => setEditOpen(false)}
                        >
                          Cancel
                        </HardwareButton>
                      )}
                      <HardwareButton
                        size="sm"
                        tone="magenta"
                        active={!!editText.trim() && !!selected}
                        disabled={!editText.trim() || !selected || isGenerating}
                        onClick={handleEdit}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Applying…</span>
                          </>
                        ) : (
                          <span>Apply Cut</span>
                        )}
                      </HardwareButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {otherVersions.length > 0 && (
              <div className="cnc-recess rounded-[8px] p-3.5 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E6ECF5]/60 block">
                  Recorded Cuts
                </span>
                <ScrollRow className="w-full" rowClassName="gap-3" deps={[otherVersions.length]}>
                  {otherVersions.map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => selectVersion(v.label)}
                      className="group flex-none text-left p-2 cnc-module hover:border-[#00E5FF]/60 rounded-[8px] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#E6ECF5] mb-1.5 tabular-nums">
                        <span className="font-bold">{v.label}</span>
                        <span className="text-[10px] text-[#00E5FF]">{v.duration || '10s'}</span>
                      </div>
                      <video
                        src={v.videoUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-32 aspect-video object-cover rounded-[4px] bg-black opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                </ScrollRow>
              </div>
            )}
          </PlateBezel>
        )}

        {/* BOTTOM: MASTER CONTROL DECK */}
        <MasterControlDeck
          appState={appState}
          renderProgress={renderProgress}
          currentTime={videoTime}
          videoDuration={videoDuration}
          targetDuration={duration}
          onSelectDuration={setDuration}
          onSeek={(t) => {
            setVideoTime(t);
            setSeekToTime(t);
          }}
          isLooping={isLooping}
          onToggleLoop={() => setIsLooping((l) => !l)}
          canSubmit={canSubmit}
          onLaunchRender={handleSubmit}
          onSaveVideo={() => selected && downloadVideo(selected)}
          hasReadyVideo={appState === 'VIDEO_READY' && !!selected}
          downloading={downloading}
          logs={logs}
        />
      </div>

      {/* PROJECT BUILD TREE MODAL */}
      <BuildTreeModal
        isOpen={buildTreeOpen}
        onClose={() => setBuildTreeOpen(false)}
      />
    </div>
  );
}