import React, { useState } from "react";
import { Search, Sparkles, Youtube, CheckCircle2, Loader2 } from "lucide-react";
import { SongAnalysis } from "../types";

interface SongAnalyzerProps {
  onAnalysisComplete: (analysis: SongAnalysis) => void;
  initialUrl?: string;
}

export default function SongAnalyzer({ onAnalysisComplete, initialUrl = "" }: SongAnalyzerProps) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchStep, setSearchStep] = useState<string>("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSearchStep("Connecting to Google Search Grounding engine...");

    // Simulate progressive search grounding status messages for high-quality feel
    const steps = [
      "Accessing YouTube Music database...",
      "Resolving video details and artist information...",
      "Parsing original musical motifs, tempo, and structural key...",
      "Synthesizing Gemini analysis and funk transformation plans..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSearchStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 2200);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze link. Please make sure the URL is accessible.");
      }

      const data: SongAnalysis = await response.json();
      onAnalysisComplete(data);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An unexpected error occurred during song analysis.");
    } finally {
      setLoading(false);
      setSearchStep("");
    }
  };

  return (
    <div id="song-analyzer-container" className="bg-[#0a0a0a] border border-[#222] p-6 shadow-2xl relative">
      {/* High Density matrix detail accent */}
      <div className="absolute top-0 right-0 py-1 px-2.5 bg-brand text-black text-[9px] font-mono uppercase tracking-widest font-black select-none pointer-events-none">
        Decoder Core
      </div>

      <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
        <div className="p-2.5 bg-brand/10 border border-brand text-brand rounded-none">
          <Youtube className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[9px] font-mono text-brand tracking-widest uppercase">Input Module // Source Deck</span>
          <h2 className="text-sm font-black text-white tracking-widest uppercase font-mono">Source Music Analyzer</h2>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="relative">
          <input
            id="song-url-input"
            type="text"
            className="w-full bg-[#050505] border border-[#222] focus:border-brand text-xs text-[#e0e0e0] rounded-none py-3.5 pl-11 pr-4 placeholder-[#555] transition-all outline-none font-mono"
            placeholder="PASTE YOUTUBE OR MUSIC URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#555]" />
        </div>

        {error && (
          <div id="analyzer-error-message" className="p-3 bg-red-950/20 border-l-2 border-red-600 text-red-400 text-[10px] font-mono uppercase flex items-start gap-2">
            <span className="font-black">ERROR:</span>
            <span>{error}</span>
          </div>
        )}

        <button
          id="btn-analyze-vibe"
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-brand hover:bg-white text-black disabled:bg-[#111] disabled:text-[#444] font-black uppercase italic tracking-[0.2em] text-xs py-3.5 transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>RUNNING DECODING CORE...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>EXTRACT VIBE & DIRECTORY BLUEPRINT</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div id="analyzer-loading-status" className="mt-4 p-3 bg-[#080808] border border-[#222] flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-brand animate-spin flex-shrink-0" />
          <div className="flex-1 font-mono">
            <p className="text-[10px] text-brand font-bold uppercase tracking-wider">Grounding Diagnostics Engine Active</p>
            <p className="text-[9px] text-[#888] mt-0.5 uppercase tracking-wide">{searchStep || "SCANNING DATASTREAM..."}</p>
          </div>
        </div>
      )}

      {!loading && !error && url.includes("w7b6ckqgp5Y") && (
        <div className="mt-4 p-2.5 bg-[#080808] border-l-2 border-brand text-[10px] font-mono text-brand flex items-center gap-2 uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
          <span>LINK SECURED. SUBMIT BLUEPRINT REQUEST ABOVE.</span>
        </div>
      )}
    </div>
  );
}

