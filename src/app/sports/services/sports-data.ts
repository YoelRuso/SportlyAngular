import { Injectable } from '@angular/core';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { SportEvent } from '../interfaces/sportevent';
import { forkJoin, from, map, Observable } from 'rxjs';
import { firestoreDb } from '../../initialize-firebase';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Injectable({
  providedIn: 'root',
})
export class SportsData {
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

  getAllEvents(): Observable<SportEvent[]> {
    return forkJoin([
      this.getCollection('soccer', 'Soccer'),
      this.getCollection('basket', 'Basketball'),
      this.getCollection('tenis', 'Tennis'),
      this.getCollection('f1', 'F1'),
    ]).pipe(map(([soccer, basket, tenis, f1]) => [...soccer, ...basket, ...tenis, ...f1]));
  }

  private getCollection(endpoint: string, defaultSport: string): Observable<SportEvent[]> {
    const collectionRef = collection(firestoreDb, endpoint);
    const collectionQuery = query(collectionRef, limit(5000));

    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const event = doc.data() as SportEvent;
          return { ...event, strSport: event.strSport || defaultSport };
        })
      )
    );
  }
}
