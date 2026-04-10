import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

const MESES_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

interface CalendarEvent {
  label: string;
  sportLabel: string;
  time: string;
  venue: string;
}

@Component({
  selector: 'app-schedule-page',
  imports: [Header, Footer],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SchedulePage implements OnInit, OnDestroy {
  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  eventosPorFecha: Record<string, CalendarEvent[]> = {};

  selectedDayEvents: CalendarEvent[] = [];
  selectedDayTitle = '';
  modalOpen = false;

  weeks: (number | null)[][] = [];

  readonly diasSemana = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  readonly meses = MESES_ES;

  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeModal();
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.keyHandler);

    // Construye el calendario inmediatamente, sin esperar eventos
    this.buildCalendar();

    // Carga los eventos en segundo plano
    this.loadEvents().then(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyHandler);
  }

  get mesDisplay(): string { return MESES_ES[this.mesActual]; }

  prevMonth(): void {
    this.mesActual--;
    if (this.mesActual < 0) { this.mesActual = 11; this.anioActual--; }
    this.buildCalendar();
  }

  nextMonth(): void {
    this.mesActual++;
    if (this.mesActual > 11) { this.mesActual = 0; this.anioActual++; }
    this.buildCalendar();
  }

  prevYear(): void { this.anioActual--; this.buildCalendar(); }
  nextYear(): void { this.anioActual++; this.buildCalendar(); }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const hoy = new Date();
    return day === hoy.getDate() && this.mesActual === hoy.getMonth() && this.anioActual === hoy.getFullYear();
  }

  eventsForDay(day: number | null): CalendarEvent[] {
    if (!day) return [];
    const key = this.dateKey(day);
    return this.eventosPorFecha[key] ?? [];
  }

  openDay(day: number | null): void {
    if (!day) return;
    const key = this.dateKey(day);
    const eventos = this.eventosPorFecha[key] ?? [];
    const fecha = new Date(`${key}T12:00:00`);
    const formato = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(fecha);
    this.selectedDayTitle = formato.charAt(0).toUpperCase() + formato.slice(1);
    this.selectedDayEvents = eventos;
    this.modalOpen = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.modalOpen = false;
    this.cdr.markForCheck();
  }

  closeOnOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  private dateKey(day: number): string {
    return `${this.anioActual}-${String(this.mesActual + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  private buildCalendar(): void {
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const offset = primerDia === 0 ? 6 : primerDia - 1;

    const cells: (number | null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
    ];

    while (cells.length % 7 !== 0) cells.push(null);

    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
    this.cdr.markForCheck();
  }

  private async loadEvents(): Promise<void> {
    const sports = ['soccer', 'basket', 'tenis', 'f1'];
    try {
      const results = await Promise.all(
        sports.map(s =>
          fetch(`http://localhost:3000/${s}`)
            .then(r => r.ok ? r.json() : [])
            .catch(() => [])
        )
      );
      this.eventosPorFecha = {};
      results.flat().forEach((event: any) => {
        const fecha = event.dateEvent;
        if (!fecha) return;
        const label = event.strEvent ||
          (event.strHomeTeam && event.strAwayTeam ? `${event.strHomeTeam} vs ${event.strAwayTeam}` : 'Evento deportivo');
        const sport = (event.strSport || '').toLowerCase();
        const sportLabel = sport === 'soccer' ? '⚽' : sport === 'basketball' ? '🏀' : sport === 'tennis' ? '🎾' : sport === 'motorsport' ? '🏎️' : '🏅';
        if (!this.eventosPorFecha[fecha]) this.eventosPorFecha[fecha] = [];
        this.eventosPorFecha[fecha].push({ label, sportLabel, time: event.strTime || '', venue: event.strVenue || '' });
      });
    } catch (e) {
      console.error('Error cargando eventos:', e);
    }
  }
}
