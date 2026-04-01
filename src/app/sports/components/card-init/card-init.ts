import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SportEvent } from '../../interfaces/sportevent';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-card-init',
  imports: [CommonModule, NgClass],
  templateUrl: './card-init.html',
  styleUrl: './card-init.css',
})
export class CardInit {
  @Input() event!: SportEvent;
  @Input() isFavorite = false;

  @Output() cardClick = new EventEmitter<SportEvent>();
  @Output() favoriteClick = new EventEmitter<SportEvent>();

  onCardClick(): void {
    this.cardClick.emit(this.event);
  }

  onFavClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.favoriteClick.emit(this.event);
  }

  get isSoccer(): boolean {
    return (this.event?.strSport || '').toLowerCase() === 'soccer';
  }

  get badge(): string {
    const key = (this.event?.strSport || '').toLowerCase();
    if (key === 'soccer') return 'Fútbol';
    if (key === 'basketball' || key === 'basket') return 'Baloncesto';
    if (key === 'tennis' || key === 'tenis') return 'Tennis';
    if (key === 'motorsport' || key === 'f1') return 'F1';
    return this.event?.strSport || 'Deporte';
  }

  get title(): string {
    const key = (this.event?.strSport || '').toLowerCase();

    if (key === 'soccer' || key === 'basketball' || key === 'basket') {
      return `${this.event?.strHomeTeam || 'Equipo local'} VS ${this.event?.strAwayTeam || 'Equipo visitante'}`;
    }

    if (key === 'tennis' || key === 'tenis') {
      return this.event?.strEvent || 'Evento de tenis';
    }

    if (key === 'motorsport' || key === 'f1') {
      return this.event?.strEvent || 'Evento F1';
    }

    return this.event?.strEvent || 'Evento deportivo';
  }

  get teams(): string {
    const home = this.event?.strHomeTeam || '';
    const away = this.event?.strAwayTeam || '';

    if (home || away) {
      return `${home || 'Equipo local'} vs ${away || 'Equipo visitante'}`;
    }

    return this.event?.strEvent || 'Equipos por confirmar';
  }

  get description(): string {
    const key = (this.event?.strSport || '').toLowerCase();

    if (key === 'soccer' || key === 'basketball' || key === 'basket') {
      const home = this.event?.intHomeScore ?? '-';
      const away = this.event?.intAwayScore ?? '-';
      const league = this.event?.strLeague || '';
      const round = this.event?.intRound ? `Jornada ${this.event.intRound}` : '';
      return [league, round, `Resultado: ${home}-${away}`].filter(Boolean).join(' · ');
    }

    if (key === 'tennis' || key === 'tenis') {
      return this.event?.strDescriptionEN || this.event?.strLeague || 'Partido de tenis';
    }

    if (key === 'motorsport' || key === 'f1') {
      const venue = this.event?.strVenue || '';
      const city = this.event?.strCity || '';
      const country = this.event?.strCountry || '';
      return (
        [venue, city, country].filter(Boolean).join(', ') || this.event?.strLeague || 'Carrera'
      );
    }

    return this.event?.strDescriptionEN || this.event?.strLeague || '';
  }

  get date(): string {
    const source = this.event?.dateEventLocal || this.event?.dateEvent;
    if (!source) return 'Por confirmar';

    const d = new Date(source);
    if (Number.isNaN(d.getTime())) return source;

    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  get time(): string {
    const source = this.event?.strTimeLocal || this.event?.strTime;
    if (!source) {
      return 'Por confirmar';
    }
    return source.slice(0, 5);
  }

  get place(): string {
    const venue = this.event?.strVenue || '';
    const country = this.event?.strCountry || '';
    return [venue, country].filter(Boolean).join(' - ') || 'Por confirmar';
  }

  get image(): string {
    return (
      this.event?.strThumb ||
      this.event?.strPoster ||
      this.event?.strBanner ||
      this.event?.strSquare ||
      'assets/images/tenis.png'
    );
  }
}
