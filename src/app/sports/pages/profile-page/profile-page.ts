import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { FavoriteSports } from '../../services/favorite-sports';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IonContent } from '@ionic/angular/standalone';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

interface UserProfile {
  nombre: string;
  apellidos: string;
  email: string;
  photoBase64: string | null;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, Header, Footer],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export default class ProfilePage implements OnInit {
  private authService = inject(Authentication);
  favoriteSportsService = inject(FavoriteSports);
  firestore = inject(Firestore);

  // Variables reactivas
  email = signal<string | null>(null);
  userUUID = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);
  loadingProfile = signal(true);

  sports = this.favoriteSportsService.favoriteSportEvents;

  ngOnInit(): void {
    // Usamos el observer de Firebase para detectar al usuario incluso tras refrescar
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userUUID.set(user.uid);
        this.email.set(user.email);
        await this.cargarPerfilFirestore(user.uid);
      } else {
        this.loadingProfile.set(false);
        console.warn('No se encontró un usuario autenticado');
      }
    });
  }

  private async cargarPerfilFirestore(uid: string) {
    try {
      const docRef = doc(this.firestore, 'users', uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        this.profile.set(snap.data() as UserProfile);
      } else {
        console.warn('El documento del usuario no existe en Firestore');
      }
    } catch (e) {
      console.error('Error cargando perfil desde Firestore:', e);
    } finally {
      this.loadingProfile.set(false);
    }
  }

  ionViewWillEnter(): void {
    void this.favoriteSportsService.reloadFavorites();
  }
}
