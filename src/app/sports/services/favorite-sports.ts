import { Injectable, signal, effect, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, setDoc, writeBatch } from '@angular/fire/firestore'
import { Authentication } from './authentication';
import { FavoriteSport } from '../interfaces/favorite-sport';
import { SportEvent } from '../interfaces/sportevent';
import { SportsData } from './sports-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subscription, from, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteSports {
  firestore = inject(Firestore);
  private favoriteSportEventsSignal = signal<SportEvent[]>([]);
  private favoriteSportIdsSignal = signal<FavoriteSport[]>([]);
  private userSignal!: any;

  constructor(private auth: Authentication, private sportsData: SportsData) {
    this.userSignal = toSignal(this.auth.user$, { initialValue: null });

    effect((onCleanup) => {
      const user = this.userSignal();
      let idsSubscription: Subscription | null = null;
      if (user) {
        idsSubscription = this.getFavoriteSportIds(user.uid).subscribe({
          next: (ids) => this.favoriteSportIdsSignal.set(ids),
          error: (err) => console.error('Error fetching favorite sport ids:', err),
        });
      } else {
        this.favoriteSportEventsSignal.set([]);
        this.favoriteSportIdsSignal.set([]);
      }

      onCleanup(() => idsSubscription?.unsubscribe());
    });

    effect(() => {
      const ids = this.favoriteSportIdsSignal()
        .map((sport) => sport.idEvent)
        .filter((id): id is string => Boolean(id));

      this.loadFavoriteEvents(ids);
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
      collection(this.firestore, 'partidas-favoritas'),
      where('userID', '==', userId)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const favorites = snapshot.docs.map((doc) => doc.data() as FavoriteSport);
        const uniqueByEvent = new Map<string, FavoriteSport>();
        favorites.forEach((favorite) => {
          const idEvent = favorite.idEvent;
          if (idEvent && !uniqueByEvent.has(idEvent)) {
            uniqueByEvent.set(idEvent, favorite);
          }
        });
        return Array.from(uniqueByEvent.values());
      }),
      catchError((err) => {
        console.error('Error fetching favorites:', err);
        return of([]);
      })
    );
  }

  // add new FavoriteSport with just the idEvent
  private async _addFavoriteSport(idEvent: string, userId: string): Promise<void> {
    const favorite: FavoriteSport = { idEvent, userID: userId };
    try {
      if (this.favoriteSportIdsSignal().some((item) => item.idEvent === idEvent)) {
        return;
      }

      const favoriteDocId = this.favoriteDocId(userId, idEvent);
      await setDoc(doc(this.firestore, 'partidas-favoritas', favoriteDocId), favorite, { merge: true });
      this.favoriteSportIdsSignal.update((current) => [...current, favorite]);
    } catch (error) {
      console.error('Error adding favorite sport:', error);
    }
  }

  // delete FavoriteSport by idEvent
  private async _deleteFavoriteSport(idEvent: string, userId: string): Promise<void> {
    try {
      const favoriteQuery = query(
        collection(this.firestore, 'partidas-favoritas'),
        where('userID', '==', userId),
        where('idEvent', '==', idEvent)
      );
      const snapshot = await getDocs(favoriteQuery);
      const batch = writeBatch(this.firestore);
      snapshot.docs.forEach((favoriteDoc) => batch.delete(favoriteDoc.ref));
      batch.delete(doc(this.firestore, 'partidas-favoritas', this.favoriteDocId(userId, idEvent)));
      await batch.commit();
      this.favoriteSportIdsSignal.update((current) => current.filter((item) => item.idEvent !== idEvent));
    } catch (error) {
      console.error('Error deleting favorite sport:', error);
    }
  }

  async syncFavoriteSports(idEvents: string[]): Promise<void> {
    const user = this.userSignal();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const uniqueIds = Array.from(new Set(idEvents.filter((id) => id)));
    const batch = writeBatch(this.firestore);
    uniqueIds.forEach((idEvent) => {
      const ref = doc(this.firestore, 'partidas-favoritas', this.favoriteDocId(user.uid, idEvent));
      batch.set(ref, { idEvent, userID: user.uid }, { merge: true });
    });

    await batch.commit();
    this.favoriteSportIdsSignal.set(uniqueIds.map((idEvent) => ({ idEvent, userID: user.uid })));
  }

  private favoriteDocId(userId: string, idEvent: string): string {
    return `${userId}_${idEvent}`;
  }

  private loadFavoriteEvents(idEvents: string[]): void {
    this.sportsData.getEventsByIds(idEvents).subscribe({
      next: (events) => this.favoriteSportEventsSignal.set(events),
      error: (err) => {
        console.error('Error fetching favorite sports:', err);
        this.favoriteSportEventsSignal.set([]);
      },
    });
  }
}
