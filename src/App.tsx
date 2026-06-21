import React, { useState } from "react";
import { Disc, Music, Sparkles, Loader2, ArrowRight, RotateCcw, AlertTriangle, Radio } from "lucide-react";
import SongAnalyzer from "./components/SongAnalyzer";
import FunkCustomizer from "./components/FunkCustomizer";
import MusicPlayer from "./components/MusicPlayer";
import { SongAnalysis, FunkOptions, GeneratedTrack } from "./types";

export default function App() {
  const [analysis, setAnalysis] = useState<SongAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);

  // Pre-fill with the user's specific funk YouTube link on start
  const defaultUrl = "https://music.youtube.com/watch?v=w7b6ckqgp5Y&si=I0eOLLzCkfaATTlu";

  const handleAnalysisComplete = (data: SongAnalysis) => {
    setAnalysis(data);
    setGeneratedTrack(null);
    setErrorCode(null);
  };

  const handleGenerateFunk = async (options: FunkOptions) => {
    if (!analysis) return;

    setIsGenerating(true);
    setErrorCode(null);
    setGenerationStep("Laying down the funk rhythm sections...");

    // Fun progressive loading steps
    const steps = [
      "🎸 Tuning the slap bass frequencies & synth sublayers...",
      "🥁 Programming syncopated 110 BPM funk drums...",
      "🎹 Comping clavinet chords on the rotary Hammond b3 track...",
      "🎺 Fitting precise stereo brass horn stabs on the beat...",
      "🎤 Feeding robotic Talkbox vocals into the melody matrix...",
      "✨ Synthesizing final WAV master via Google Lyria neural grid..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
        currentStep++;
      }
    }, 4500);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: analysis.title,
          artist: analysis.artist,
          transformationPrompt: analysis.transformationPrompt,
          tempo: options.tempo,
          style: options.style,
          instruments: options.instruments,
          length: options.length,
          vocalStyle: options.vocalStyle
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate funk track.");
      }

      const data = await response.json();

      // Convert Base64 response to playable Blob URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      setGeneratedTrack({
        audioUrl,
        mimeType: data.mimeType,
        lyrics: data.lyrics,
        promptUsed: data.promptUsed,
        title: analysis.title,
        artist: analysis.artist
      });

    } catch (err: any) {
      clearInterval(interval);
      setErrorCode(err.message || "An error occurred with Lyria synthesis.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setGeneratedTrack(null);
    setErrorCode(null);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-row font-sans selection:bg-brand selection:text-black border-[12px] border-[#111]">
      
      {/* High Density Left Sidebar */}
      <aside className="hidden md:flex w-[80px] border-r border-[#222] flex-col items-center py-6 gap-8 bg-[#080808] self-stretch font-mono">
        {/* Brand visual badge */}
        <div className="w-10 h-10 bg-brand rounded-none flex items-center justify-center font-black text-black text-xs leading-none">
          UF
        </div>
        {/* Vertical text label */}
        <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.3em] font-mono opacity-30 uppercase font-black">
          SYSTEM STATUS: OPTIMAL
        </div>
        {/* Bottom lights indicator */}
        <div className="mt-auto flex flex-col gap-6 opacity-50">
          <div className="w-1.5 h-1.5 bg-brand rounded-none animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-none"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-none"></div>
        </div>
      </aside>

      {/* Main console field */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header element */}
        <header id="app-navbar" className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-50">
          <div className="w-full px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand/10 border border-brand rounded-none relative flex items-center justify-center animate-spin-slow">
                <Disc className="w-5 h-5 text-brand" />
                <div className="absolute w-1.5 h-1.5 bg-[#050505] rounded-full"></div>
              </div>
              <div className="font-mono">
                <span className="text-[9px] font-bold text-brand tracking-widest uppercase">Now Processing // Master Channel</span>
                <h1 className="text-base font-black italic tracking-wider uppercase text-white leading-none">Ultra Funk Controller v.04</h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-8 font-mono text-[11px] border-l border-[#222] pl-8">
              <div className="flex flex-col">
                <span className="opacity-40 uppercase text-[9px] tracking-wider">BPM Target</span>
                <span className="text-brand font-black">115.00</span>
              </div>
              <div className="flex flex-col">
                <span className="opacity-40 uppercase text-[9px] tracking-wider">Remix Style</span>
                <span className="text-white font-black">LYRIA 3 PRO</span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="opacity-40 uppercase text-[9px] tracking-wider">Engine CPU</span>
                <span className="text-white font-black">24%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main stage canvas layout container */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 space-y-6">
          
          {/* Intro Hero Banner */}
          <div id="hero-intro-banner" className="border border-[#222] bg-[#0a0a0a] p-6 space-y-3 relative overflow-hidden font-mono">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-brand uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Studio Full-Length Music Synth</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-widest uppercase leading-none">
              BRING THE <span className="text-brand italic bg-brand/10 px-1 py-0.5">ULTRA FUNK</span> TO ANY MUSIC
            </h2>
            <p className="text-[#888] text-[11px] leading-relaxed uppercase">
              Input any song, extract its structural DNA with Gemini's search-grounded diagnostics, and synthesize custom funk rhythms, slap bass partitions, wah gut riffs, and talkbox tracks directly via Lyria!
            </p>
          </div>

          {/* Dynamic Multi-Step App Frame */}
          <div id="dynamic-workflow-canvas" className="space-y-6">
            {!analysis ? (
              /* Step 1: Input URL */
              <SongAnalyzer onAnalysisComplete={handleAnalysisComplete} initialUrl={defaultUrl} />
            ) : (
              /* Step 2 & 3: Customization & Playback */
              <div className="space-y-6">
                {/* Reset to search option banner */}
                <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#222] p-4 font-mono text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#555] uppercase font-bold text-[10px]">Active Blueprint:</span>
                    <span className="text-brand font-black px-2 py-0.5 bg-black border border-[#222]">"{analysis.title.toUpperCase()}"</span>
                  </div>
                  <button
                    id="btn-restart-flow"
                    onClick={handleReset}
                    className="text-[10px] text-white hover:text-brand transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-black border border-[#222] px-3 py-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>

                {!isGenerating && !generatedTrack && !errorCode && (
                  <div className="animate-fade-in">
                    <FunkCustomizer
                      analysis={analysis}
                      onGenerate={handleGenerateFunk}
                      isGenerating={isGenerating}
                    />
                  </div>
                )}

                {/* Advanced immersive full-screen loading card */}
                {isGenerating && (
                  <div id="funk-generation-loader" className="bg-[#0a0a0a] border border-[#222] p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden font-mono">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand animate-pulse"></div>
                    
                    <div className="relative p-5 bg-brand/10 border border-brand/20">
                      <Disc className="w-12 h-12 text-brand animate-spin" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-white tracking-widest uppercase">Synthesizing 2-Minute Funk Track</h3>
                      <p className="text-[10px] text-[#555] uppercase">Generating custom MIDI lanes, brass partitions, and vocal algorithms with Lyria-3-Pro.</p>
                    </div>

                    {/* Active running server log steps */}
                    <div className="bg-black border border-[#222] p-4 text-left font-mono w-full max-w-md">
                      <div className="flex items-center gap-2 text-[9px] text-brand font-bold uppercase tracking-widest mb-2">
                        <span className="w-1.5 h-1.5 bg-brand animate-ping"></span>
                        <span>Synthesis Engine Status Log</span>
                      </div>
                      <p className="text-[11px] text-[#888] uppercase tracking-wide leading-relaxed">{generationStep}</p>
                    </div>

                    <p className="text-[9px] text-[#555] uppercase italic font-bold">This usually completes in under a minute. Ready player deck.</p>
                  </div>
                )}

                {/* Error boundary state */}
                {errorCode && (
                  <div id="generation-error-box" className="bg-[#0a0a0a] border border-red-900/50 p-6 space-y-4 font-mono text-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-red-950/20 text-red-500 border border-red-900/40">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Music Generation Failed</h3>
                        <p className="text-[10px] text-[#888] mt-1 leading-relaxed uppercase">
                          We hit an issue during Lyria model synthesis. This typically happens if the API key is not fully configured for paid model capabilities.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-black border border-[#222] text-[10px] text-red-400 max-h-36 overflow-y-auto">
                      {errorCode}
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        onClick={() => setErrorCode(null)}
                        className="px-4 py-2 hover:bg-white hover:text-black transition text-[10px] font-bold border border-[#222] uppercase tracking-wider cursor-pointer"
                      >
                        Bypass & Edit Options
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-brand text-black hover:bg-white transition text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Restart Flow
                      </button>
                    </div>
                  </div>
                )}

                {/* Finalized generated music track component */}
                {generatedTrack && !isGenerating && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Dynamic celebratory summary banner */}
                    <div className="bg-[#050505] border border-brand/35 p-4 flex items-center justify-between gap-3 font-mono text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-brand/10 text-brand border border-brand/20">⚡</span>
                        <div>
                          <p className="text-[10px] font-black text-brand uppercase tracking-widest">Mastering Complete</p>
                          <p className="text-[10px] text-[#888] uppercase mt-0.5">Your personalized 2-minute ultra-funk tracks have completed production.</p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-[10px] bg-black border border-[#222] hover:border-brand px-3 py-1.5 font-bold uppercase text-[#ccc] hover:text-brand transition-colors cursor-pointer"
                      >
                        Generate Another Remix
                      </button>
                    </div>

                    <MusicPlayer track={generatedTrack} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Styled Footer */}
        <footer id="app-footer" className="border-t border-[#222] py-6 bg-[#0a0a0a] mt-auto text-center text-[9px] text-[#555] font-mono uppercase tracking-widest leading-relaxed">
          <div>© 2026 Funk Music Generator • Designed with Google Lyria Integration Blueprint</div>
          <div className="mt-1">All music synthesized is generated server-side for complete security.</div>
        </footer>
      </div>

      {/* Tailwind rotation utility declaration */}
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
