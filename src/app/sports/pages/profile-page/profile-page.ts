import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Authentication } from '../../services/authentication';
import { FavoriteSports } from '../../services/favorite-sports';

@Component({
  selector: 'app-profile-page',
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export default class ProfilePage {
  auth = inject(Authentication);
  favoriteSportsService = inject(FavoriteSports);

  email = this.auth.getCurrentUser()?.email;
  userUUID = this.auth.getCurrentUser()?.uid;

  sports = this.favoriteSportsService.favoriteSports;
}
