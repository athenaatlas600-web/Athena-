import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Helper for lazy loading Gemini GenAI
  let aiClient: GoogleGenAI | null = null;
  function getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your AI Studio Secrets panel.");
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // API: Analyze YouTube song link
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "No URL provided" });
      }

      console.log(`Analyzing URL: ${url}`);
      const ai = getAIClient();

      // Build a prompt that uses Google Search grounding to identify details of the link
      const prompt = `Research the song at this YouTube/Music link: "${url}".
Identify the official title, artist name, original genre, tempo (BPM estimate), and other signature characteristics.
Formulate a unique, high-quality detailed prompt to create an "ultra funk" version of it.
Include suggestions for heavy basslines, horn sections, synth work, and funky drumming suited to the original song elements.`;

      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        tools: [{ type: "google_search" }],
        response_format: {
          type: Type.OBJECT,
          properties: {
            found: { type: Type.BOOLEAN, description: "Whether the song was found on YouTube/Google" },
            title: { type: Type.STRING, description: "The song's title" },
            artist: { type: Type.STRING, description: "The artist or creator of the song" },
            genre: { type: Type.STRING, description: "Original genre of the song" },
            bpm: { type: Type.INTEGER, description: "Estimated BPM or speed of the song" },
            characteristics: { type: Type.STRING, description: "Key features/vibe, core structure, and instrumentation of the original song" },
            transformationPrompt: { type: Type.STRING, description: "A detailed lyrical and sonic instruction prompt to feed to the Lyria generator, instructing it to make a high-energy, grooving ultra-funk version. Keep it strictly focused on music style, instruments, vocals, and song key." }
          },
          required: ["found", "title", "artist", "genre", "characteristics", "transformationPrompt"]
        }
      });

      // Extract text content from the interaction response
      let fullText = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textPart = step.content?.find(c => c.type === 'text');
          if (textPart?.text) {
            fullText += textPart.text;
          }
        }
      }

      console.log("Raw output from analysis:", fullText);

      // Extract JSON cleanly
      let analysisResult;
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/) || fullText.match(/([\{\[][\s\S]*[\}\]])/);
      if (jsonMatch) {
         try {
           analysisResult = JSON.parse(jsonMatch[1]);
         } catch (e) {
           analysisResult = JSON.parse(fullText);
         }
      } else {
        analysisResult = JSON.parse(fullText);
      }

      return res.json(analysisResult);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze YouTube music link" });
    }
  });

  // API: Generate Ultra Funk Music
  app.post("/api/generate", async (req, res) => {
    try {
      const {
        title,
        artist,
        transformationPrompt,
        tempo,                // "allegro", "groove", "doubletime" etc.
        style,                // "70s-p-funk", "80s-synth-funk", "nu-funk-electro", "slap-bass-disco", "funk-rock"
        instruments = [],     // array of string instruments
        length = "long",      // "short" (30s clip) or "long" (full track ~ 2 mins funk)
        vocalStyle = "soulful" // "soulful", "talkbox", "vocoder", "instrumental"
      } = req.body;

      console.log(`Generating music for: ${title} in style ${style}, length ${length}`);
      const ai = getAIClient();

      // Formulate the super-funkified Lyria prompt
      let funkPrompt = `Create an ultra-funk version of '${title}' by '${artist}'. `;
      if (transformationPrompt) {
        funkPrompt += `Transformation guidelines: ${transformationPrompt}. `;
      }

      funkPrompt += `Vibe: dynamic, highly-energetic, dancing, heavy groove, and syncopated rhythms. `;

      // Inject user customizations
      funkPrompt += `Style: This should be in the style of ${style}. `;
      if (tempo) {
        funkPrompt += `Tempo and energy: ${tempo}. `;
      }
      if (instruments && instruments.length > 0) {
        funkPrompt += `Key instruments featured: ${instruments.join(", ")}. `;
      }
      if (vocalStyle === "instrumental") {
        funkPrompt += `Ensure this is a pure high-energy instrumental track with no vocals, focusing completely on instrument solos. `;
      } else {
        funkPrompt += `Vocals: Feature ${vocalStyle} funk vocals. `;
      }

      // Add a final punchy instruction
      funkPrompt += `Focus on a massive walking or slap bassline, precise tight horn stabs, syncopated rhythm guitars, and classic funk drum beats with occasional groove fills. Make it extremely catchy, authentic, and danceable!`;

      console.log(`Final Lyria prompt: ${funkPrompt}`);

      const modelName = length === "short" ? "lyria-3-clip-preview" : "lyria-3-pro-preview";

      // Call Lyria with the prompt
      const stream = await ai.models.generateContentStream({
        model: modelName,
        contents: funkPrompt,
      });

      let audioBase64 = "";
      let lyrics = "";
      let mimeType = "audio/wav";

      for await (const chunk of stream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        throw new Error("No audio was returned from the Lyria model. Check model permissions and try again.");
      }

      console.log(`Successfully generated ${audioBase64.length} bytes of audio data!`);

      return res.json({
        audioBase64,
        mimeType,
        lyrics,
        promptUsed: funkPrompt,
      });

    } catch (err: any) {
      console.error("Music generation failed:", err);
      return res.status(500).json({ error: err.message || "Failed to generate funk track" });
    }
  });

  // Vite Integration Middlewares
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
