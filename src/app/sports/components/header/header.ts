import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authentication, UserProfile } from '../../services/authentication';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly router = inject(Router);
  public readonly auth = inject(Authentication);
  
  mobileMenuOpen = false;
  
  isLoggedIn = toSignal(this.auth.user$, {initialValue: null});
  userProfile = toSignal(this.auth.profile$, {initialValue: null});

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        console.log('Header: userProfile loaded', !!profile.photoBase64);
      }
    });
  }

  handleAvatarClick() {
    if (this.auth.getCurrentUser()) {
      this.router.navigate(['/profile']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
