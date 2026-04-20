import { Injectable } from '@angular/core';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { SportEvent } from '../interfaces/sportevent';
import { catchError, forkJoin, from, map, Observable, of, shareReplay } from 'rxjs';
import { firestoreDb } from '../../initialize-firebase';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Injectable({
  providedIn: 'root',
})
export class SportsData {
  private readonly cardLimit = 9;
  private readonly allEventsPerSportLimit = 120;
  private readonly cacheTtlMs = 5 * 60 * 1000;
  private readonly sportConfig: Record<Exclude<SportKey, 'all'>, { endpoint: string; label: string }> = {
    soccer: { endpoint: 'soccer', label: 'Soccer' },
    basketball: { endpoint: 'basket', label: 'Basketball' },
    tennis: { endpoint: 'tenis', label: 'Tennis' },
    f1: { endpoint: 'f1', label: 'F1' },
  };
  private readonly cache = new Map<string, { expiresAt: number; stream: Observable<SportEvent[]> }>();

  getEventsBySport(sport: SportKey): Observable<SportEvent[]> {
    if (sport === 'all') {
      return this.cachedQuery('events:all:cards', () => {
        const perSportLimit = Math.max(3, Math.ceil(this.cardLimit / Object.keys(this.sportConfig).length));
        return forkJoin([
          this.getCollection('soccer', 'Soccer', perSportLimit),
          this.getCollection('basket', 'Basketball', perSportLimit),
          this.getCollection('tenis', 'Tennis', perSportLimit),
          this.getCollection('f1', 'F1', perSportLimit),
        ]).pipe(map(([soccer, basket, tenis, f1]) => [...soccer, ...basket, ...tenis, ...f1].slice(0, this.cardLimit)));
      });
    }

    const { endpoint, label } = this.sportConfig[sport];
    return this.cachedQuery(`events:${sport}:cards`, () =>
      this.getCollection(endpoint, label, this.cardLimit).pipe(map((events) => events.slice(0, this.cardLimit)))
    );
  }

  getAllEvents(): Observable<SportEvent[]> {
    return this.cachedQuery(`events:all:full:${this.allEventsPerSportLimit}`, () =>
      forkJoin([
        this.getCollection('soccer', 'Soccer', this.allEventsPerSportLimit),
        this.getCollection('basket', 'Basketball', this.allEventsPerSportLimit),
        this.getCollection('tenis', 'Tennis', this.allEventsPerSportLimit),
        this.getCollection('f1', 'F1', this.allEventsPerSportLimit),
      ]).pipe(map(([soccer, basket, tenis, f1]) => [...soccer, ...basket, ...tenis, ...f1]))
    );
  }

  getEventsByIds(idEvents: string[]): Observable<SportEvent[]> {
    const uniqueIds = Array.from(new Set(idEvents.filter((id) => id)));
    if (!uniqueIds.length) {
      return of([]);
    }

    const chunkSize = 30;
    const chunks = this.chunk(uniqueIds, chunkSize);
    const sportEndpoints = Object.values(this.sportConfig);

    const cacheIdsKey = [...uniqueIds].sort().join(',');
    return this.cachedQuery(`events:ids:${cacheIdsKey}`, () => {
      const queries = sportEndpoints.flatMap(({ endpoint, label }) =>
        chunks.map((idsChunk) => this.getCollectionByIds(endpoint, label, idsChunk))
      );

      return forkJoin(queries).pipe(
        map((resultSets) => {
          const all = resultSets.flat();
          const byId = new Map(all.map((event) => [String(event.idEvent ?? ''), event]));
          return uniqueIds.map((id) => byId.get(id)).filter((event): event is SportEvent => Boolean(event));
        })
      );
    });
  }

  invalidateCache(prefix?: string): void {
    if (!prefix) {
      this.cache.clear();
      return;
    }

    Array.from(this.cache.keys())
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.cache.delete(key));
  }

  private getCollection(endpoint: string, defaultSport: string, maxDocs: number): Observable<SportEvent[]> {
    const collectionRef = collection(firestoreDb, endpoint);
    const collectionQuery = query(collectionRef, limit(maxDocs));

    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => this.normalizeEvent(doc.data() as SportEvent, defaultSport))),
      catchError((error) => {
        console.error(`Error fetching ${endpoint} events:`, error);
        return of([]);
      })
    );
  }

  private getCollectionByIds(endpoint: string, defaultSport: string, idEvents: string[]): Observable<SportEvent[]> {
    const collectionRef = collection(firestoreDb, endpoint);
    const collectionQuery = query(collectionRef, where('idEvent', 'in', idEvents));

    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => this.normalizeEvent(doc.data() as SportEvent, defaultSport))),
      catchError((error) => {
        console.error(`Error fetching events by ids from ${endpoint}:`, error);
        return of([]);
      })
    );
  }

  private normalizeEvent(event: SportEvent, defaultSport: string): SportEvent {
    return { ...event, strSport: event.strSport || defaultSport };
  }

  private chunk(items: string[], size: number): string[][] {
    const result: string[][] = [];
    for (let index = 0; index < items.length; index += size) {
      result.push(items.slice(index, index + size));
    }
    return result;
  }

  private cachedQuery(cacheKey: string, factory: () => Observable<SportEvent[]>): Observable<SportEvent[]> {
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.stream;
    }

    const stream = factory().pipe(shareReplay(1));
    this.cache.set(cacheKey, { expiresAt: now + this.cacheTtlMs, stream });
    return stream;
  }
}
