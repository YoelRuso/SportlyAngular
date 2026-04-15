import { Injectable, signal, effect } from '@angular/core';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestoreDb } from '../../initialize-firebase';
import { Authentication } from './authentication';
import { FavoriteSport } from '../interfaces/favorite-sport';
import { SportEvent } from '../interfaces/sportevent';
import { SportsData } from './sports-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, from, map, catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteSports {
  private favoriteSportsSignal = signal<SportEvent[]>([]);
  private userSignal!: any;

  constructor(private auth: Authentication, private sportsData: SportsData) {
    this.userSignal = toSignal(this.auth.user$, { initialValue: null });

    effect(() => {
      const user = this.userSignal();
      if (user) {
        this.getFavoriteSports(user.uid).subscribe({
          next: (events) => this.favoriteSportsSignal.set(events),
          error: (err) => console.error('Error fetching favorite sports:', err)
        });
      } else {
        this.favoriteSportsSignal.set([]);
      }
    });
  }

  get favoriteSports() {
    return this.favoriteSportsSignal.asReadonly();
  }

  private getFavoriteSports(userId: string): Observable<SportEvent[]> {
    const q = query(
      collection(firestoreDb, 'partidas-favoritas'),
      where('userID', '==', userId)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data() as FavoriteSport)),
      map((favorites) => favorites.map((f) => f.idEvent).filter((id) => id)),
      switchMap((idEvents) =>
        this.sportsData.getAllEvents().pipe(
          map((allEvents) => allEvents.filter((event) => idEvents.includes(event.idEvent)))
        )
      ),
      catchError((err) => {
        console.error('Error fetching favorites:', err);
        return of([]);
      })
    );
  }
}
