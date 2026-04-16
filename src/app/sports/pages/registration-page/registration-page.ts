import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-registration-page',
  imports: [FormsModule,RouterLink, RouterLinkActive],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css',
})
export default class RegistrationPage {
  auth = inject(Authentication);
  router = inject(Router);

  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  async onRegistration() {
    this.loading = true;

    try {
      this.auth.register(this.email, this.password);
      console.log("Registration proccessed!");
      this.router.navigate(['/login']);
    }
    catch (err: any) {
      this.error = err.message;
    }
    finally {
      this.loading = false;
    }
  }
}
