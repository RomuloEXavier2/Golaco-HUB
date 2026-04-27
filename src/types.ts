/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string;
  name: string;
  shortName: string;
  hubName: string;
  color: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score?: string;
  status: 'LIVE' | 'FINISHED' | 'SCHEDULED';
  date: string;
  time: string;
  venue: string;
  events?: MatchEvent[];
}

export interface MatchEvent {
  type: 'GOAL' | 'CARD' | 'PENALTY';
  player: string;
  minute: number;
  team: string;
  detail?: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  source: string;
  url: string;
}

export interface Player {
  name: string;
  position: string;
  number?: number;
  photo?: string;
}

export interface Standing {
  rank: number;
  team: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsDiff: number;
}

export const BRAZILIAN_TEAMS: Team[] = [
  { id: '1', name: 'Flamengo', shortName: 'FLA', hubName: 'Mengo', color: '#E4002B', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil_logo.svg' },
  { id: '2', name: 'Palmeiras', shortName: 'PAL', hubName: 'Alviverde', color: '#006437', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
  { id: '3', name: 'São Paulo', shortName: 'SAO', hubName: 'Tricolor', color: '#FE0000', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_S%C3%A3o_Paulo_FC.png' },
  { id: '4', name: 'Corinthians', shortName: 'COR', hubName: 'Timão', color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/pt/c/c7/Corinthians_logo.png' },
  { id: '5', name: 'Grêmio', shortName: 'GRE', hubName: 'Imortal', color: '#00ADEF', logo: 'https://upload.wikimedia.org/wikipedia/pt/f/f1/Gr%C3%AAmio_logo.png' },
  { id: '6', name: 'Internacional', shortName: 'INT', hubName: 'Colorado', color: '#F31B1B', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg' },
  { id: '7', name: 'Atlético Mineiro', shortName: 'CAM', hubName: 'Galo', color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Atletico_mineiro_logo.svg' },
  { id: '8', name: 'Cruzeiro', shortName: 'CRU', hubName: 'Raposa', color: '#2C49C7', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
  { id: '9', name: 'Botafogo', shortName: 'BOT', hubName: 'Alvinegro', color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Botafogo_de_Futebol_e_Regatas_logo.svg' },
  { id: '10', name: 'Vasco da Gama', shortName: 'VAS', hubName: 'Gigante', color: '#000000', logo: 'https://upload.wikimedia.org/wikipedia/pt/a/ac/CRVascoDaGama.png' },
  { id: '11', name: 'Fluminense', shortName: 'FLU', hubName: 'Guerreiro', color: '#821334', logo: 'https://upload.wikimedia.org/wikipedia/pt/a/a3/Fluminense_FC_escudo.png' },
  { id: '12', name: 'Bahia', shortName: 'BAH', hubName: 'Esquadrão', color: '#005CAB', logo: 'https://upload.wikimedia.org/wikipedia/pt/c/cf/Esporte_Clube_Bahia_logo.png' },
];
