import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// API Routes
app.get("/api/team-news/:teamName", async (req, res) => {
  try {
    const { teamName } = req.params;
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    const prompt = `Hoje é ${currentDate}. Você é um jornalista especializado em futebol brasileiro que tem acesso às notícias de última hora. 
    Retorne as 5 notícias MAIS RECENTES (de hoje ou no máximo ontem) sobre o ${teamName}. 
    Seja específico: nomes de jogadores contratados, placares reais de jogos que aconteceram nesta rodada do Brasileirão 2024/2025.
    Formate como um JSON array de objetos: [{"title": "...", "summary": "...", "date": "...", "source": "...", "url": "..."}].
    Responda APENAS o JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanedJson));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/api/football-data/:teamName", async (req, res) => {
  try {
    const { teamName } = req.params;
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Hoje é ${currentDate}. Atue como um analista de dados esportivos.
    Gere um relatório real e atualizado para o ${teamName} no Campeonato Brasileiro 2024/2025.
    USE SEU CONHECIMENTO MAIS RECENTE E PESQUISE MENTALMENTE OS ÚLTIMOS RESULTADOS.
    Inclua:
    1. Tabela de classificação ATUAL (top 6 + posição do ${teamName}). Verifique os pontos reais.
    2. ÚLTIMOS 2 JOGOS REAIS do ${teamName} (com placar, data exata e adversário).
    3. Elenco principal exato (jogadores titulares no último jogo).
    4. Slogan ou título da sala de troféus (ex: Decacampeão, Bi-Mundial).
    
    Responda APENAS um JSON com este formato:
    {
      "standings": [{"rank": number, "team": "string", "points": number, "played": number, "wins": number, "draws": number, "losses": number, "goalsDiff": number}],
      "lastMatches": [{"home": "string", "away": "string", "score": "string", "date": "string", "venue": "string"}],
      "squad": [{"name": "string", "position": "string", "number": number}],
      "trophies": ["string"]
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanedJson));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function startServer() {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
