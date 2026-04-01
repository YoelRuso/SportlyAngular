import { Injectable } from '@angular/core';
import { SportEvent } from '../interfaces/sportevent';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Injectable({
  providedIn: 'root',
})
export class SportsData {
  private readonly events: SportEvent[] = [
    {
      idEvent: '1001',
      strSport: 'Soccer',
      strHomeTeam: 'FC Barcelona',
      strAwayTeam: 'Real Sociedad',
      strLeague: 'LaLiga',
      intRound: 31,
      intHomeScore: 2,
      intAwayScore: 1,
      dateEvent: '2026-04-04',
      strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/xxyvtu1448813215.png',
      strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/xttxyt1455464705.png',
    },
    {
      idEvent: '1002',
      strSport: 'Soccer',
      strHomeTeam: 'Liverpool',
      strAwayTeam: 'Chelsea',
      strLeague: 'Premier League',
      intRound: 33,
      intHomeScore: 3,
      intAwayScore: 2,
      dateEvent: '2026-04-06',
      strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/uvxxvr1421432996.png',
      strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png',
    },
    {
      idEvent: '2001',
      strSport: 'Basketball',
      strEvent: 'Lakers vs Celtics',
      strHomeTeam: 'Lakers',
      strAwayTeam: 'Celtics',
      strLeague: 'NBA',
      intHomeScore: 104,
      intAwayScore: 99,
      dateEvent: '2026-04-07',
      strThumb: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200',
    },
    {
      idEvent: '2002',
      strSport: 'Basketball',
      strEvent: 'Warriors vs Suns',
      strHomeTeam: 'Warriors',
      strAwayTeam: 'Suns',
      strLeague: 'NBA',
      intHomeScore: 110,
      intAwayScore: 108,
      dateEvent: '2026-04-09',
      strThumb: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
    },
    {
      idEvent: '3001',
      strSport: 'Tennis',
      strEvent: 'Carlos Alcaraz vs Jannik Sinner',
      strLeague: 'ATP Masters 1000',
      strDescriptionEN: 'Cuartos de final en pista central.',
      dateEvent: '2026-04-10',
      strThumb: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200',
    },
    {
      idEvent: '3002',
      strSport: 'Tennis',
      strEvent: 'Iga Swiatek vs Coco Gauff',
      strLeague: 'WTA 1000',
      strDescriptionEN: 'Semifinal femenina.',
      dateEvent: '2026-04-11',
      strThumb: 'https://images.unsplash.com/photo-1595435934011-efc6a87d4d80?w=1200',
    },
    {
      idEvent: '4001',
      strSport: 'Motorsport',
      strEvent: 'Grand Prix de Japon',
      strLeague: 'Formula 1',
      strVenue: 'Suzuka Circuit',
      strCity: 'Suzuka',
      strCountry: 'Japan',
      dateEvent: '2026-04-12',
      strThumb: 'https://images.unsplash.com/photo-1541773367336-d56e5d0f6d01?w=1200',
    },
    {
      idEvent: '4002',
      strSport: 'F1',
      strEvent: 'Grand Prix de Italia',
      strLeague: 'Formula 1',
      strVenue: 'Autodromo Nazionale Monza',
      strCity: 'Monza',
      strCountry: 'Italy',
      dateEvent: '2026-04-19',
      strThumb: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200',
    },
    {
      idEvent: '5001',
      strSport: 'Soccer',
      strHomeTeam: 'Atletico Madrid',
      strAwayTeam: 'Sevilla',
      strLeague: 'LaLiga',
      intRound: 31,
      intHomeScore: 1,
      intAwayScore: 1,
      dateEvent: '2026-04-13',
      strHomeTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/yywpwx1421433159.png',
      strAwayTeamBadge: 'https://www.thesportsdb.com/images/media/team/badge/utvwwu1421433162.png',
    },
  ];

  getEventsBySport(sport: SportKey): SportEvent[] {
    if (sport === 'all') {
      return this.events;
    }

    return this.events.filter((event) => {
      const value = (event.strSport || '').toLowerCase();
      if (sport === 'f1') {
        return value === 'f1' || value === 'motorsport';
      }
      return value === sport;
    });
  }
}
