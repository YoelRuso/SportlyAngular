import { Component } from '@angular/core';
import { CommonModule, AsyncPipe, NgClass, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, AsyncPipe, NgIf, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
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
