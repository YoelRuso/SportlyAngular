import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() sportSelected = new EventEmitter<string>();

  activeSport: string = 'all';

  selectSport(sport: string, event: Event): void {
    event.preventDefault();
    this.activeSport = sport;
    this.sportSelected.emit(sport);
  }
}
