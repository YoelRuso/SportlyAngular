import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export default class ProfilePage {
  auth = inject(Authentication);

  email = this.auth.getCurrentUser()?.email;
  userUUID = this.auth.getCurrentUser()?.uid;
}
