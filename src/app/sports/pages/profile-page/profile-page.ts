import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { FavoriteSports } from '../../services/favorite-sports';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

interface UserProfile {
  nombre: string;
  apellidos: string;
  email: string;
  photoBase64: string | null;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export default class ProfilePage implements OnInit {
  auth = inject(Authentication);
  favoriteSportsService = inject(FavoriteSports);
  firestore = inject(Firestore);

  email = this.auth.getCurrentUser()?.email;
  userUUID = this.auth.getCurrentUser()?.uid;

  sports = this.favoriteSportsService.favoriteSportEvents;

  profile = signal<UserProfile | null>(null);
  loadingProfile = signal(true);

  async ngOnInit(): Promise<void> {
    if (!this.userUUID) return;
    try {
      const snap = await getDoc(doc(this.firestore, 'users', this.userUUID));
      if (snap.exists()) {
        this.profile.set(snap.data() as UserProfile);
      }
    } catch (e) {
      console.error('Error cargando perfil:', e);
    } finally {
      this.loadingProfile.set(false);
    }
  }
}
