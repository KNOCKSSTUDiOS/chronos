import React, { useRef, useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { SuggestionChip, MediaSelection } from '../data.js';
import { fileToDownscaledDataUrl } from '../images.js';
import { PlateBezel, HardwareButton } from './HardwarePrimitives.js';

interface ImageUploaderProps {
  indexLabel: string;
  title: string;
  type: 'product' | 'atmosphere';
  suggestions: SuggestionChip[];
  selection: MediaSelection | null;
  onSelect: React.Dispatch<React.SetStateAction<MediaSelection | null>>;
  disabled?: boolean;
}

export function ImageUploader({
  indexLabel,
  title,
  type,
  suggestions,
  selection,
  onSelect,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChipClick = (suggestion: SuggestionChip) => {
    if (disabled) return;
    onSelect({
      id: `preset-${suggestion.id}`,
      source: 'suggestion',
      images: [suggestion.image],
      description: suggestion.description,
    });
    setError(null);
  };

  const handleFiles = async (fileList: FileList | null) => {
    const picked = Array.from(fileList ?? []).filter((f) =>
      f.type.startsWith('image/')
    );
    if (picked.length === 0) return;

    try {
      const dataUrl = await fileToDownscaledDataUrl(picked[0]);
      onSelect({
        id: `upload-${Date.now()}`,
        source: 'upload',
        images: [dataUrl],
        description: `Custom ${type} (${picked[0].name})`,
      });
      setError(null);
    } catch {
      setError('Failed to process image file.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSelect(null);
    setError(null);
  };

  const isCustomUpload = selection?.source === 'upload' && selection.images.length > 0;
  const accentTone = type === 'product' ? 'cyan' : 'magenta';
  const accentHex = type === 'product' ? '#00E5FF' : '#E6399B';

  return (
    <PlateBezel accent={selection ? accentTone : 'neutral'} className="p-5 sm:p-6 space-y-4">
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-mono text-xs font-bold tracking-widest tabular-nums"
            style={{ color: accentHex }}
          >
            {indexLabel}
          </span>
          <h3
            className="text-sm sm:text-base font-bold tracking-wide text-[#E6ECF5] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#E6ECF5]/60">
          <span className="truncate max-w-xs sm:max-w-sm">
            {selection ? selection.description : `Select ${type} preset or drop image`}
          </span>
          {selection && !disabled && (
            <HardwareButton
              size="sm"
              tone="neutral"
              ledIndicator={false}
              onClick={handleClear}
              title="Reset selection"
            >
              Reset
            </HardwareButton>
          )}
        </div>
      </div>

      {/* Recessed Industrial Asset Matrix */}
      <div className="cnc-recess rounded-[8px] p-3">
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${
            suggestions.length >= 5 ? 'xl:grid-cols-6' : 'xl:grid-cols-5'
          }`}
        >
          {suggestions.map((item) => {
            const isItemActive = selection?.id === `preset-${item.id}`;
            return (
              <button
                key={item.id}
                onClick={() => handleChipClick(item)}
                disabled={disabled}
                type="button"
                className={`group relative flex flex-col p-[2px] rounded-[8px] bg-gradient-to-b text-left transition-all duration-150 active:translate-y-[1px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00E5FF] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isItemActive
                    ? type === 'product'
                      ? 'from-[#00E5FF]/80 via-[#1B3A4B] to-[#0E1822] shadow-[0_0_16px_rgba(0,229,255,0.28)]'
                      : 'from-[#E6399B]/80 via-[#421C3A] to-[#160F19] shadow-[0_0_16px_rgba(230,57,155,0.28)]'
                    : 'from-[#343C4F] via-[#1C2230] to-[#10141C] hover:from-[#4C5772]'
                }`}
              >
                <div className="w-full h-full rounded-[6px] bg-[#141822] hw-glass-sheen p-2 flex flex-col">
                  <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden bg-[#08090D] border border-white/10 mb-2">
                    <img
                      src={item.image}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {isItemActive && (
                      <span
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-[5px] p-[1px] bg-gradient-to-b from-white/50 to-black/60 shadow-md flex items-center justify-center"
                        style={{ backgroundColor: accentHex }}
                        aria-label="Selected"
                      >
                        <Check className="w-3 h-3 stroke-[3] text-[#0B0B0F]" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-xs font-medium truncate ${isItemActive ? 'text-white' : 'text-[#E6ECF5]/85'}`}>
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-[2px] shrink-0 transition-colors"
                      style={{
                        backgroundColor: isItemActive ? accentHex : '#2A3142',
                        boxShadow: isItemActive ? `0 0 8px ${accentHex}` : 'none',
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Upload / Drop Module */}
          {isCustomUpload ? (
            <div
              onClick={() => !disabled && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
              }}
              className={`relative group flex flex-col p-[2px] rounded-[8px] bg-gradient-to-b text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${
                type === 'product'
                  ? 'from-[#00E5FF]/80 via-[#1B3A4B] to-[#0E1822] shadow-[0_0_16px_rgba(0,229,255,0.28)]'
                  : 'from-[#E6399B]/80 via-[#421C3A] to-[#160F19] shadow-[0_0_16px_rgba(230,57,155,0.28)]'
              }`}
            >
              <div className="w-full h-full rounded-[6px] bg-[#141822] hw-glass-sheen p-2 flex flex-col">
                <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden bg-[#08090D] border border-white/10 mb-2">
                  <img
                    src={selection.images[0]}
                    alt={selection.description}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Remove uploaded image"
                      title="Remove custom image"
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-[5px] bg-[#141822]/90 hover:bg-[#FF1E42] border border-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-xs font-medium text-white truncate">Custom Input</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !disabled && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!disabled) handleFiles(e.dataTransfer.files);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-[8px] text-center border border-dashed transition-all cursor-pointer min-h-[112px] focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${
                dragging
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_14px_rgba(0,229,255,0.2)]'
                  : 'border-white/20 hover:border-[#00E5FF]/60 bg-[#141822]/75 hover:bg-[#1A1F2C]'
              }`}
            >
              <div className="w-8 h-8 rounded-[6px] cnc-module flex items-center justify-center mb-2 text-[#E6ECF5]/80">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#E6ECF5]">Upload Image</span>
              <span className="text-[11px] font-mono text-[#E6ECF5]/50 mt-0.5">
                Drop or browse
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs font-mono text-[#FF7088] bg-[#FF1E42]/10 border border-[#FF1E42]/40 px-3 py-2 rounded-[6px]">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </PlateBezel>
  );
}
