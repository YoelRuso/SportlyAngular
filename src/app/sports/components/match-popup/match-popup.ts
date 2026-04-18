import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportEvent } from '../../interfaces/sportevent';

@Component({
  selector: 'app-match-popup',
  imports: [CommonModule],
  templateUrl: './match-popup.html',
  styleUrl: './match-popup.css',
})
export class MatchPopup {
  @Input() event!: SportEvent;
  @Output() close = new EventEmitter<void>();

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      this.close.emit();
    }
  }

  get title(): string {
    const key = (this.event?.strSport || '').toLowerCase();
    if (key === 'soccer' || key === 'basketball' || key === 'basket') {
      return `${this.event?.strHomeTeam || 'Local'} VS ${this.event?.strAwayTeam || 'Visitante'}`;
    }
    return this.event?.strEvent || 'Evento deportivo';
  }

  get badge(): string {
    const key = (this.event?.strSport || '').toLowerCase();
    if (key === 'soccer') return 'Fútbol';
    if (key === 'basketball' || key === 'basket') return 'Baloncesto';
    if (key === 'tennis' || key === 'tenis') return 'Tenis';
    if (key === 'motorsport' || key === 'f1') return 'F1';
    return this.event?.strSport || 'Deporte';
  }

  get image(): string {
    return (
      this.event?.strThumb ||
      this.event?.strPoster ||
      this.event?.strBanner ||
      this.event?.strSquare ||
      ''
    );
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
    return source ? source.slice(0, 5) : 'Por confirmar';
  }

  get score(): string {
    const home = this.event?.intHomeScore ?? null;
    const away = this.event?.intAwayScore ?? null;
    if (home === null && away === null) return 'Por confirmar';
    return `${home ?? '-'} - ${away ?? '-'}`;
  }

  get isSoccer(): boolean {
    const key = (this.event?.strSport || '').toLowerCase();
    return key === 'soccer' || key === 'basketball' || key === 'basket';
  }
}
