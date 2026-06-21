export interface SongAnalysis {
  found: boolean;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  characteristics: string;
  transformationPrompt: string;
}

export type FunkStyle = '70s-p-funk' | '80s-synth-funk' | 'nu-funk-electro' | 'slap-bass-disco' | 'funk-rock';
export type VocalStyle = 'soulful' | 'talkbox' | 'vocoder' | 'instrumental';
export type FunkLength = 'short' | 'long';

export interface FunkOptions {
  tempo: string;
  style: FunkStyle;
  instruments: string[];
  length: FunkLength;
  vocalStyle: VocalStyle;
}

export interface GeneratedTrack {
  audioUrl: string;
  mimeType: string;
  lyrics: string;
  promptUsed: string;
  title: string;
  artist: string;
}
