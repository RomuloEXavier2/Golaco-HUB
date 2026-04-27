import React from 'react';
import { Team, BRAZILIAN_TEAMS } from './types';

// 🔥 SEU PROXY (Cloudflare Worker)
const PROXY = 'https://futebol-proxy.romuloexavier2.workers.dev';

export default function App() {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // 🔹 carrega time salvo
  React.useEffect(() => {
    const saved = localStorage.getItem('fav_team_id');
    if (saved) {
      const team = BRAZILIAN_TEAMS.find(t => t.id === saved);
      if (team) setSelectedTeam(team);
    }
  }, []);

  // 🔹 busca dados
  React.useEffect(() => {
    if (selectedTeam) fetchData(selectedTeam);
  }, [selectedTeam]);

  // 🔥 FETCH ROBUSTO
  const fetchData = async (team: Team) => {
    setLoading(true);

    try {
      const [resultsRes, standingsRes, upcomingRes] = await Promise.all([
        fetch(`${PROXY}?action=results&team=${encodeURIComponent(team.name)}`),
        fetch(`${PROXY}?action=standings`),
        fetch(`${PROXY}?action=upcoming&team=${encodeURIComponent(team.name)}`)
      ]);

      if (!resultsRes.ok || !standingsRes.ok || !upcomingRes.ok) {
        throw new Error("Erro na API");
      }

      const results = await resultsRes.json().catch(() => []);
      const standings = await standingsRes.json().catch(() => []);
      const upcoming = await upcomingRes.json().catch(() => []);

      setData({
        standings: Array.isArray(standings)
          ? standings.map((t: any) => ({
              rank: t.position || 0,
              team: t.team || "Desconhecido",
              points: t.points || 0,
              played: t.played || 0,
              goalsDiff: t.goalsDiff || 0
            }))
          : [],

        lastMatches: Array.isArray(results)
          ? results.map((m: any, i: number) => ({
              id: i.toString(),
              homeTeam: m.home || "Home",
              awayTeam: m.away || "Away",
              score: m.score || "-",
              status: m.status || "FINISHED",
              date: m.date || "",
              venue: "Brasileirão"
            }))
          : [],

        upcoming: Array.isArray(upcoming) ? upcoming : [],

        squad: [],
        trophies: [],

        news: [
          {
            title: `Dados atualizados do ${team.name}`,
            summary: 'Sistema conectado com API real.',
            source: 'Golaço HUB',
            date: 'Agora'
          }
        ]
      });

    } catch (err) {
      console.error("🔥 ERRO:", err);

      // 🔥 fallback seguro (evita tela branca)
      setData({
        standings: [],
        lastMatches: [],
        upcoming: [],
        squad: [],
        trophies: [],
        news: [
          {
            title: "Erro ao carregar dados",
            summary: "Verifique a API ou o proxy",
            source: "Sistema",
            date: "Agora"
          }
        ]
      });

    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    localStorage.setItem('fav_team_id', team.id);
  };

  const logout = () => {
    setSelectedTeam(null);
    localStorage.removeItem('fav_team_id');
    setData(null);
  };

  // 🔹 TELA INICIAL
  if (!selectedTeam) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-5xl font-black mb-10">Golaço HUB</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRAZILIAN_TEAMS.map(team => (
            <button
              key={team.id}
              onClick={() => handleSelectTeam(team)}
              className="bg-slate-900 p-4 rounded-xl hover:bg-slate-800"
            >
              <img src={team.logo} className="w-12 mx-auto mb-2" />
              <p className="text-xs">{team.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 🔹 APP PRINCIPAL
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        <h1 className="font-black">{selectedTeam.name}</h1>
        <button onClick={logout} className="text-xs text-gray-400">Trocar</button>
      </div>

      <div className="p-4 space-y-6">

        {loading && <p className="text-gray-400">Carregando...</p>}

        {data && (
          <>
            {/* RESULTADOS */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Últimos Jogos</h2>
              {data.lastMatches.length > 0 ? data.lastMatches.map((m: any) => (
                <div key={m.id} className="bg-slate-900 p-3 rounded-lg mb-2">
                  <p className="text-xs">{m.homeTeam} x {m.awayTeam}</p>
                  <p className="font-bold">{m.score}</p>
                </div>
              )) : <p className="text-xs text-gray-500">Sem dados</p>}
            </section>

            {/* TABELA */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Tabela</h2>
              {data.standings.length > 0 ? data.standings.slice(0,10).map((t: any) => (
                <div key={t.rank} className="flex justify-between text-xs border-b border-white/10 py-1">
                  <span>{t.rank}º {t.team}</span>
                  <span>{t.points} pts</span>
                </div>
              )) : <p className="text-xs text-gray-500">Sem dados</p>}
            </section>

            {/* PRÓXIMOS */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Próximos Jogos</h2>
              {data.upcoming.length > 0 ? data.upcoming.map((m: any, i: number) => (
                <div key={i} className="bg-slate-900 p-3 rounded-lg mb-2">
                  <p className="text-xs">{m.home} x {m.away}</p>
                  <p className="text-xs text-gray-400">{m.date}</p>
                </div>
              )) : <p className="text-xs text-gray-500">Sem dados</p>}
            </section>

            {/* NEWS */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Notícias</h2>
              {data.news.map((n: any, i: number) => (
                <div key={i} className="bg-slate-900 p-3 rounded-lg mb-2">
                  <p className="text-xs text-green-400">{n.source}</p>
                  <p className="font-bold text-sm">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.summary}</p>
                </div>
              ))}
            </section>
          </>
        )}

      </div>
    </div>
  );
}