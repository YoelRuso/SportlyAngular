import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SportEvent } from '../interfaces/sportevent';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Injectable({
  providedIn: 'root',
})
export class SportsData {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:3000';

  getEventsBySport(sport: SportKey): Observable<SportEvent[]> {
    if (sport === 'all') {
      return forkJoin([
        this.getCollection('soccer', 'Soccer'),
        this.getCollection('basket', 'Basketball'),
        this.getCollection('tenis', 'Tennis'),
        this.getCollection('f1', 'F1'),
      ]).pipe(
        map(([soccer, basket, tenis, f1]) => [...soccer, ...basket, ...tenis, ...f1].slice(0, 9))
      );
    }

    const endpoint = sport === 'basketball' ? 'basket' : sport === 'tennis' ? 'tenis' : sport;
    const label = sport === 'basketball' ? 'Basketball' : sport === 'tennis' ? 'Tennis' : sport;

    return this.getCollection(endpoint, label).pipe(map((events) => events.slice(0, 9)));
  }

  private getCollection(endpoint: string, defaultSport: string): Observable<SportEvent[]> {
    return this.http.get<SportEvent[]>(`${this.apiBase}/${endpoint}`).pipe(
      map((events) => events.map((event) => ({ ...event, strSport: event.strSport || defaultSport }))),
      catchError(() => of([]))
    );
  }
}
