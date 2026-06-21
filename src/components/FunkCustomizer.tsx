import React, { useState } from "react";
import { SlidersHorizontal, Flame, Music4, Clock, Mic, Check } from "lucide-react";
import { FunkOptions, FunkStyle, VocalStyle, FunkLength, SongAnalysis } from "../types";

interface FunkCustomizerProps {
  analysis: SongAnalysis;
  onGenerate: (options: FunkOptions) => void;
  isGenerating: boolean;
}

const STYLE_PRESETS: { value: FunkStyle; label: string; desc: string }[] = [
  { value: "70s-p-funk", label: "70S PARLIAMENT P-FUNK", desc: "Space cadet synthesizers, deep rubbery synth bass, heavy horn punches." },
  { value: "80s-synth-funk", label: "80S ROGER SYNTH FUNK", desc: "Vintage drum machines (LM-1), talkbox vocal style, electro-funk keyboards." },
  { value: "nu-funk-electro", label: "NU-FUNK ELECTRO (MODERN)", desc: "High fidelity electro vibes like Chromeo or Tuxedo, bouncy synth basslines." },
  { value: "slap-bass-disco", label: "SLAP-BASS DISCO-FUNK", desc: "Nile Rodgers style rhythm guitar, high tempo slap bass, orchestral strings." },
  { value: "funk-rock", label: "FUNK-ROCK GROOVE", desc: "Red Hot Chili Peppers grit, distorted slap bass, driving organic drums." }
];

const VOCAL_PRESETS: { value: VocalStyle; label: string; desc: string }[] = [
  { value: "talkbox", label: "ROGER TROUTMAN TALKBOX", desc: "Classic robotic vocal vibes carrying the soulful melody." },
  { value: "soulful", label: "SOULFUL DIVA / LEAD", desc: "Expressive, powerful backing vocals and energetic lead screams." },
  { value: "vocoder", label: "CLASSIC VOCODER MODE", desc: "Smooth synthesized electronic vocal chords and robotic harmonies." },
  { value: "instrumental", label: "PURE INSTRUMENTAL JAM", desc: "No vocals. Focused strictly on high-energy instrument solos." }
];

const TEMPO_PRESETS = [
  { value: "Slow Tempo (90 BPM) - Intimate thick groove", label: "Intimate Slow (90 BPM)" },
  { value: "Medium Tempo (110-115 BPM) - The classic golden era stride", label: "Classic Golden (115 BPM)" },
  { value: "Fast Tempo (125 BPM) - High-energy dancing groove", label: "Disco Electro (125 BPM)" }
];

const AVAILABLE_INSTRUMENTS = [
  "Slap Bass (Fingerstyle)",
  "Wah-wah Rhythm Guitar",
  "Clavinet (D6 keyboard)",
  "Synthesizer Horn Stabs",
  "Hammond B3 Rotary Organ",
  "Latin Percussion (Congas/Cowbell)",
  "Analog Synth Arpeggios"
];

export default function FunkCustomizer({ analysis, onGenerate, isGenerating }: FunkCustomizerProps) {
  const [style, setStyle] = useState<FunkStyle>("70s-p-funk");
  const [vocalStyle, setVocalStyle] = useState<VocalStyle>("talkbox");
  const [tempo, setTempo] = useState<string>("Medium Tempo (110-115 BPM) - The classic golden era stride");
  const [instruments, setInstruments] = useState<string[]>([
    "Slap Bass (Fingerstyle)",
    "Wah-wah Rhythm Guitar",
    "Synthesizer Horn Stabs",
    "Clavinet (D6 keyboard)"
  ]);
  const [length, setLength] = useState<FunkLength>("long");

  const handleInstrumentToggle = (inst: string) => {
    setInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      style,
      vocalStyle,
      tempo,
      instruments,
      length
    });
  };

  return (
    <div id="funk-customizer-container" className="bg-[#0a0a0a] border border-[#222] p-6 shadow-2xl relative space-y-6">
      {/* Accent corner detail */}
      <div className="absolute top-0 right-0 py-1 px-2.5 bg-brand text-black text-[9px] font-mono uppercase tracking-widest font-black select-none pointer-events-none">
        Param Matrix
      </div>

      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <div className="p-2.5 bg-brand/10 border border-brand text-brand rounded-none">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[9px] font-mono text-brand tracking-widest uppercase">System Customizer // Synthesizer Config</span>
          <h2 className="text-sm font-black text-white tracking-widest uppercase font-mono">Funk Customizer Parameters</h2>
        </div>
      </div>

      {/* Target song identification banner */}
      <div className="bg-[#050505] border border-[#222] p-4 flex items-start gap-3">
        <div className="p-2 bg-brand/10 text-brand border border-brand/20 mt-0.5">
          <Music4 className="w-4 h-4" />
        </div>
        <div className="font-mono">
          <p className="text-[9px] text-[#555] font-bold uppercase tracking-wider">Identified Track Source</p>
          <p className="text-xs font-semibold text-white mt-1 leading-none">"{analysis.title.toUpperCase()}"</p>
          <p className="text-[10px] text-brand mt-1 uppercase font-bold">{analysis.artist} // {analysis.genre} • {analysis.bpm} BPM</p>
          <p className="text-[10px] text-[#888] mt-2.5 italic">"{analysis.characteristics}"</p>
        </div>
      </div>

      {/* Style Presets */}
      <div>
        <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest block mb-3 font-mono flex items-center gap-1.5 border-l-2 border-brand pl-2">
          <Flame className="w-3.5 h-3.5 text-brand" /> Funk Sub-Style Archetype
        </label>
        <div id="style-presets-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = style === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => setStyle(preset.value)}
                className={`p-3.5 border text-left transition-all relative rounded-none flex flex-col font-mono cursor-pointer ${
                  isSelected
                    ? "bg-[#151515] border-brand text-brand"
                    : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                }`}
              >
                <p className="text-[11px] font-black tracking-wide leading-none">{preset.label}</p>
                <p className="text-[9px] opacity-70 mt-1.5 leading-relaxed font-sans">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocal Style Presets */}
      <div>
        <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest block mb-3 font-mono flex items-center gap-1.5 border-l-2 border-brand pl-2">
          <Mic className="w-3.5 h-3.5 text-brand" /> Vocal Signature
        </label>
        <div id="vocal-presets-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VOCAL_PRESETS.map((vocal) => {
            const isSelected = vocalStyle === vocal.value;
            return (
              <button
                key={vocal.value}
                onClick={() => setVocalStyle(vocal.value)}
                className={`p-3.5 border text-left transition-all relative rounded-none flex flex-col font-mono cursor-pointer ${
                  isSelected
                    ? "bg-[#151515] border-brand text-brand"
                    : "bg-[#050505] border-[#222] text-[#888] hover:border-[#444] hover:text-white"
                }`}
              >
                <p className="text-[11px] font-black tracking-wide leading-none">{vocal.label}</p>
                <p className="text-[9px] opacity-70 mt-1.5 leading-relaxed font-sans">{vocal.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tempo, length & custom instrumentation split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-widest block mb-3 border-l-2 border-brand pl-2">
              Tempo Matrix
            </label>
            <div className="space-y-1.5">
              {TEMPO_PRESETS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTempo(t.value)}
                  className={`w-full p-2.5 border text-left text-[10px] font-mono transition-all flex justify-between items-center rounded-none cursor-pointer ${
                    tempo === t.value
                      ? "bg-[#151515] border-brand text-brand font-bold"
                      : "bg-[#050505] border-[#222] text-[#888] hover:border-[#333]"
                  }`}
                >
                  <span>{t.label.toUpperCase()}</span>
                  {tempo === t.value && <span className="w-1.5 h-1.5 bg-brand rounded-none"></span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-widest block mb-2 flex items-center gap-1.5 border-l-2 border-brand pl-2">
              <Clock className="w-3.5 h-3.5 text-brand" /> Duration Output
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1 border border-[#222] rounded-none">
              <button
                onClick={() => setLength("short")}
                className={`py-1.5 text-center text-[10px] font-mono uppercase font-black transition-all rounded-none cursor-pointer ${
                  length === "short"
                    ? "bg-brand text-black"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                30S Clip
              </button>
              <button
                id="length-long"
                onClick={() => setLength("long")}
                className={`py-1.5 text-center text-[10px] font-mono uppercase font-black transition-all rounded-none cursor-pointer ${
                  length === "long"
                    ? "bg-brand text-black"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                2 MIN FUNK *
              </button>
            </div>
            <p className="text-[9px] text-[#555] mt-1 italic font-mono uppercase">Optimized via Lyria-3-Pro neural grid.</p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-widest block mb-3 border-l-2 border-brand pl-2">
            Instrumentation Stack
          </label>
          <div id="instruments-checklist" className="bg-[#050505] border border-[#222] p-4 space-y-2 rounded-none">
            {AVAILABLE_INSTRUMENTS.map((inst) => {
              const isChecked = instruments.includes(inst);
              return (
                <button
                  key={inst}
                  onClick={() => handleInstrumentToggle(inst)}
                  className="w-full flex items-center justify-between text-left font-mono text-[10px] cursor-pointer group"
                >
                  <span className={`transition-colors ${isChecked ? 'text-brand font-bold' : 'text-[#888] group-hover:text-[#ccc]'}`}>
                    {inst.toUpperCase()}
                  </span>
                  <div className={`w-4 h-4 border flex items-center justify-center transition-all rounded-none ${
                    isChecked
                      ? "bg-brand/10 border-brand text-brand"
                      : "border-[#222] text-transparent"
                  }`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        id="btn-synthesize-funk"
        onClick={handleSubmit}
        disabled={isGenerating}
        className="w-full bg-brand hover:bg-white text-black disabled:bg-[#111] disabled:text-[#444] font-black uppercase italic tracking-[0.2em] text-xs py-4.5 transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer mt-4"
      >
        <span>⚡</span>
        <span>{isGenerating ? "RUNNING GENERATIVE DUPLEX METRICS..." : "SYNTHESIZE ULTRA FUNK MASTER (2 MINUTES)"}</span>
      </button>
    </div>
  );
}

