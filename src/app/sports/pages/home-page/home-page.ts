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

  constructor(private readonly sportsData: SportsData) {
    this.events = this.sportsData.getEventsBySport('all');
  }

  onSportSelected(sport: string): void {
    const selected = this.normalizeSport(sport);
    this.events = this.sportsData.getEventsBySport(selected);
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

  protected readonly String = String;
}
