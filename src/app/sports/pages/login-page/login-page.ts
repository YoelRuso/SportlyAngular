import { Component, inject } from '@angular/core';
import { Authentication } from '../../services/authentication'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export default class LoginPage {
  auth = inject(Authentication);
  router = inject(Router);

  password: string = '';
  email: string = '';
  error: string = '';
  loading: boolean = false;

  // User Pressed Login button
  async onLogin() {
      console.log("Loginprocess started");
    this.error = '';
    this.loading = true;

    try {
      this.auth.login(this.email, this.password);
      console.log("Succesfully logged in");
      this.router.navigate(['/profile']);
    }
    catch (err: any) {
      this.error = err.message || 'no puede entrar';
    }
    finally {
      console.log("Loginprocess over");
      this.loading = false;
    }
  }
}
