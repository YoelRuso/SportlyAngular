import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authentication } from '../../services/authentication';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, AsyncPipe, NgIf, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  router = inject(Router);
  auth = inject(Authentication);
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
    if (this.auth.getCurrentUser()) {
      this.router.navigate(['/profile']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
