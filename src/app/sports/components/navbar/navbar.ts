import { Component } from '@angular/core';
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
  mobileMenuOpen = false;
  isLoggedIn$: Observable<boolean> = of(false);

  toggleAuth() {
    // Implementar lógica de login
  }

  logout() {
    // Implementar lógica de logout
  }

  handleAvatarClick() {
    // Implementar lógica de clic en avatar
  }
}
