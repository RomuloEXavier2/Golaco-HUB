import React from 'react';
import { Trophy, Calendar, Table, Activity, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Team, NewsItem, Player, Match, Standing, BRAZILIAN_TEAMS } from './types';

// 🔥 URL DO SEU WORKER
const PROXY = 'https://futebol-proxy.romuloexavier2.workers.dev';

export default function App() {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('fav_team_id');
    if (saved) {
      const team = BRAZILIAN_TEAMS.find(t => t.id === saved);
      if (team) setSelectedTeam(team);
    }
  }, []);

  React.useEffect(() => {
    if (selectedTeam) fetchData(selectedTeam);
  }, [selectedTeam]);

  const fetchData = async (team: Team) => {
    setLoading(true);

    try {
      const [resultsRes, standingsRes, upcomingRes] = await Promise.all([
        fetch(`${PROXY}?action=results&team=${encodeURIComponent(team.name)}`),
        fetch(`${PROXY}?action=standings`),
        fetch(`${PROXY}?action=upcoming&team=${encodeURIComponent(team.name)}`)
      ]);

      const results = await resultsRes.json();
      const standings = await standingsRes.json();
      const upcoming = await upcomingRes.json();

      setData({
        standings: (standings || []).map((t: any) => ({
          rank: t.position,
          team: t.team,
          points: t.points,
          played: t.played,
          goalsDiff: t.goalsDiff || 0
        })),

        lastMatches: (results || []).map((m: any, i: number) => ({
          id: i.toString(),
          homeTeam: m.home,
          awayTeam: m.away,
          score: m.score,
          status: m.status,
          date: m.date,
          venue: 'Brasileirão'
        })),

        upcoming: upcoming || [],

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
      console.error(err);
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
              {data.lastMatches.map((m: any) => (
                <div key={m.id} className="bg-slate-900 p-3 rounded-lg mb-2">
                  <p className="text-xs">{m.homeTeam} x {m.awayTeam}</p>
                  <p className="font-bold">{m.score}</p>
                </div>
              ))}
            </section>

            {/* TABELA */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Tabela</h2>
              {data.standings.slice(0,10).map((t: any) => (
                <div key={t.rank} className="flex justify-between text-xs border-b border-white/10 py-1">
                  <span>{t.rank}º {t.team}</span>
                  <span>{t.points} pts</span>
                </div>
              ))}
            </section>

            {/* PRÓXIMOS */}
            <section>
              <h2 className="text-sm text-gray-400 mb-2">Próximos Jogos</h2>
              {data.upcoming.map((m: any, i: number) => (
                <div key={i} className="bg-slate-900 p-3 rounded-lg mb-2">
                  <p className="text-xs">{m.home} x {m.away}</p>
                  <p className="text-xs text-gray-400">{m.date}</p>
                </div>
              ))}
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
