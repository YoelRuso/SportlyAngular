import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  NgZone,
} from '@angular/core';
import { Header } from '../../components/header/header';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { Navbar } from '../../components/navbar/navbar';
import { CardInit } from '../../components/card-init/card-init';
import { SportEvent } from '../../interfaces/sportevent';
import { SportsData } from '../../services/sports-data';
import { Footer } from '../../components/footer/footer';
import { FavoriteSports } from '../../services/favorite-sports';
import { MatchPopup } from '../../components/match-popup/match-popup';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Component({
  selector: 'app-home-page',
  imports: [Header, HeroBanner, Navbar, CardInit, Footer, MatchPopup],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements OnInit {
  events: SportEvent[] = [];
  favoriteIds = new Set<string>();
  hasLoadError = false;
  selectedEvent: SportEvent | null = null;

  constructor(
    private favoriteSportsService: FavoriteSports,
    private readonly sportsData: SportsData,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadEvents('all');
    this.favoriteIds = new Set(
      this.favoriteSportsService
        .favoriteSportIds()
        .map((sport) => sport.idEvent)
        .filter((id): id is string => id !== undefined),
    );
  }

  openMatchPopup(event: SportEvent): void {
    this.ngZone.run(() => {
      this.selectedEvent = event;
      this.cdr.detectChanges();
    });
  }

  closePopup(): void {
    this.ngZone.run(() => {
      this.selectedEvent = null;
      this.cdr.detectChanges();
    });
  }

  onSportSelected(sport: string): void {
    const selected = this.normalizeSport(sport);
    this.loadEvents(selected);
  }

  toggleFavorite(event: SportEvent): void {
    const id = String(event.idEvent ?? '');
    if (!id) {
      // skip
    } else if (this.favoriteIds.has(id)) {
      this.favoriteSportsService.deleteFavoriteSport(id);
      this.favoriteIds.delete(id);
    } else {
      this.favoriteSportsService.addFavoriteSport(id);
      this.favoriteIds.add(id);
    }
  }

  private normalizeSport(value: string): SportKey {
    if (value === 'soccer' || value === 'basketball' || value === 'tennis' || value === 'f1') {
      return value;
    }
    return 'all';
  }

  private loadEvents(sport: SportKey): void {
    this.sportsData.getEventsBySport(sport).subscribe({
      next: (events) => {
        this.events = events;
        this.hasLoadError = false;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Error cargando eventos desde Firebase:', error);
        this.events = [];
        this.hasLoadError = true;
        this.cdr.markForCheck();
      },
    });
  }

  protected readonly String = String;
}
