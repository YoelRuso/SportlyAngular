import { Injectable, signal, effect } from '@angular/core';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
  private favoriteSportEventsSignal = signal<SportEvent[]>([]);
  private favoriteSportIdsSignal = signal<FavoriteSport[]>([]);
  private userSignal!: any;

  constructor(private auth: Authentication, private sportsData: SportsData) {
    this.userSignal = toSignal(this.auth.user$, { initialValue: null });

    effect(() => {
      const user = this.userSignal();
      if (user) {
        this.getFavoriteSportIds(user.uid).subscribe({
          next: (ids) => this.favoriteSportIdsSignal.set(ids),
          error: (err) => console.error('Error fetching favorite sport ids:', err)
        });
        this.getFavoriteSportevents(user.uid).subscribe({
          next: (events) => this.favoriteSportEventsSignal.set(events),
          error: (err) => console.error('Error fetching favorite sports:', err)
        });
      } else {
        this.favoriteSportEventsSignal.set([]);
        this.favoriteSportIdsSignal.set([]);
      }
    });
  }

  get favoriteSportEvents() {
    return this.favoriteSportEventsSignal.asReadonly();
  }

  get favoriteSportIds() {
    return this.favoriteSportIdsSignal.asReadonly();
  }

  async addFavoriteSport(idEvent: string): Promise<void> {
    const user = this.userSignal();
    if (user) {
      await this._addFavoriteSport(idEvent, user.uid);
    } else {
      console.error('No user logged in');
    }
  }

  async deleteFavoriteSport(idEvent: string): Promise<void> {
    const user = this.userSignal();
    if (user) {
      await this._deleteFavoriteSport(idEvent, user.uid);
    } else {
      console.error('No user logged in');
    }
  }

  // returns idEvents from partidas-favoritas endpoint
  private getFavoriteSportIds(userId: string): Observable<FavoriteSport[]> {
    const q = query(
      collection(firestoreDb, 'partidas-favoritas'),
      where('userID', '==', userId)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data() as FavoriteSport)),
      catchError((err) => {
        console.error('Error fetching favorites:', err);
        return of([]);
      })
    );
  }

  // returns the entire sportevents
  private getFavoriteSportevents(userId: string): Observable<SportEvent[]> {
    return this.getFavoriteSportIds(userId).pipe(
      map((favorites) => favorites.map((f) => f.idEvent).filter((id) => id)),
      switchMap((idEvents) =>
        this.sportsData.getAllEvents().pipe(
          map((allEvents) => allEvents.filter((event) => idEvents.includes(event.idEvent)))
        )
      )
    );
  }

  // add new FavoriteSport with just the idEvent
  private async _addFavoriteSport(idEvent: string, userId: string): Promise<void> {
    const favorite: FavoriteSport = { idEvent, userID: userId };
    try {
      const user = this.userSignal();
      console.log("AUTH USER:", user);
      console.log("WRITING:", favorite);
      await addDoc(collection(firestoreDb, 'partidas-favoritas'), favorite);
      // Optionally refresh favorites after adding
      //const user = this.userSignal();
      if (user) {
        this.getFavoriteSportevents(user.uid).subscribe({
          next: (events) => this.favoriteSportEventsSignal.set(events),
          error: (err) => console.error('Error refreshing favorites:', err)
        });
      }
    } catch (error) {
      console.error('Error adding favorite sport:', error);
    }
  }

  // delete FavoriteSport by idEvent
  private async _deleteFavoriteSport(idEvent: string, userId: string): Promise<void> {
    try {
      const q = query(
        collection(firestoreDb, 'partidas-favoritas'),
        where('userID', '==', userId),
        where('idEvent', '==', idEvent)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await deleteDoc(doc(firestoreDb, 'partidas-favoritas', snapshot.docs[0].id));
      }
      // Refresh favorites after deletion
      this.getFavoriteSportIds(userId).subscribe({
        next: (ids) => this.favoriteSportIdsSignal.set(ids),
        error: (err) => console.error('Error refreshing favorite ids:', err)
      });
      this.getFavoriteSportevents(userId).subscribe({
        next: (events) => this.favoriteSportEventsSignal.set(events),
        error: (err) => console.error('Error refreshing favorite events:', err)
      });
    } catch (error) {
      console.error('Error deleting favorite sport:', error);
    }
  }
}
