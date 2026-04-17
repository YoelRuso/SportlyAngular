import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authentication } from '../../services/authentication';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  router = inject(Router);
  auth = inject(Authentication);
  mobileMenuOpen = false;
  
  isLoggedIn = toSignal(this.auth.user$, {initialValue: null});

  handleAvatarClick() {
    if (this.auth.getCurrentUser()) {
      this.router.navigate(['/profile']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
