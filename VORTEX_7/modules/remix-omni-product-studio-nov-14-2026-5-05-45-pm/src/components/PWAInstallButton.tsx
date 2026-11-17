import { useState } from 'react';
import { DownloadCloud, Smartphone, CheckCircle2, X, Info, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import { HardwareButton, PlateBezel, GeometricMark } from './HardwarePrimitives.js';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await promptInstall();
      if (accepted) return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <HardwareButton
        size="sm"
        tone={isInstalled ? 'cyan' : 'neutral'}
        active={isInstalled}
        onClick={handleAction}
        title="Install as standalone desktop or mobile application"
      >
        {isInstalled ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-emerald-400">Installed</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            <span>Install App</span>
          </>
        )}
      </HardwareButton>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <PlateBezel accent="cyan" className="w-full max-w-md overflow-hidden p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <GeometricMark className="w-9 h-9" />
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    KAYA
                  </h3>
                  <p className="text-xs text-[#E6ECF5]/55 font-mono">Standalone Local Application</p>
                </div>
              </div>
              <HardwareButton
                size="sm"
                tone="red"
                ledIndicator={false}
                onClick={() => setModalOpen(false)}
                aria-label="Close install modal"
              >
                <X className="w-4 h-4" />
              </HardwareButton>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs text-[#E6ECF5]/85">
              {isInstalled ? (
                <div className="p-3 cnc-recess rounded-[8px] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-300">Installed in Standalone Mode</p>
                    <p className="text-[#E6ECF5]/60 mt-0.5">
                      Running as a standalone desktop or mobile application.
                    </p>
                  </div>
                </div>
              ) : isIOS ? (
                <div className="p-4 cnc-recess rounded-[8px] space-y-2.5">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#00E5FF]" /> Install on Mobile Safari
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-[#E6ECF5]/80 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span>1. Tap</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1F2C] rounded border border-white/15 font-mono text-[11px] text-white">
                        <Share className="w-3 h-3 text-[#00E5FF]" /> Share
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>2. Select</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1F2C] rounded border border-white/15 font-mono text-[11px] text-white">
                        <PlusSquare className="w-3 h-3 text-emerald-400" /> Add to Home Screen
                      </span>
                    </li>
                    <li>3. Tap <strong>Add</strong></li>
                  </ol>
                </div>
              ) : isInstallable ? (
                <div className="p-4 cnc-recess rounded-[8px] space-y-3">
                  <p className="text-[#E6ECF5]/80 leading-relaxed">
                    Install this workstation to your desktop dock or home screen for standalone window operation.
                  </p>
                  <HardwareButton
                    fullWidth
                    tone="cyan"
                    active
                    onClick={async () => {
                      const res = await promptInstall();
                      if (res) setModalOpen(false);
                    }}
                  >
                    <DownloadCloud className="w-4 h-4 text-[#00E5FF]" />
                    <span>Install Standalone Unit</span>
                  </HardwareButton>
                </div>
              ) : (
                <div className="p-4 cnc-recess rounded-[8px] space-y-2">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#00E5FF]" /> Browser Installation
                  </p>
                  <p className="text-[#E6ECF5]/80 leading-relaxed">
                    Use the install icon in your browser address bar or browser menu to launch as a dedicated desktop window.
                  </p>
                </div>
              )}

              {/* Generic Manifest Metadata */}
              <div className="p-3 cnc-recess rounded-[8px] space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-[#E6ECF5]/55">
                  <span>Mode:</span>
                  <span className="text-[#00E5FF] font-semibold">Standalone Local</span>
                </div>
                <div className="flex justify-between text-[#E6ECF5]/55">
                  <span>Web Manifest:</span>
                  <a href="/manifest.json" target="_blank" rel="noreferrer" className="text-[#E6399B] underline hover:text-white">
                    /manifest.json
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <HardwareButton
                size="sm"
                tone="neutral"
                ledIndicator={false}
                onClick={() => setModalOpen(false)}
              >
                Close
              </HardwareButton>
            </div>
          </PlateBezel>
        </div>
      )}
    </>
  );
}
