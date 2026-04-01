import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { Navbar } from '../../components/navbar/navbar';
import { CardInit } from '../../components/card-init/card-init';
import { SportEvent } from '../../interfaces/sportevent';
import { SportsData } from '../../services/sports-data';

type SportKey = 'all' | 'soccer' | 'basketball' | 'tennis' | 'f1';

@Component({
  selector: 'app-home-page',
  imports: [Header, HeroBanner, Navbar, CardInit],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {
  events: SportEvent[] = [];
  favoriteIds = new Set<string>();
  hasLoadError = false;

  constructor(private readonly sportsData: SportsData) {
    this.loadEvents('all');
  }

  onSportSelected(sport: string): void {
    const selected = this.normalizeSport(sport);
    this.loadEvents(selected);
  }

  openMatchPopup(event: SportEvent): void {
    // Placeholder para modal/detalle
    console.log('Evento seleccionado:', event);
  }

  toggleFavorite(event: SportEvent): void {
    const id = String(event.idEvent ?? '');
    if (!id) {
      return;
    }

    if (this.favoriteIds.has(id)) {
      this.favoriteIds.delete(id);
      return;
    }

    this.favoriteIds.add(id);
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
      },
      error: (error: unknown) => {
        console.error('Error cargando eventos desde json-server:', error);
        this.events = [];
        this.hasLoadError = true;
      },
    });
  }

  protected readonly String = String;
}
