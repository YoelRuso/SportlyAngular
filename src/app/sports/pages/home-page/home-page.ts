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

const PAGE_SIZE = 9;

@Component({
  selector: 'app-home-page',
  imports: [Header, HeroBanner, Navbar, CardInit, Footer, MatchPopup],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements OnInit {
  allEvents: SportEvent[] = [];
  fullEvents: SportEvent[] = [];
  events: SportEvent[] = [];
  hasLoadError = false;
  selectedEvent: SportEvent | null = null;

  currentPage = 1;
  pageSize = PAGE_SIZE;

  get totalPages(): number {
    return Math.ceil(this.allEvents.length / this.pageSize);
  }

  get compactPages(): (number | null)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // cantidad de páginas alrededor de la actual
    const range: (number | null)[] = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      } else if (
        range.length && range[range.length - 1] !== null
      ) {
        range.push(null);
      }
    }
    return range;
  }

  constructor(
    public favoriteSportsService: FavoriteSports,
    private readonly sportsData: SportsData,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPage();
    this.cdr.markForCheck();
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
    } else if (this.favoriteSportsService.favoriteSportIds().find(s => s.idEvent === id) != null) {
      this.favoriteSportsService.deleteFavoriteSport(id);
    } else {
      this.favoriteSportsService.addFavoriteSport(id);
    }
  }

  private applyPage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.events = this.allEvents.slice(start, start + this.pageSize);
  }

  private normalizeSport(value: string): SportKey {
    if (value === 'soccer' || value === 'basketball' || value === 'tennis' || value === 'f1') {
      return value;
    }
    return 'all';
  }

  private loadEvents(sport: SportKey): void {
    let filtered = this.fullEvents;
    if (sport !== 'all') {
      const label = this.getSportLabel(sport);
      filtered = this.fullEvents.filter(e => e.strSport === label);
    }
    this.allEvents = filtered;
    this.currentPage = 1;
    this.applyPage();
    this.hasLoadError = false;
    this.cdr.markForCheck();
  }

  private getSportLabel(sport: Exclude<SportKey, 'all'>): string {
    const labels = { soccer: 'Soccer', basketball: 'Basketball', tennis: 'Tennis', f1: 'Motorsport' };
    return labels[sport];
  }

  private loadAllEvents(): void {
    this.sportsData.getAllEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.fullEvents = events; // Store all loaded events
        this.currentPage = 1;
        this.applyPage();
        this.hasLoadError = false;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Error cargando todos los eventos desde Firebase:', error);
        this.allEvents = [];
        this.events = [];
        this.hasLoadError = true;
        this.cdr.markForCheck();
      },
    });
  }

  protected readonly String = String;
}
