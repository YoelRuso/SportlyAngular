import { Injectable, signal, effect } from '@angular/core';
import { Authentication } from './authentication';
import { FavoriteSport } from '../interfaces/favorite-sport';
import { SportEvent } from '../interfaces/sportevent';
import { SportsData } from './sports-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteSports {
  private favoriteSportEventsSignal = signal<SportEvent[]>([]);
  private favoriteSportIdsSignal = signal<FavoriteSport[]>([]);
  private userSignal!: any;

  constructor(
    private auth: Authentication,
    private sportsData: SportsData,
    private sqliteService: SqliteService,
  ) {
    this.userSignal = toSignal(this.auth.user$, { initialValue: null });

    effect((onCleanup) => {
      const user = this.userSignal();
      let cancelled = false;
      if (user) {
        void this.loadFavoriteSportIds(user.uid, () => cancelled);
      } else {
        this.favoriteSportEventsSignal.set([]);
        this.favoriteSportIdsSignal.set([]);
      }

      onCleanup(() => {
        cancelled = true;
      });
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

  async reloadFavorites(): Promise<void> {
    const user = this.userSignal();
    if (!user) {
      this.favoriteSportEventsSignal.set([]);
      this.favoriteSportIdsSignal.set([]);
      return;
    }

    await this.loadFavoriteSportIds(user.uid);
  }

  private async _addFavoriteSport(idEvent: string, userId: string): Promise<void> {
    const favorite: FavoriteSport = { idEvent, userID: userId };
    try {
      if (this.favoriteSportIdsSignal().some((item) => item.idEvent === idEvent)) {
        return;
      }

      await this.sqliteService.addFavoriteSport(userId, idEvent);
      this.favoriteSportIdsSignal.update((current) => [...current, favorite]);
    } catch (error) {
      console.error('Error adding favorite sport:', error);
    }
  }

  private async _deleteFavoriteSport(idEvent: string, userId: string): Promise<void> {
    try {
      await this.sqliteService.deleteFavoriteSport(userId, idEvent);
      this.favoriteSportIdsSignal.update((current) => current.filter((item) => item.idEvent !== idEvent));
    } catch (error) {
      console.error('Error deleting favorite sport:', error);
    }
  }

  private async loadFavoriteSportIds(
    userId: string,
    isCancelled: () => boolean = () => false,
  ): Promise<void> {
    try {
      const favorites = await this.sqliteService.getFavoriteSports(userId);
      if (!isCancelled()) {
        this.favoriteSportIdsSignal.set(favorites);
      }
    } catch (err) {
      console.error('Error fetching favorite sport ids:', err);
      if (!isCancelled()) {
        this.favoriteSportIdsSignal.set([]);
      }
    }
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
