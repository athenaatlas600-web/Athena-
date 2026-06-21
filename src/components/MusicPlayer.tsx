import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Download, Volume2, Music4, Disc, RotateCcw, VolumeX, AlignLeft, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { GeneratedTrack } from "../types";

interface MusicPlayerProps {
  track: GeneratedTrack;
}

export default function MusicPlayer({ track }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);

  // Reset audio on track change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 120);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const restartTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div id="music-player-container" className="bg-[#0a0a0a] border border-[#222] p-6 shadow-2xl relative space-y-6 rounded-none">
      {/* High Density matrix header indicator */}
      <div className="absolute top-0 right-0 py-1 px-2.5 bg-brand text-black text-[9px] font-mono uppercase tracking-widest font-black select-none pointer-events-none">
        PLAYBACK MONITOR
      </div>

      {/* Embedded hidden HTML5 sound node */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <div className="p-2.5 bg-brand/10 border border-brand text-brand rounded-none">
          <Music4 className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-[9px] font-mono text-brand tracking-widest uppercase">AUDIO SYNTH // DECK v.09</span>
          <h2 className="text-sm font-black text-white tracking-widest uppercase font-mono">Funk Playback Deck</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left column: Vinyl deck visualizer */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {/* Retro vinyl disc grooves */}
            <motion.div
              id="vinyl-record-disc"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#050505] border-[6px] border-[#151515] shadow-2xl flex items-center justify-center relative cursor-pointer"
              onClick={togglePlay}
            >
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border border-zinc-900/40"></div>
              <div className="absolute inset-8 rounded-full border border-zinc-900/30"></div>
              <div className="absolute inset-12 rounded-full border border-zinc-900/20"></div>
              <div className="absolute inset-16 rounded-full border border-zinc-900/10"></div>

              {/* Inner Label */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand border border-black p-2 flex items-center justify-center text-center">
                <div className="w-3 h-3 rounded-full bg-black border border-zinc-900"></div>
              </div>
            </motion.div>

            {/* Tonearm needle sleeve */}
            <div className="absolute top-0 right-1 w-10 h-10 select-none pointer-events-none origin-top transition-transform duration-500">
              <Disc className="w-8 h-8 text-zinc-800" />
            </div>
          </div>

          <div className="text-center font-mono">
            <h3 className="font-bold text-white text-xs truncate max-w-xs px-2 uppercase tracking-wide">"{track.title.toUpperCase()}"</h3>
            <p className="text-[10px] text-brand font-bold mt-1 tracking-widest uppercase">{track.artist} // REMIX MASTER</p>
          </div>
        </div>

        {/* Right column: Audio control dashboard and Waveform */}
        <div className="md:col-span-7 space-y-5">
          {/* Virtual active waveform visualizer bars */}
          <div id="visualizer-waves" className="h-14 bg-black border border-[#222] p-3 flex items-end justify-around gap-[2px] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const activeHeights = [16, 32, 24, 40, 12, 28, 36, 18, 44, 20, 32, 8, 24, 40, 16, 28, 34, 18, 42, 22, 30, 12, 26, 16, 36, 14, 48, 22, 10, 30];
              const height = isPlaying ? activeHeights[i % activeHeights.length] : 4;
              return (
                <div
                  key={i}
                  className="w-full bg-brand transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    animation: isPlaying ? `bounce 1s ease-in-out infinite alternate ${i * 0.03}s` : "none"
                  }}
                />
              );
            })}
          </div>

          {/* Time tracker scrubber input */}
          <div className="space-y-1">
            <input
              id="audio-progress-scrubber"
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full accent-brand bg-[#222] h-1 cursor-pointer appearance-none"
            />
            <div className="flex justify-between text-[9px] text-[#555] font-mono uppercase tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)} / 2:00</span>
            </div>
          </div>

          {/* Control Buttons row & Vol */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 font-mono">
            <div className="flex items-center gap-2">
              <button
                id="btn-restart-track"
                onClick={restartTrack}
                title="Restart track"
                className="p-3 border border-[#222] text-[#888] hover:text-white rounded-none hover:bg-black transition-colors"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>

              <button
                id="btn-toggle-play"
                onClick={togglePlay}
                className="px-6 py-3.5 bg-brand text-black font-black uppercase italic tracking-[0.15em] text-xs hover:bg-white transition-all cursor-pointer rounded-none"
              >
                {isPlaying ? "PAUSE STREAM" : "PLAY DUPLEX MASTER"}
              </button>

              <button
                id="btn-toggle-lyrics"
                onClick={() => setShowLyrics(!showLyrics)}
                title="Toggle lyrics overlay"
                className={`p-3 border transition-colors rounded-none ${showLyrics ? "border-brand text-brand bg-brand/10" : "border-[#222] text-[#888] hover:text-white"}`}
              >
                <AlignLeft className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#888]">
              <button
                id="btn-toggle-mute"
                onClick={() => setIsMuted(!isMuted)}
                className="text-brand hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                id="volume-slider-input"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 accent-brand h-1 bg-[#222] cursor-pointer"
              />
              <span className="w-8 font-mono">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted text part: Lyrics / Prompt analysis sheet block */}
      {showLyrics && (
        <div id="lyrics-drawer" className="bg-[#050505] border border-[#222] p-5 space-y-4 rounded-none font-mono">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-brand" /> Synced Lyria Lyrics & Vocals
            </span>
            <a
              id="download-track-link"
              href={track.audioUrl}
              download={`${track.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_ultra_funk_remix.wav`}
              className="text-[10px] text-brand font-semibold hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" /> Download WAV
            </a>
          </div>

          <div className="max-h-56 overflow-y-auto text-[11px] text-[#aaa] leading-relaxed space-y-3 font-medium pr-2">
            {track.lyrics ? (
              <pre className="whitespace-pre-wrap font-mono text-[#ddd]">
                {track.lyrics}
              </pre>
            ) : (
              <div className="text-center py-6 text-[#555] italic uppercase text-[10px] tracking-wide">
                No synced vocals or lyrics returned for this track structure. This pure high-octane instrumental jam features solos on slap bass and wah guitar!
              </div>
            )}
          </div>

          {track.promptUsed && (
            <div className="border-t border-[#222] pt-3">
              <p className="text-[9px] text-[#555] uppercase tracking-widest font-bold">Generated Prompts used by developer engine:</p>
              <p className="text-[10px] text-[#888] mt-1.5 italic leading-relaxed">"{track.promptUsed}"</p>
            </div>
          )}
        </div>
      )}

      {/* Global CSS for audio visualizer bouncy bar effects */}
      <style>{`
        @keyframes bounce {
          0% { height: 8%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}

