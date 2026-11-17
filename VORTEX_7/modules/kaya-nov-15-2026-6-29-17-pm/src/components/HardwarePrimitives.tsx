import React from 'react';

export type AccentTone = 'cyan' | 'red' | 'magenta' | 'neutral';

/**
 * Realistic CNC-chamfered black steel screw head with socket & thread collar.
 */
export function HexScrew({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[4px] bg-[#06070A] border border-white/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.98),0_1px_0_rgba(255,255,255,0.1)] pointer-events-none select-none shrink-0 ${className}`}
    >
      <svg viewBox="0 0 16 16" className="w-3 h-3">
        <defs>
          <radialGradient id="steelScrewCap" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#525B73" />
            <stop offset="48%" stopColor="#1D222E" />
            <stop offset="100%" stopColor="#08090D" />
          </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="6.8" fill="url(#steelScrewCap)" stroke="#050608" strokeWidth="1" />
        {/* Precision cross / hex recess */}
        <polygon
          points="8,4.2 11.3,6.1 11.3,9.9 8,11.8 4.7,9.9 4.7,6.1"
          fill="#06070A"
          stroke="#64748B"
          strokeWidth="0.65"
        />
        <path d="M5.6 8H10.4M8 5.6V10.4" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Abstract geometric unit emblem (zero company/brand marks).
 */
export function GeometricMark({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-[9px] p-[3px] machined-ring shrink-0 ${className}`}
    >
      <div className="w-full h-full rounded-[6px] bg-[#090B10] hw-glass-sheen flex items-center justify-center border border-[#00E5FF]/40 shadow-[inset_0_0_12px_rgba(0,229,255,0.22)]">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00E5FF]" fill="none">
          <polygon
            points="12,2.5 20.5,7.5 20.5,16.5 12,21.5 3.5,16.5 3.5,7.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="8.25"
            y="8.25"
            width="7.5"
            height="7.5"
            rx="1.6"
            stroke="#FF1E42"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="1.6" fill="#E6399B" />
        </svg>
      </div>
    </div>
  );
}

interface PlateBezelProps {
  children: React.ReactNode;
  className?: string;
  accent?: AccentTone;
  screws?: boolean;
}

/**
 * Segmented CNC-machined industrial aluminum plate with deep bevels and corner steel screws.
 */
export function PlateBezel({
  children,
  className = '',
  accent = 'neutral',
  screws = true,
}: PlateBezelProps) {
  const accentRim =
    accent === 'red'
      ? 'border-[#FF1E42]/50 shadow-[0_0_20px_rgba(255,30,66,0.16)]'
      : accent === 'cyan'
      ? 'border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.12)]'
      : accent === 'magenta'
      ? 'border-[#E6399B]/40 shadow-[0_0_20px_rgba(230,57,155,0.12)]'
      : '';

  return (
    <div className={`relative cnc-plate rounded-[11px] ${accentRim} ${className}`}>
      {screws && (
        <>
          <HexScrew className="absolute top-2.5 left-2.5 z-10" />
          <HexScrew className="absolute top-2.5 right-2.5 z-10" />
          <HexScrew className="absolute bottom-2.5 left-2.5 z-10" />
          <HexScrew className="absolute bottom-2.5 right-2.5 z-10" />
        </>
      )}
      {children}
    </div>
  );
}

interface HardwareButtonProps {
  key?: React.Key;
  active?: boolean;
  tone?: AccentTone;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  ledIndicator?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
  children: React.ReactNode;
}

/**
 * Hybrid rounded-square + machined aluminum ring industrial switch with
 * illuminated glass center, RGB LED status light, and mechanical press travel.
 */
export function HardwareButton({
  active = false,
  tone = 'cyan',
  size = 'md',
  fullWidth = false,
  ledIndicator = true,
  className = '',
  disabled = false,
  children,
  type = 'button',
  ...props
}: HardwareButtonProps) {
  const coreGlass =
    active && tone === 'red'
      ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(255,75,105,0.55)_0%,rgba(140,14,35,0.85)_55%,#1A080C_100%)] text-white border-[#FF4A68]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_0_18px_rgba(255,30,66,0.48)]'
      : active && tone === 'magenta'
      ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(255,110,190,0.5)_0%,rgba(130,24,88,0.85)_55%,#190A15_100%)] text-white border-[#F26BB6]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_0_18px_rgba(230,57,155,0.45)]'
      : active && tone === 'cyan'
      ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(80,238,255,0.45)_0%,rgba(12,92,115,0.88)_55%,#07151C_100%)] text-white border-[#4DEBFF]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_0_18px_rgba(0,229,255,0.42)]'
      : 'bg-gradient-to-b from-[#1E2433] via-[#141822] to-[#0D1018] text-[#E6ECF5]/90 border-white/15 hover:text-white hover:border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-2px_6px_rgba(0,0,0,0.75)]';

  const hoverGlow =
    tone === 'red'
      ? 'hover:shadow-[0_0_20px_rgba(255,30,66,0.42)]'
      : tone === 'magenta'
      ? 'hover:shadow-[0_0_20px_rgba(230,57,155,0.4)]'
      : tone === 'cyan'
      ? 'hover:shadow-[0_0_20px_rgba(0,229,255,0.38)]'
      : 'hover:shadow-[0_0_14px_rgba(230,236,245,0.18)]';

  const ledColor =
    active && tone === 'red'
      ? 'bg-[#FF3B5C] shadow-[0_0_10px_#FF1E42]'
      : active && tone === 'magenta'
      ? 'bg-[#FF64B8] shadow-[0_0_10px_#E6399B]'
      : active && tone === 'cyan'
      ? 'bg-[#4DEBFF] shadow-[0_0_10px_#00E5FF]'
      : active
      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
      : 'bg-[#2C3346]';

  const padding =
    size === 'sm'
      ? 'px-3 py-1.5 min-h-[36px] text-xs'
      : size === 'lg'
      ? 'px-6 py-3 min-h-[46px] text-xs'
      : 'px-4 py-2 min-h-[40px] text-xs';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`group relative inline-flex rounded-[10px] p-[3px] machined-ring transition-all duration-150 ease-out active:translate-y-[1px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${hoverGlow} ${
        fullWidth ? 'w-full' : 'shrink-0'
      } ${className}`}
      {...props}
    >
      <span
        className={`relative flex items-center justify-between gap-2.5 w-full rounded-[7px] border hw-glass-sheen font-mono font-medium tracking-wide whitespace-nowrap transition-all duration-150 ${padding} ${coreGlass}`}
      >
        <span className="inline-flex items-center gap-2 min-w-0 truncate">{children}</span>
        {ledIndicator && (
          <span
            aria-hidden="true"
            className={`w-2.5 h-2.5 rounded-[3px] border border-black/50 shrink-0 transition-all duration-200 ${ledColor}`}
          />
        )}
      </span>
    </button>
  );
}

/**
 * Glass-lensed hardware status indicator paired with explicit label text.
 */
export function LedStatusIndicator({
  label,
  tone = 'cyan',
  pulse = false,
}: {
  label: string;
  tone?: AccentTone | 'emerald';
  pulse?: boolean;
}) {
  const diodeStyle =
    tone === 'red'
      ? 'bg-[#FF1E42] border-[#FF8599] shadow-[0_0_10px_#FF1E42]'
      : tone === 'magenta'
      ? 'bg-[#E6399B] border-[#F69BCE] shadow-[0_0_10px_#E6399B]'
      : tone === 'emerald'
      ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_10px_#34d399]'
      : tone === 'cyan'
      ? 'bg-[#00E5FF] border-[#8CF3FF] shadow-[0_0_10px_#00E5FF]'
      : 'bg-[#363E52] border-white/20';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[7px] cnc-recess whitespace-nowrap shrink-0">
      <span
        aria-hidden="true"
        className={`w-2.5 h-2.5 rounded-[3px] border ${diodeStyle} ${pulse ? 'animate-led-pulse' : ''}`}
      />
      <span className="font-mono text-[11px] font-semibold tracking-wider text-[#E6ECF5] uppercase">
        {label}
      </span>
    </div>
  );
}
