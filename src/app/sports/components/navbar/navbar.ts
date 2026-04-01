import { Component, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  @Output() sportSelected = new EventEmitter<string>();

  activeSport: string = 'all';

  constructor(private readonly cdr: ChangeDetectorRef) {}

  selectSport(sport: string, event: Event): void {
    event.preventDefault();
    this.activeSport = sport;
    this.cdr.markForCheck();
    this.sportSelected.emit(sport);
  }
}
